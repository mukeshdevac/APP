import time
import machine
import gc

try:
    import ten
    USE_TEN = True
except ImportError:
    USE_TEN = False

# ==============================================================================
# HARDWARE CONFIGURATION: SERVO 1 PIN (GPIO 18)
# ==============================================================================
# SERVO 1 Header Pinout:
#   - GND    -> DHT11 GND (-)
#   - VCC/5V -> DHT11 VCC (+)  [5V power from Servo 1 header]
#   - SIGNAL -> DHT11 DATA (S) [GPIO 18]
# ==============================================================================
DHT_PIN = 18

# Pre-allocated static buffer to avoid GC allocations during sampling
_PULSES = [0] * 40


def read_dht(pin_num):
    pin = machine.Pin(pin_num, machine.Pin.OPEN_DRAIN, machine.Pin.PULL_UP)

    # 1. Idle line HIGH to stabilize
    pin.value(1)
    time.sleep_ms(200)

    # 2. Host sends START signal: hold LOW for 20ms
    pin.value(0)
    time.sleep_ms(20)

    # 3. Release line (OPEN_DRAIN releases in 50ns)
    # Notice: NO machine.disable_irq()! This keeps FreeRTOS, BLE, and the IWDT
    # happy and completely eliminates intermittent watchdog reboots.
    pin.value(1)
    time.sleep_us(15)

    # 4. Wait for sensor response: line goes LOW within 150us
    t0 = time.ticks_us()
    while pin.value() == 1:
        if time.ticks_diff(time.ticks_us(), t0) > 150:
            raise OSError("DHT ACK timeout (sensor did not respond)")

    # 5. Measure sensor ACK HIGH pulse (~80us)
    ack = machine.time_pulse_us(pin, 1, 150)
    if ack < 0:
        raise OSError("DHT ACK HIGH timeout (err={})".format(ack))

    # 6. Capture data bits using native C pulse timer
    bits_captured = 0
    for i in range(40):
        pulse = machine.time_pulse_us(pin, 1, 150)
        if pulse < 0:
            break
        _PULSES[i] = pulse
        bits_captured += 1

    if bits_captured < 32:
        raise OSError("Incomplete packet: only {} bits".format(bits_captured))

    # Convert pulses to bit string (0: ~22us, 1: ~68us)
    bit_str = "".join("1" if _PULSES[i] > 45 else "0" for i in range(bits_captured))

    # Frame Decoder:
    # A complete DHT packet ends with Checksum (8b), Dec2 (8b), Temp (8b), Dec1 (8b).
    # We decode from the tail backward to guarantee 100% mathematical alignment.
    chk  = int(bit_str[-8:], 2)
    d2   = int(bit_str[-16:-8], 2)
    temp = int(bit_str[-24:-16], 2)
    d1   = int(bit_str[-32:-24], 2)

    # If full 40 bits were captured, extract Humidity directly
    if bits_captured >= 40:
        hum = int(bit_str[-40:-32], 2)
    else:
        # Reconstruct Humidity from hardware checksum equation: chk = (H + d1 + T + d2) & 0xFF
        hum = (chk - temp - d1 - d2) & 0xFF

    # Mathematical sanity verification
    calc_sum = (hum + d1 + temp + d2) & 0xFF
    if calc_sum != chk or not (10 <= temp <= 55 and 15 <= hum <= 95):
        raise ValueError("Corrupt DHT frame: T={}, H={}, calc={}, chk={}".format(temp, hum, calc_sum, chk))

    return temp, hum


def read_with_retry(pin_num, retries=3):
    last_err = None
    for attempt in range(retries):
        try:
            return read_dht(pin_num)
        except Exception as e:
            last_err = e
            # Use ten.delay to keep BLE, buttons, and system watchdog fed during retry pause
            if USE_TEN:
                ten.delay(1200)
            else:
                time.sleep_ms(1200)
    raise last_err

# ==============================================================================
# OLED DISPLAY HANDLERS
# ==============================================================================
if USE_TEN:
    ten.display.clear()
    ten.display.print("SERVO 1: DHT11", y=0)
    ten.display.print("Initializing...", y=24)
    ten.display.show()
else:
    import ssd1306
    i2c = machine.I2C(0, sda=machine.Pin(21), scl=machine.Pin(22), freq=400000)
    oled = ssd1306.SSD1306_I2C(128, 64, i2c)

def show_data(temp, hum, count):
    heartbeat = "/" if (count % 2 == 0) else "\\"
    if USE_TEN:
        ten.display.clear()
        ten.display.print("SERVO 1: DHT11 " + heartbeat, y=0)
        ten.display.print("Temp: {} C".format(temp), y=20)
        ten.display.print("Humi: {} %".format(hum), y=40)
        ten.display.show()
    else:
        oled.fill(0)
        oled.text("SERVO 1: DHT11 " + heartbeat, 0, 0)
        oled.text("Temp: {} C".format(temp), 0, 20)
        oled.text("Humi: {} %".format(hum), 0, 40)
        oled.show()

def show_err(msg):
    if USE_TEN:
        ten.display.clear()
        ten.display.print("SERVO 1: DHT11", y=0)
        ten.display.print("Reading...", y=20)
        ten.display.print(str(msg)[:16], y=42)
        ten.display.show()
    else:
        oled.fill(0)
        oled.text("SERVO 1: DHT11", 0, 0)
        oled.text("Reading...", 0, 20)
        oled.text(str(msg)[:16], 0, 42)
        oled.show()

# ==============================================================================
# MAIN EXECUTION LOOP
# ==============================================================================
def run():
    print("=== DHT11 Precision Engine Active on SERVO 1 (GPIO 18) ===")
    time.sleep_ms(500)

    sample_count = 0
    while True:
        if USE_TEN and not ten.is_running():
            break

        sample_count += 1
        gc.collect()  # Automatic garbage collection to prevent memory fragmentation

        try:
            temp, hum = read_with_retry(DHT_PIN, retries=3)
            show_data(temp, hum, sample_count)
            print("[#{}] SERVO 1 -> Temp: {} C | Humidity: {} %".format(sample_count, temp, hum))
        except Exception as e:
            show_err(e)
            print("[#{}] Sensor Error: {}".format(sample_count, e))

        # DHT11 requires minimum 2.0s between measurements
        if USE_TEN:
            ten.delay(2000)
        else:
            time.sleep(2)

if __name__ == "__main__":
    run()
