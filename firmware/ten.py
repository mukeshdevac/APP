"""
TEN Robotics - Native User Abstraction Library
Provides safe, leak-free access to ESP32 hardware and execution state.

v2.0: Added Motor, Servo, Sensor classes. Fixed big_print, skull, upset emojis.
"""

import machine
import time
import sh1106
import hardware

try:
    import store_manager
except ImportError:
    store_manager = None

# -- Module-level state --
_last_session_id = -1

# Cache __main__ reference to avoid re-importing on every is_running() call
_main_module = None

# -- Hardware Pin Map (mirrors hardware.py) --
# Bidirectional motors (M1–M3): IN1 + IN2 for PWM forward/backward
_MOTOR_PINS = {
    1: (hardware.M1_IN1, hardware.M1_IN2),
    2: (hardware.M2_IN1, hardware.M2_IN2),
    3: (hardware.M3_IN1, hardware.M3_IN2),
}

# Single-direction outputs (OUT1, OUT2): one IN pin each, forward only
_OUTPUT_PINS = {
    1: hardware.OUT1,
    2: hardware.OUT2,
}
_SERVO_PINS  = {1: hardware.S1, 2: hardware.S2, 3: getattr(hardware, 'S3', 33)}
_SENSOR_PINS = {1: hardware.SN1, 2: hardware.SN2, 3: hardware.SN3, 4: hardware.SN4}


# ─────────────────────────────────────────────────────────────────────────────
# Motor
# ─────────────────────────────────────────────────────────────────────────────
class Motor:
    """
    DC motor driver using PWM on IN1/IN2 pins.

    drive(speed): speed -100..100
      > 0 = forward
      < 0 = backward
      0   = stop (coast)
    """
    def __init__(self, index):
        pins = _MOTOR_PINS.get(index, _MOTOR_PINS[1])
        try:
            self._in1 = machine.PWM(machine.Pin(pins[0]), freq=1000)
            self._in2 = machine.PWM(machine.Pin(pins[1]), freq=1000)
        except Exception as e:
            print(f"Motor {index} init failed: {e}")
            self._in1 = self._in2 = None

    def drive(self, speed):
        if not self._in1:
            return
        speed = max(-100, min(100, int(speed)))
        duty  = int(abs(speed) / 100 * 1023)
        if speed > 0:
            self._in1.duty(duty)
            self._in2.duty(0)
        elif speed < 0:
            self._in1.duty(0)
            self._in2.duty(duty)
        else:
            self._in1.duty(0)
            self._in2.duty(0)

    def stop(self):
        """Coast stop — both pins LOW."""
        self.drive(0)

    def brake(self):
        """Active brake — both pins HIGH (DRV8833 brake mode)."""
        if not self._in1:
            return
        self._in1.duty(1023)
        self._in2.duty(1023)

    def deinit(self):
        """Release PWM resources."""
        if self._in1:
            self._in1.deinit()
        if self._in2:
            self._in2.deinit()


# ─────────────────────────────────────────────────────────────────────────────
# Output  (Single-Direction — DRV8833 B-channel, one motor per IN pin)
# ─────────────────────────────────────────────────────────────────────────────
class Output:
    """
    Single-direction output channel driven from a DRV8833 B-channel.

    Each output uses ONE IN pin only:
      - OUT1  →  DRV8833 #2 BIN1 (GP4)
      - OUT2  →  DRV8833 #2 BIN2 (GP5)

    run(speed):  speed 0..100  → 0% to 100% duty (forward only)
    stop():      cut power (coast)
    """
    def __init__(self, index: int):
        pin_num = _OUTPUT_PINS.get(index, _OUTPUT_PINS[1])
        try:
            self._pwm = machine.PWM(machine.Pin(pin_num), freq=1000)
        except Exception as e:
            print(f"Output {index} init failed: {e}")
            self._pwm = None

    def run(self, speed: int = 100):
        """Set output power. speed: 0–100."""
        if not self._pwm:
            return
        speed = max(0, min(100, int(speed)))
        self._pwm.duty(int(speed / 100 * 1023))

    def stop(self):
        """Turn output off."""
        if self._pwm:
            self._pwm.duty(0)

    def deinit(self):
        """Release PWM resource."""
        if self._pwm:
            self._pwm.deinit()


