# Ten Robotics - High-Fidelity Eye Animations (v15.0)
# Fixes: duplicate methods, duplicate draw blocks, ssd1306→sh1106, pupil reset
import time
import math
import hardware

class HighFidEyes:
    def __init__(self, oled):
        self.oled = oled
        self.width = 128
        self.height = 64

        # Center positions for eyes
        self.EXL = 35
        self.EXR = 95
        self.vpos = 32

        # Radii
        self.EYE_R = 14
        self.PUPIL_R = 5

        # State
        self.pupil_x = 0
        self.pupil_y = 0
        self.eye_scale_y = 1.0
        self.style = "normal"  # normal, happy, angry, sad, sleep

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _circle(self, x, y, r, c):
        """Filled circle using horizontal scan-lines."""
        if r <= 0:
            return
        self.oled.hline(x - r, y, r * 2, c)
        for i in range(1, r):
            a = int(math.sqrt(r * r - i * i))
            self.oled.hline(x - a, y + i, a * 2, c)
            self.oled.hline(x - a, y - i, a * 2, c)

    def _draw_eye(self, x, y, c):
        # --- Sleep: just a thin horizontal line ---
        if self.style == "sleep":
            self.oled.fill_rect(x - self.EYE_R, y - 1, self.EYE_R * 2, 2, 1)
            return

        # --- White of eye with vertical blink scaling ---
        r_y = int(self.EYE_R * self.eye_scale_y)
        if r_y > 0:
            self.oled.hline(x - self.EYE_R, y, self.EYE_R * 2, 1)
            for i in range(1, r_y):
                scale = max(0.001, self.eye_scale_y)
                val = (i / scale) ** 2
                rad_sq = self.EYE_R * self.EYE_R
                a = 0 if val >= rad_sq else int(math.sqrt(rad_sq - val))
                self.oled.hline(x - a, y + i, a * 2, 1)
                self.oled.hline(x - a, y - i, a * 2, 1)

        # --- Pupil (only when eyes are open enough) ---
        if self.eye_scale_y > 0.3:
            self._circle(x + self.pupil_x, y + self.pupil_y, self.PUPIL_R, 0)

        # --- Happy: flatten bottom half ---
        if self.style == "happy":
            self.oled.fill_rect(x - self.EYE_R, y + 2, self.EYE_R * 2, self.EYE_R, 0)

        # --- Angry: slanting inner brow (drawn once) ---
        elif self.style == "angry":
            for i in range(self.EYE_R):
                if x < 64:   # Left eye → cut top-right
                    self.oled.line(x, y - self.EYE_R, x + self.EYE_R, y - self.EYE_R + i, 0)
                else:         # Right eye → cut top-left
                    self.oled.line(x, y - self.EYE_R, x - self.EYE_R, y - self.EYE_R + i, 0)

        # --- Sad: slanting outer brow (drawn once) ---
        elif self.style == "sad":
            for i in range(self.EYE_R):
                if x < 64:   # Left eye → cut top-left
                    self.oled.line(x, y - self.EYE_R, x - self.EYE_R, y - self.EYE_R + i, 0)
                else:         # Right eye → cut top-right
                    self.oled.line(x, y - self.EYE_R, x + self.EYE_R, y - self.EYE_R + i, 0)

    # ------------------------------------------------------------------
    # Render
    # ------------------------------------------------------------------

    def render(self):
        self.oled.fill(0)
        self._draw_eye(self.EXL, self.vpos, 1)
        self._draw_eye(self.EXR, self.vpos, 1)
        self.oled.show()

    # ------------------------------------------------------------------
    # Expressions
    # ------------------------------------------------------------------

    def center_eyes(self):
        """Return to neutral looking-forward state."""
        self.style = "normal"
        self.eye_scale_y = 1.0
        self.pupil_x = 0
        self.pupil_y = 0
        self.render()

    def blink(self):
        for s in [0.7, 0.4, 0.1, 0.4, 0.7, 1.0]:
            self.eye_scale_y = s
            self.render()
            time.sleep_ms(20)

    def happy_eye(self):
        self.style = "happy"
        for s in [0.2, 0.5, 0.8, 1.0]:
            self.eye_scale_y = s
            self.render()
            time.sleep_ms(30)

    def angry(self):
        self.style = "angry"
        for s in [0.2, 0.5, 0.8, 1.0]:
            self.eye_scale_y = s
            self.render()
            time.sleep_ms(30)

    def sad(self):
        self.style = "sad"
        for s in [0.2, 0.5, 0.8, 1.0]:
            self.eye_scale_y = s
            self.render()
            time.sleep_ms(30)

    def surprised(self):
        self.style = "normal"
        for s in [1.0, 1.1, 1.2, 1.3]:
            self.eye_scale_y = s
            self.render()
            time.sleep_ms(30)

    def squint(self):
        self.style = "normal"
        for s in [1.0, 0.8, 0.6, 0.4]:
            self.eye_scale_y = s
            self.render()
            time.sleep_ms(30)

    def thinking(self):
        """Squint while pupils drift right, then snap back."""
        for i in range(4):
            self.eye_scale_y = 1.0 - (i * 0.15)
            self.pupil_x = i * 2
            self.render()
            time.sleep_ms(40)
        for i in range(4):
            self.pupil_x = 6 - (i * 3)
            self.render()
            time.sleep_ms(80)
        self.center_eyes()

    def wakeup(self):
        self.style = "normal"
        for s in [0.1, 0.4, 0.7, 1.0]:
            self.eye_scale_y = s
            self.render()
            time.sleep_ms(40)

    def sleep(self):
        self.style = "sleep"
        self.render()

    def saccade(self, x, y):
        """Move pupils to (x, y) offset instantly."""
        self.pupil_x = x
        self.pupil_y = y
        self.render()

    def move_big_eye(self, direction):
        """Animate pupils left (-1) or right (+1)."""
        target_x = 6 * direction
        steps = 4
        for i in range(steps + 1):
            self.pupil_x = (target_x * i) // steps
            self.render()
            time.sleep_ms(30)

    def move_right_big_eye(self):
        self.move_big_eye(1)

    def move_left_big_eye(self):
        self.move_big_eye(-1)


