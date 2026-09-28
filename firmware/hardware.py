# Ten Robotics - Hardware Pin Mappings (v9.0 / PCB V2)
# =============================================================================
# DRV8833 #1  →  M1 (bidirectional)  +  M2 (bidirectional)
# DRV8833 #2  →  M3 (bidirectional)  +  OUT1 & OUT2 (single direction)
#               OR all 4 pins combined → 1x Stepper Motor
# =============================================================================

import time
from machine import Pin

# --- SERVOS (2x) & BUZZER ---
S1 = 18     # Servo 1 (D18)
S2 = 19     # Servo 2 (D19)
BUZZER_PIN = 33 # Buzzer (D33 - Permanently assigned)

# --- MOTORS: 4x Bidirectional (DRV8833 Motor Drivers) ---
M1_IN1 = 13    # DRV8833 #1 → AIN1 (D13)
M1_IN2 = 14    # DRV8833 #1 → AIN2 (D14)
M2_IN1 = 27    # DRV8833 #1 → BIN1 (D27)
M2_IN2 = 26    # DRV8833 #1 → BIN2 (D26)

# --- MOTOR 3 & 4 (DRV8833 #2) ---
M3_IN1 = 25    # DRV8833 #2 → AIN1 (D25)
M3_IN2 = 23    # DRV8833 #2 → AIN2 (D23)
M4_IN1 = 4     # DRV8833 #2 → BIN1 (D4)
M4_IN2 = 5     # DRV8833 #2 → BIN2 (D5)
OUT1 = M4_IN1  # Alias
OUT2 = M4_IN2  # Alias

# --- STEPPER MOTOR (DRV8833 #2, all 4 pins combined: M3 + M4) ---
STEP_IN1 = M3_IN1   # GP25 — Coil A+
STEP_IN2 = M3_IN2   # GP23 — Coil A−
STEP_IN3 = M4_IN1   # GP4  — Coil B+
STEP_IN4 = M4_IN2   # GP5  — Coil B−
STEPPER_STEPS_PER_REV = 200

# --- ANALOG SENSORS ---
SN1 = 34
SN2 = 35
SN3 = 32
SN4 = 36

# --- I2C BUS ---
I2C_SDA  = 21   # SDA
I2C_SCL  = 22   # SCL
I2C_FREQ = 400_000

# --- BUILT-IN ---
SYS_LED = Pin(2, Pin.OUT)
BTN1    = 16
BTN2    = 17

def init_pins_safe():
    """
    Power-on pin stabilization routine:
    Actively drives all motor driver, PWM, and output pins LOW (0V) with strong
    push-pull output stages upon startup. This eliminates floating gate voltages
    and prevents unintended motor movements/jerks during power-up.
    """
    driver_pins = [M1_IN1, M1_IN2, M2_IN1, M2_IN2, M3_IN1, M3_IN2, M4_IN1, M4_IN2, S1, S2]
    for p in driver_pins:
        try:
            Pin(p, Pin.OUT, value=0)
        except Exception:
            pass
    time.sleep_ms(5)
    for p in driver_pins:
        try:
            Pin(p, Pin.OUT, value=0).value(0)
        except Exception:
            pass

# Run automatic stabilization at boot
init_pins_safe()

