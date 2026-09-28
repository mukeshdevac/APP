import time
from micropython import const

_REG_CONFIG = const(0x00)
_REG_SHUNTVOLTAGE = const(0x01)
_REG_BUSVOLTAGE = const(0x02)
_REG_POWER = const(0x03)
_REG_CURRENT = const(0x04)
_REG_CALIBRATION = const(0x05)

class INA219:
    def __init__(self, i2c, addr=0x40):
        self.i2c = i2c
        self.addr = addr
        self._cal_value = 4096
        self._last_bus_v = 7.4
        self._last_current_ma = 0.0
        self.init_ina219()

    def init_ina219(self):
        try:
            self.set_calibration_32V_2A()
        except Exception as e:
            print("MGR: INA219 config warning:", e)

    def _write_register(self, reg, value):
        try:
            buf = bytearray(3)
            buf[0] = reg
            buf[1] = (value >> 8) & 0xFF
            buf[2] = value & 0xFF
            self.i2c.writeto(self.addr, buf)
        except Exception:
            pass

    def _read_register_signed(self, reg):
        try:
            self.i2c.writeto(self.addr, bytearray([reg]))
            buf = self.i2c.readfrom(self.addr, 2)
            val = (buf[0] << 8) | buf[1]
            if val & 0x8000:
                val -= 0x10000
            return val
        except Exception:
            return 0

    def _read_register_unsigned(self, reg):
        try:
            self.i2c.writeto(self.addr, bytearray([reg]))
            buf = self.i2c.readfrom(self.addr, 2)
            return (buf[0] << 8) | buf[1]
        except Exception:
            return 0

    def set_calibration_32V_2A(self):
        self._cal_value = 4096
        self._write_register(_REG_CALIBRATION, self._cal_value)
        # Config: 32V Range, +/-320mV Gain, 16-sample hardware averaging (0x3DEF), Continuous Mode
        self._write_register(_REG_CONFIG, 0x3DEF)

    def get_bus_voltage_V(self):
        try:
            val = self._read_register_unsigned(_REG_BUSVOLTAGE)
            # Bits 15-3: Bus voltage data (4mV LSB)
            volts = (val >> 3) * 0.004
            # Sanity check for 2S battery pack (0V - 32V)
            if 0.0 <= volts <= 32.0:
                self._last_bus_v = volts
                return volts
            return self._last_bus_v
        except Exception:
            return self._last_bus_v

    def get_shunt_voltage_mV(self):
        try:
            val = self._read_register_signed(_REG_SHUNTVOLTAGE)
            return val * 0.01
        except Exception:
            return 0.0

    def get_current_mA(self):
        try:
            # Dual-Method Current Calculation:
            # Method 1: Hardware-calibrated Current Register (0x04)
            raw_curr = self._read_register_signed(_REG_CURRENT)
            if raw_curr != 0:
                current_ma = raw_curr / 10.0
            else:
                # Method 2: Direct 0.1 ohm Shunt Voltage calculation (I = V_shunt / 0.1 = V_shunt * 10)
                shunt_mv = self.get_shunt_voltage_mV()
                current_ma = shunt_mv * 10.0

            # Noise floor / deadband filter for tiny quiescent fluctuations
            if abs(current_ma) < 2.0:
                current_ma = 0.0

            # Filter out invalid extreme spikes
            if -5000.0 <= current_ma <= 5000.0:
                self._last_current_ma = current_ma
                return current_ma
            return self._last_current_ma
        except Exception:
            return self._last_current_ma

    def get_power_mW(self):
        try:
            return abs(self.get_bus_voltage_V() * self.get_current_mA())
        except Exception:
            return 0.0