# ------------------------------------------------------------------
# Singleton factory — tries three paths to reach the OLED
# ------------------------------------------------------------------

_eyes_instance = None

def get_eyes():
    global _eyes_instance
    if _eyes_instance:
        return _eyes_instance

    # 1. Re-use OLED from ten.display (preferred — shared bus)
    try:
        import ten
        if ten.display is not None and ten.display.oled is not None:
            _eyes_instance = HighFidEyes(ten.display.oled)
            return _eyes_instance
    except Exception:
        pass

    # 2. Re-use OLED from store_manager (second choice)
    try:
        from store_manager import manager
        if manager is not None and getattr(manager, 'display', None) is not None:
            _eyes_instance = HighFidEyes(manager.display)
            return _eyes_instance
    except Exception:
        pass

    # 3. Direct init as last resort (correct driver: sh1106)
    try:
        import sh1106
        from machine import Pin, I2C
        i2c = I2C(0, sda=Pin(hardware.I2C_SDA), scl=Pin(hardware.I2C_SCL), freq=400000)
        oled = sh1106.SH1106_I2C(128, 64, i2c)
        _eyes_instance = HighFidEyes(oled)
        return _eyes_instance
    except Exception as e:
        print(f"EYES ERR: Failed to init display: {e}")
        return None


def run_demo():
    eyes = get_eyes()
    if not eyes:
        return
    print("Eyes: Wakeup")
    eyes.wakeup()
    time.sleep(1)
    print("Eyes: Blink")
    eyes.blink()
    time.sleep(1)
    print("Eyes: Happy")
    eyes.happy_eye()
    time.sleep(1)
    print("Eyes: Thinking")
    eyes.thinking()
    time.sleep(1)
    print("Eyes: Angry")
    eyes.angry()
    time.sleep(1)
    print("Eyes: Sad")
    eyes.sad()
    time.sleep(1)
    print("Eyes: Center")
    eyes.center_eyes()


if __name__ == "__main__":
    run_demo()