# ─────────────────────────────────────────────────────────────────────────────
# Stepper  (Bipolar 4-wire — DRV8833 #2, all 4 pins)
# ─────────────────────────────────────────────────────────────────────────────
class Stepper:
    """
    Bipolar stepper motor driven by DRV8833 #2 using full-step sequencing.

    Coil A → GP25 (AIN1) + GP23 (AIN2)  [same as M3]
    Coil B → GP4  (BIN1) + GP5  (BIN2)  [same as OUT1/OUT2]

    NOTE: Using Stepper occupies DRV8833 #2 fully.
          Do NOT use Motor(3) or Output(1/2) simultaneously.

    step(steps, delay_ms):
        steps     > 0  = clockwise
        steps     < 0  = counter-clockwise
        delay_ms  = time between steps (1–100 ms, default 10)
    """

    # Full-step electrical sequence (Coil A+, A−, Coil B+, B−)
    _SEQ = [
        (1, 0, 1, 0),  # A+ B+
        (0, 1, 1, 0),  # A- B+
        (0, 1, 0, 1),  # A- B-
        (1, 0, 0, 1),  # A+ B-
    ]

    def __init__(self):
        try:
            self._a1 = machine.Pin(hardware.STEP_IN1, machine.Pin.OUT)
            self._a2 = machine.Pin(hardware.STEP_IN2, machine.Pin.OUT)
            self._b1 = machine.Pin(hardware.STEP_IN3, machine.Pin.OUT)
            self._b2 = machine.Pin(hardware.STEP_IN4, machine.Pin.OUT)
            self._idx = 0
            self._coast()
        except Exception as e:
            print(f"Stepper init failed: {e}")
            self._a1 = None

    def _coast(self):
        """De-energize all coils (save power between moves)."""
        if not self._a1:
            return
        for pin in (self._a1, self._a2, self._b1, self._b2):
            pin.value(0)

    def _apply(self, idx):
        s = self._SEQ[idx & 3]
        self._a1.value(s[0])
        self._a2.value(s[1])
        self._b1.value(s[2])
        self._b2.value(s[3])

    def step(self, steps: int, delay_ms: int = 10) -> None:
        """Move stepper. steps > 0 = CW, steps < 0 = CCW. Interruptible via is_running()."""
        if not self._a1:
            return
        direction = 1 if steps >= 0 else -1
        delay_ms  = max(1, int(delay_ms))
        try:
            for _ in range(abs(steps)):
                self._idx = (self._idx + direction) & 3
                self._apply(self._idx)
                time.sleep_ms(delay_ms)
                is_running()   # allow STOP signal to interrupt mid-move
        finally:
            self._coast()      # always de-energize on finish or interrupt

    def move_degrees(self, degrees: float, delay_ms: int = 10) -> None:
        """
        Move stepper by a number of degrees.
        Uses hardware.STEPPER_STEPS_PER_REV for conversion.
        degrees > 0 = CW, degrees < 0 = CCW.
        """
        steps = int(abs(degrees) / 360 * hardware.STEPPER_STEPS_PER_REV)
        if degrees < 0:
            steps = -steps
        self.step(steps, delay_ms)

    def release(self) -> None:
        """Explicitly de-energize all coils (saves power, releases holding torque)."""
        self._coast()

    def deinit(self) -> None:
        """Release all stepper pins."""
        self._coast()


