# Ten Robotics - Hardware Pin Mappings (v9.0)
# =============================================================================
# DRV8833 #1  →  M1 (bidirectional)  +  M2 (bidirectional)
# DRV8833 #2  →  M3 (bidirectional)  +  OUT1 & OUT2 (single direction)
#               OR all 4 pins combined → 1x Stepper Motor
# =============================================================================

from machine import Pin

# --- SERVOS (3x) ---
S1 = 18     # Servo 1
S2 = 19     # Servo 2
S3 = 33     # Servo 3

# --- MOTORS: Bidirectional (DRV8833 #1) ---
M1_IN1 = 13    # DRV8833 #1 → AIN1
M1_IN2 = 14    # DRV8833 #1 → AIN2
M2_IN1 = 26    # DRV8833 #1 → BIN1
M2_IN2 = 27    # DRV8833 #1 → BIN2

# --- MOTOR 3: Bidirectional (DRV8833 #2 A-channel) ---
# NOTE: M3 pins are shared with Stepper coil A
M3_IN1 = 25    # DRV8833 #2 → AIN1  (Stepper Coil A+)
M3_IN2 = 23    # DRV8833 #2 → AIN2  (Stepper Coil A-)

# --- SINGLE DIRECTION OUTPUTS (DRV8833 #2 B-channel) ---
# Control LEDs (dimming), Buzzers, Fans, Pumps — forward only
# NOTE: OUT1/OUT2 pins are shared with Stepper coil B
OUT1 = 4       # DRV8833 #2 → BIN1  (Stepper Coil B+)
OUT2 = 5       # DRV8833 #2 → BIN2  (Stepper Coil B-)

# --- STEPPER MOTOR (DRV8833 #2, all 4 pins combined) ---
# Uses M3_IN1/IN2 as Coil A  +  OUT1/OUT2 as Coil B
# When using stepper mode, DO NOT use M3 or OUT1/OUT2 independently
STEP_IN1 = M3_IN1   # GP25 — Coil A+
STEP_IN2 = M3_IN2   # GP23 — Coil A−
STEP_IN3 = OUT1     # GP4  — Coil B+
STEP_IN4 = OUT2     # GP5  — Coil B−
STEPPER_STEPS_PER_REV = 200   # 1.8°/step full-step motor (NEMA17 / 28BYJ-48)

# --- ANALOG SENSORS ---
SN1 = 34
SN2 = 35
SN3 = 32
SN4 = 36

# --- I2C BUS (Shared by both physical I2C Port 1 and Port 2) ---
# Both connectors are wired in parallel on the same GP21/GP22 bus.
# Multiple I2C devices can co-exist using different 7-bit addresses.
I2C_SDA  = 21   # SDA  — I2C Port 1 & Port 2
I2C_SCL  = 22   # SCL  — I2C Port 1 & Port 2
I2C_FREQ = 400_000  # 400 kHz Fast Mode

# --- BUILT-IN ---
SYS_LED = Pin(2, Pin.OUT)
BTN1    = 16
BTN2    = 17
