"""
TEN Robotics - Audio Buzzer Subsystem for ESP32 DevKit V1
Provides non-blocking and safe tone sequences on GPIO 33.
"""

import machine
import time
import hardware

class Buzzer:
    def __init__(self, pin_num=None):
        if pin_num is None:
            pin_num = getattr(hardware, 'BUZZER_PIN', 33)
        self.pin_num = pin_num
        self._pwm = None

    def _get_pwm(self):
        if not self._pwm:
            try:
                self._pwm = machine.PWM(machine.Pin(self.pin_num), freq=1000, duty=0)
            except Exception as e:
                print(f"Buzzer Init Error: {e}")
                self._pwm = None
        return self._pwm

    def tone(self, freq, duration_ms, duty=512):
        pwm = self._get_pwm()
        if not pwm:
            return
        try:
            if freq <= 0:
                pwm.duty(0)
            else:
                pwm.freq(int(freq))
                pwm.duty(int(duty))
            time.sleep_ms(duration_ms)
            pwm.duty(0)
        except Exception as e:
            print(f"Buzzer Tone Error: {e}")

    def play_startup(self):
        """Ascending startup sequence (C5, E5, G5, C6)."""
        notes = [(523, 80), (659, 80), (784, 80), (1046, 150)]
        for f, d in notes:
            self.tone(f, d)
            time.sleep_ms(20)

    def play_run(self):
        """High prompt dual-tone for program start (A5, A6)."""
        self.tone(880, 60)
        time.sleep_ms(30)
        self.tone(1760, 100)

    def play_stop(self):
        """Descending sequence for program stop (C6, G5, C5)."""
        notes = [(1046, 70), (784, 70), (523, 120)]
        for f, d in notes:
            self.tone(f, d)
            time.sleep_ms(20)

    def play_button(self):
        """Crisp 2000Hz click sound for button / touch presses."""
        self.tone(2000, 30, duty=512)

    def play_nav(self):
        """Audible 1200Hz navigation tone when pressing NEXT SCREEN button."""
        self.tone(1200, 50, duty=512)

    def play_jump(self, is_double=False):
        """Distinctive loud arcade rising pitch chirp for game jumps."""
        if not is_double:
            self.tone(784, 40, duty=512)
            self.tone(1175, 50, duty=512)
        else:
            self.tone(1046, 40, duty=512)
            self.tone(1568, 50, duty=512)

    def play_crash(self):
        """Distinctive arcade descending crunch tone for game over collision."""
        self.tone(440, 50, duty=600)
        time.sleep_ms(20)
        self.tone(262, 70, duty=650)
        time.sleep_ms(20)
        self.tone(147, 100, duty=700)

    def play_error(self):
        """Double low-pitch alert buzz for execution errors (fast & responsive)."""
        self.tone(350, 60, duty=512)
        time.sleep_ms(30)
        self.tone(220, 80, duty=512)

# Global Buzzer singleton instance
buzzer = Buzzer()

# Module-level aliases to support both 'import buzzer' and 'from buzzer import buzzer'
tone = buzzer.tone
play_startup = buzzer.play_startup
play_run = buzzer.play_run
play_stop = buzzer.play_stop
play_button = buzzer.play_button
play_nav = buzzer.play_nav
play_jump = buzzer.play_jump
play_crash = buzzer.play_crash
play_error = buzzer.play_error