# ─────────────────────────────────────────────────────────────────────────────
# I2C Sensor helpers  (shared GP21/GP22 bus — Port 1 & Port 2)
# ─────────────────────────────────────────────────────────────────────────────
def i2c_read(addr: int, reg: int, nbytes: int = 1) -> int:
    """
    Read 1–4 bytes from an I2C sensor register and return as an integer.

    addr   : 7-bit I2C device address  (e.g. 0x68 for MPU-6050)
    reg    : register address to read  (e.g. 0x3B)
    nbytes : number of bytes to read   (1–4, default 1)

    Both physical I2C Port 1 and Port 2 share GP21/GP22.
    Returns 0 on any error.
    """
    global _i2c_bus
    try:
        if _i2c_bus is None:
            raise RuntimeError("I2C bus not initialized")
        raw = _i2c_bus.readfrom_mem(addr, reg, nbytes)
        result = 0
        for byte in raw:
            result = (result << 8) | byte
        return result
    except Exception as e:
        print(f"i2c_read error: {e}")
        return 0


def i2c_write(addr: int, reg: int, value: int) -> None:
    """Write a single byte to an I2C sensor register."""
    global _i2c_bus
    try:
        if _i2c_bus is None:
            raise RuntimeError("I2C bus not initialized")
        _i2c_bus.writeto_mem(addr, reg, bytes([value & 0xFF]))
    except Exception as e:
        print(f"i2c_write error: {e}")


def i2c_scan() -> list:
    """Return a list of all detected I2C device addresses on the shared bus."""
    global _i2c_bus
    try:
        if _i2c_bus is None:
            return []
        return _i2c_bus.scan()
    except Exception:
        return []


# ─────────────────────────────────────────────────────────────────────────────
# Servo
# ─────────────────────────────────────────────────────────────────────────────

class Servo:
    """
    RC Servo driver supporting both 180° (positional) and 360° (continuous) types.

    180° Servo methods:
        angle(deg)                     — absolute position 0–180°
        sweep(start, end, step, delay) — smooth sweep between two angles
        step(delta_deg)                — nudge ±degrees from current position

    360° Servo methods:
        run_360(speed)   — speed -100..100  (0=stop, +CW, -CCW)
        stop_360()       — send neutral pulse (stop continuous servo)
    """

    def __init__(self, index: int):
        pin_num = _SERVO_PINS.get(index, 18)
        self._current_deg = 90      # tracked for step() mode
        try:
            self._pwm = machine.PWM(machine.Pin(pin_num), freq=50)
        except Exception as e:
            print(f"Servo {index} init failed: {e}")
            self._pwm = None

    # ── internal ─────────────────────────────────────────────────────────────

    def _ns(self, deg: int) -> int:
        """Convert 0–180° to pulse width in nanoseconds (1 ms – 2 ms)."""
        return int(1_000_000 + (max(0, min(180, deg)) / 180) * 1_000_000)

    def _write_ns(self, ns: int) -> None:
        """Send pulse width; falls back to 10-bit duty on older MicroPython."""
        if not self._pwm:
            return
        try:
            self._pwm.duty_ns(ns)
        except AttributeError:
            self._pwm.duty(int(1023 * ns / 20_000_000))

    # ── 180° servo ───────────────────────────────────────────────────────────

    def angle(self, deg: int) -> None:
        """Move to absolute angle 0–180°."""
        if not self._pwm:
            return
        deg = max(0, min(180, int(deg)))
        self._current_deg = deg
        self._write_ns(self._ns(deg))

    def sweep(self, start_deg: int, end_deg: int,
              step_deg: int = 5, delay_ms: int = 20) -> None:
        """
        Smooth sweep from start_deg to end_deg.

        step_deg  : degrees per step   (default 5)
        delay_ms  : ms between steps   (default 20 ms  →  ~50 fps)
        """
        if not self._pwm:
            return
        start_deg = max(0, min(180, int(start_deg)))
        end_deg   = max(0, min(180, int(end_deg)))
        step_deg  = max(1, abs(int(step_deg)))
        delay_ms  = max(1, int(delay_ms))
        direction = 1 if end_deg >= start_deg else -1
        deg = start_deg
        while True:
            self.angle(deg)
            time.sleep_ms(delay_ms)
            if direction > 0 and deg >= end_deg:
                break
            if direction < 0 and deg <= end_deg:
                break
            deg = max(0, min(180, deg + direction * step_deg))
        self.angle(end_deg)

    def step(self, delta_deg: int) -> None:
        """Nudge ±degrees from the current position (tracks internally)."""
        new_deg = max(0, min(180, self._current_deg + int(delta_deg)))
        self.angle(new_deg)

    # ── 360° continuous servo ────────────────────────────────────────────────

    def run_360(self, speed: int) -> None:
        """
        Drive a 360° continuous rotation servo.

        speed :  -100 = full CCW
                    0 = stop
                 +100 = full CW
        Pulse mapping: -100→1000µs, 0→1500µs, +100→2000µs
        """
        if not self._pwm:
            return
        speed = max(-100, min(100, int(speed)))
        ns = int(1_500_000 + speed * 5_000)   # 1.0 ms – 2.0 ms range
        self._write_ns(ns)

    def stop_360(self) -> None:
        """Send neutral (1.5 ms) pulse — stops a continuous rotation servo."""
        self.run_360(0)

    def deinit(self) -> None:
        """Release PWM resource."""
        if self._pwm:
            self._pwm.deinit()



