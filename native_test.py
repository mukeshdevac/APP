import serial
import time
import sys

CODE = """import machine, time, gc
led = machine.Pin(4, machine.Pin.OUT)
print("=== STARTING AI DIAGNOSTICS ===")
for i in range(5):
    print("AI Cycle", i)
    led.value(not led.value())
    time.sleep(0.5)
print("=== FINISHED ===")
"""

try:
    with serial.Serial('COM5', 115200, timeout=1) as port:
        print('--- OPENED COM5 ---')
        
        # 1. Break infinite loops (Ctrl+C)
        port.write(b'\x03')
        time.sleep(0.5)
        
        # 2. Enter clean Raw REPL (Ctrl+A)
        port.write(b'\x01')
        time.sleep(0.1)

        # 3. Soft Reboot while in Raw REPL (Ctrl+D) clears memory
        port.write(b'\x04')
        time.sleep(1)
        
        # Clear out boot logs
        port.read_all()

        print('--- UPLOADING AST ---')
        port.write(CODE.encode('utf-8'))
        time.sleep(0.5)
        
        print('--- EXECUTING NATIVE REPL ---')
        # Trigger Raw Execution (Ctrl+D)
        port.write(b'\x04')
        
        print('\n--- OUTPUT (10s) ---')
        end = time.time() + 10
        while time.time() < end:
            if port.in_waiting:
                sys.stdout.buffer.write(port.read(port.in_waiting))
                sys.stdout.flush()
            time.sleep(0.01)

        print('\n--- EXIT RAW REPL ---')
        port.write(b'\x02') # Ctrl+B back to friendly REPL

except Exception as e:
    print('Error:', e)