# ─────────────────────────────────────────────────────────────────────────────
# Sensor
# ─────────────────────────────────────────────────────────────────────────────
class Sensor:
    """
    Analog sensor reader (0–4095 raw, or use read_pct() for 0–100%).

    read():     raw 12-bit ADC value (0–4095)
    read_pct(): percentage value (0–100)
    """
    def __init__(self, index):
        pin_num = _SENSOR_PINS.get(index, 34)
        try:
            self._adc = machine.ADC(machine.Pin(pin_num))
            self._adc.atten(machine.ADC.ATTN_11DB)   # 0–3.3 V range
        except Exception as e:
            print(f"Sensor {index} init failed: {e}")
            self._adc = None

    def read(self):
        if not self._adc:
            return 0
        try:
            return self._adc.read()
        except Exception:
            return 0

    def read_pct(self):
        return int(self.read() * 100 / 4095)


# ─────────────────────────────────────────────────────────────────────────────
# Display Wrapper
# ─────────────────────────────────────────────────────────────────────────────
class DisplayWrapper:
    """A user-friendly, safe wrapper for the SSD1306 OLED (128×64)."""

    def __init__(self, oled_obj):
        self.oled   = oled_obj
        self._line_y = 0

    def init(self):
        self.clear()
        self.show()

    def clear(self):
        if self.oled:
            self.oled.fill(0)
        self._line_y = 0

    def print(self, text, x=0, y=None, size=1):
        if not self.oled:
            return
        try:
            target_y = y if y is not None else self._line_y
            text_str = str(text)
            if size == 1:
                self.oled.text(text_str, x, target_y, 1)
            else:
                import framebuf
                char_w = 8
                char_h = 8
                text_w = len(text_str) * char_w
                buf_size = (text_w * char_h + 7) // 8
                buf = bytearray(buf_size)
                fb = framebuf.FrameBuffer(buf, text_w, char_h, framebuf.MONO_HLSB)
                fb.fill(0)
                fb.text(text_str, 0, 0, 1)
                
                for row in range(char_h):
                    for col in range(text_w):
                        if fb.pixel(col, row):
                            self.oled.fill_rect(x + col * size, target_y + row * size, size, size, 1)

            if y is None:
                self._line_y += 10 * size
                if self._line_y > 54:
                    self._line_y = 0
        except Exception:
            pass

    def show(self):
        if self.oled:
            try:
                self.oled.show()
            except Exception:
                pass

    def big_print(self, text, scale=None):
        """
        Display text at a large scale, auto-centered on screen.

        scale: pixels per source pixel (auto-calculated to fit if None)
        """
        if not self.oled:
            return
        import framebuf

        text     = str(text)
        char_w   = 8
        char_h   = 8
        text_w   = len(text) * char_w

        # Auto-fit: pick the largest scale that fits 128×64
        if scale is None:
            scale = max(1, min(128 // text_w, 64 // char_h))
        scale = max(1, int(scale))

        # Clamp if explicit scale is too large
        if text_w * scale > 128:
            scale = max(1, 128 // text_w)

        # Render text into a small mono framebuf
        buf_size = (text_w * char_h + 7) // 8
        buf      = bytearray(buf_size)
        fb       = framebuf.FrameBuffer(buf, text_w, char_h, framebuf.MONO_HLSB)
        fb.fill(0)
        fb.text(text, 0, 0, 1)

        # Centre on 128×64 screen
        cx = max(0, (128 - text_w * scale) // 2)
        cy = max(0, (64  - char_h * scale) // 2)

        self.oled.fill(0)
        for row in range(char_h):
            for col in range(text_w):
                if fb.pixel(col, row):
                    self.oled.fill_rect(
                        cx + col * scale,
                        cy + row * scale,
                        scale, scale, 1
                    )
        self.oled.show()

    def emoji(self, name):
        """Display a full-screen emoji/icon by name."""
        if not self.oled:
            return
        import framebuf
        try:
            if name == 'heart':
                heart_data = bytearray([
                    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x01, 0xFF, 0xC0, 0x3F, 0xFC, 0x00,
                    0x00, 0x00, 0x0F, 0xFF, 0xF0, 0xFF, 0xFF, 0x00,
                    0x00, 0x00, 0x3F, 0xFF, 0xFC, 0xFF, 0xFF, 0x80,
                    0x00, 0x00, 0x7F, 0xFF, 0xFE, 0xFF, 0xFF, 0xC0,
                    0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xE0,
                    0x00, 0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF0,
                    0x00, 0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8,
                    0x00, 0x07, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFC,
                    0x00, 0x07, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFC,
                    0x00, 0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE,
                    0x00, 0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE,
                    0x00, 0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE,
                    0x00, 0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE,
                    0x00, 0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE,
                    0x00, 0x07, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFC,
                    0x00, 0x07, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFC,
                    0x00, 0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8,
                    0x00, 0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF0,
                    0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xE0,
                    0x00, 0x00, 0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0,
                    0x00, 0x00, 0x3F, 0xFF, 0xFF, 0xFF, 0xFF, 0x80,
                    0x00, 0x00, 0x1F, 0xFF, 0xFF, 0xFF, 0xFF, 0x00,
                    0x00, 0x00, 0x0F, 0xFF, 0xFF, 0xFF, 0xFE, 0x00,
                    0x00, 0x00, 0x07, 0xFF, 0xFF, 0xFF, 0xFC, 0x00,
                    0x00, 0x00, 0x03, 0xFF, 0xFF, 0xFF, 0xF8, 0x00,
                    0x00, 0x00, 0x01, 0xFF, 0xFF, 0xFF, 0xF0, 0x00,
                    0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0xE0, 0x00,
                    0x00, 0x00, 0x00, 0x7F, 0xFF, 0xFF, 0xC0, 0x00,
                    0x00, 0x00, 0x00, 0x3F, 0xFF, 0xFF, 0x80, 0x00,
                    0x00, 0x00, 0x00, 0x1F, 0xFF, 0xFF, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x0F, 0xFF, 0xFE, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x07, 0xFF, 0xFC, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x03, 0xFF, 0xF8, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x01, 0xFF, 0xF0, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0xFF, 0xE0, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x7F, 0xC0, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x3F, 0x80, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x1F, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x0E, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00
                ])
                fbuf = framebuf.FrameBuffer(heart_data, 64, 41, framebuf.MONO_HLSB)
                self.oled.fill(0)
                self.oled.blit(fbuf, 32, 11)
                self.oled.show()

            elif name == 'smile':
                smile_data = bytearray([
                    0x00, 0x00, 0x03, 0xFF, 0xC0, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x1F, 0xFF, 0xF8, 0x00, 0x00, 0x00,
                    0x00, 0x00, 0x7F, 0xFF, 0xFE, 0x00, 0x00, 0x00,
                    0x00, 0x01, 0xFF, 0xFF, 0xFF, 0x80, 0x00, 0x00,
                    0x00, 0x03, 0xFF, 0xFF, 0xFF, 0xC0, 0x00, 0x00,
                    0x00, 0x07, 0xFF, 0xFF, 0xFF, 0xE0, 0x00, 0x00,
                    0x00, 0x0F, 0xFF, 0xFF, 0xFF, 0xF0, 0x00, 0x00,
                    0x00, 0x1F, 0xFF, 0xFF, 0xFF, 0xF8, 0x00, 0x00,
                    0x00, 0x3F, 0xFF, 0xFF, 0xFF, 0xFC, 0x00, 0x00,
                    0x00, 0x7F, 0xFF, 0xFF, 0xFF, 0xFE, 0x00, 0x00,
                    0x00, 0xFF, 0xF0, 0xFF, 0x0F, 0xFF, 0x00, 0x00,
                    0x01, 0xFF, 0xC0, 0x7E, 0x03, 0xFF, 0x80, 0x00,
                    0x01, 0xFF, 0xC0, 0x7E, 0x03, 0xFF, 0x80, 0x00,
                    0x03, 0xFF, 0x80, 0x7E, 0x01, 0xFF, 0xC0, 0x00,
                    0x03, 0xFF, 0x80, 0x7E, 0x01, 0xFF, 0xC0, 0x00,
                    0x03, 0xFF, 0x80, 0x7E, 0x01, 0xFF, 0xC0, 0x00,
                    0x07, 0xFF, 0x80, 0x7E, 0x01, 0xFF, 0xE0, 0x00,
                    0x07, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0xE0, 0x00,
                    0x0F, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0xF0, 0x00,
                    0x0F, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0xF0, 0x00,
                    0x0F, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0xF0, 0x00,
                    0x1F, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0xF8, 0x00,
                    0x1F, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0xF8, 0x00,
                    0x1F, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0xF8, 0x00,
                    0x1F, 0xFF, 0x00, 0x00, 0x00, 0xFF, 0xF8, 0x00,
                    0x1F, 0xFF, 0x01, 0xFF, 0x80, 0xFF, 0xF8, 0x00,
                    0x1F, 0xFF, 0x03, 0xFF, 0xC0, 0xFF, 0xF8, 0x00,
                    0x1F, 0xFE, 0x07, 0xFF, 0xE0, 0x7F, 0xF8, 0x00,
                    0x0F, 0xFC, 0x00, 0x00, 0x00, 0x3F, 0xF0, 0x00,
                    0x0F, 0xF8, 0x00, 0x00, 0x00, 0x1F, 0xF0, 0x00,
                    0x0F, 0xF8, 0x1F, 0xFF, 0xF8, 0x1F, 0xF0, 0x00,
                    0x07, 0xF0, 0x7F, 0xFF, 0xFE, 0x0F, 0xE0, 0x00,
                    0x07, 0xE0, 0xFF, 0xFF, 0xFF, 0x07, 0xE0, 0x00,
                    0x03, 0xC0, 0xFF, 0xFF, 0xFF, 0x03, 0xC0, 0x00,
                    0x01, 0x81, 0xFF, 0xFF, 0xFF, 0x81, 0x80, 0x00,
                    0x00, 0x03, 0xFF, 0xFF, 0xFF, 0xC0, 0x00, 0x00,
                    0x00, 0x07, 0xFF, 0xFF, 0xFF, 0xE0, 0x00, 0x00,
                    0x00, 0x0F, 0xFF, 0xFF, 0xFF, 0xF0, 0x00, 0x00,
                    0x00, 0x1F, 0xFF, 0xFF, 0xFF, 0xF8, 0x00, 0x00,
                    0x00, 0x3F, 0xFF, 0xFF, 0xFF, 0xFC, 0x00, 0x00,
                    0x00, 0x7F, 0xFF, 0xFF, 0xFF, 0xFE, 0x00, 0x00,
                    0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00, 0x00,
                    0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x80, 0x00,
                    0x03, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0x00,
                    0x07, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xE0, 0x00,
                    0x0F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF0, 0x00,
                    0x1F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xF8, 0x00,
                    0x3F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFC, 0x00,
                    0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFE, 0x00,
                    0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x00
                ])
                fbuf = framebuf.FrameBuffer(smile_data, 64, 50, framebuf.MONO_HLSB)
                self.oled.fill(0)
                self.oled.blit(fbuf, 32, 7)
                self.oled.show()

            elif name == 'skull':
                # Drawn procedurally — no large bitmap needed
                o = self.oled
                o.fill(0)
                # Skull head (rounded-rect)
                o.fill_rect(28,  4, 72, 44, 1)
                o.fill_rect(22, 12, 84, 30, 1)
                # Erase rounded corners
                o.fill_rect(28,  4,  6,  4, 0)
                o.fill_rect(94,  4,  6,  4, 0)
                o.fill_rect(22, 12,  4,  6, 0)
                o.fill_rect(102,12,  4,  6, 0)
                # Eye sockets
                o.fill_rect(35, 16, 22, 18, 0)  # left eye
                o.fill_rect(71, 16, 22, 18, 0)  # right eye
                # Pupils (white dots inside dark sockets)
                o.fill_rect(43, 20, 6, 6, 1)
                o.fill_rect(79, 20, 6, 6, 1)
                # Nose cavity
                o.fill_rect(58, 30, 12,  9, 0)
                # Jaw
                o.fill_rect(28, 48, 72,  3, 1)   # jaw top bar
                for t in range(5):
                    o.fill_rect(30 + t * 14, 51, 10, 12, 1)  # teeth
                o.show()

            elif name == 'upset':
                # Drawn procedurally — unhappy face
                o = self.oled
                o.fill(0)
                # Face circle (approx)
                o.fill_rect(28, 4, 72, 56, 1)
                o.fill_rect(22, 14, 84, 36, 1)
                o.fill_rect(28,  4,  8,  8, 0)
                o.fill_rect(92,  4,  8,  8, 0)
                # Eyes (sad → straight horizontal slits)
                o.fill_rect(36, 22, 18,  5, 0)  # left eye
                o.fill_rect(74, 22, 18,  5, 0)  # right eye
                # Angry eyebrows (angled down toward centre)
                for i in range(5):
                    o.pixel(36 + i, 17 - i // 2, 0)
                    o.pixel(81 - i, 17 - i // 2, 0)
                # Downturned mouth (frown)
                o.fill_rect(40, 45, 48,  3, 0)   # mouth base
                o.fill_rect(40, 48,  6,  4, 0)   # left droop
                o.fill_rect(82, 48,  6,  4, 0)   # right droop
                o.show()

        except Exception as e:
            print("Emoji Error:", e)


# ─────────────────────────────────────────────────────────────────────────────
# Module initialisation
# ─────────────────────────────────────────────────────────────────────────────
tmp_i2c  = None
_i2c_bus = None   # Shared I2C bus — exposed for i2c_read/write/scan helpers

if store_manager and store_manager.manager:
    oled_ref = store_manager.manager.display
    _i2c_bus = getattr(store_manager.manager, 'i2c', None)
else:
    try:
        tmp_i2c  = machine.I2C(0, sda=machine.Pin(hardware.I2C_SDA),
                                scl=machine.Pin(hardware.I2C_SCL),
                                freq=hardware.I2C_FREQ)
        _i2c_bus = tmp_i2c
        oled_ref = sh1106.SH1106_I2C(128, 64, tmp_i2c)
    except Exception:
        oled_ref = None

display = DisplayWrapper(oled_ref)

try:
    import ina219
    if _i2c_bus is not None:
        power_sensor = ina219.INA219(_i2c_bus)
    else:
        power_sensor = None
except Exception as e:
    print("INA219 Init Error:", e)
    power_sensor = None

try:
    potentiometer = Sensor(4)
except Exception:
    potentiometer = None

def start():
    """Resets library state for a new execution session."""
    global _last_session_id
    _last_session_id = -1   # force session re-detection on next is_running() call

def stop_all():
    """Forces all hardware (motors, outputs, servos, steppers) to a safe, unpowered state."""
    import machine
    for p in [hardware.M1_IN1, hardware.M1_IN2, hardware.M2_IN1, hardware.M2_IN2, 
              hardware.M3_IN1, hardware.M3_IN2, hardware.OUT1, hardware.OUT2,
              hardware.S1, hardware.S2, getattr(hardware, 'S3', 33)]:
        try:
            machine.PWM(machine.Pin(p)).deinit()
        except: pass
        try:
            machine.Pin(p, machine.Pin.OUT, value=1)
        except: pass

def battery_pct():
    """Returns battery percentage (0-100) assuming 2S 18650."""
    if not power_sensor: return 0
    try:
        v = power_sensor.get_bus_voltage_V()
        return max(0, min(100, int((v - 6.0) / 2.4 * 100)))
    except Exception: return 0

def voltage():
    """Returns bus voltage in V."""
    if not power_sensor: return 0
    try: return power_sensor.get_bus_voltage_V()
    except Exception: return 0

def current():
    """Returns current draw in mA."""
    if not power_sensor: return 0
    try: return power_sensor.get_current_mA()
    except Exception: return 0

def power():
    """Returns power consumption in mW."""
    if not power_sensor: return 0
    try: return power_sensor.get_power_mW()
    except Exception: return 0

def is_running():
    """
    Returns True if the program should keep running.
    Polls serial/BLE for STOP commands and feeds the WDT.
    Raises KeyboardInterrupt("STOPPED_BY_USER") on stop.
    """
    global _last_session_id, _main_module

    # Cache __main__ to avoid repeated import overhead
    if _main_module is None:
        import __main__
        _main_module = __main__

    if hasattr(_main_module, 'wdt'):
        _main_module.wdt.feed()

    if store_manager and store_manager.manager:
        mgr = store_manager.manager
        current_session = getattr(mgr, 'exec_start_ticks', 0)

        # Non-intrusive session detection — runs once per new session
        if current_session != _last_session_id:
            _last_session_id = current_session
            try:
                import uselect, sys
                poll = uselect.poll()
                poll.register(sys.stdin, uselect.POLLIN)
                while poll.poll(0):
                    sys.stdin.read(1)
                mgr.prog_status = "RUNNING"
                mgr._in_exec    = True
            except Exception:
                pass

        try:
            mgr.poll_serial()
            mgr.poll_ble()
        except Exception:
            pass

        if mgr.prog_status != "RUNNING" or not mgr._in_exec:
            raise KeyboardInterrupt("STOPPED_BY_USER")

    return True


def delay(ms):
    """Interruptible sleep — checks is_running() every 10 ms."""
    start_t = time.ticks_ms()
    while time.ticks_diff(time.ticks_ms(), start_t) < ms:
        is_running()
        time.sleep_ms(10)
