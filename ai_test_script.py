import serial
import time
import sys

# The exact Python code the AI generated to test
CODE = """import machine, time, gc
led = machine.Pin(4, machine.Pin.OUT)
print("=== STARTING AI DIAGNOSTICS ===")
for i in range(5):
    print("AI Cycle", i, "| Mem:", gc.mem_free())
    led.value(not led.value())
    time.sleep(0.5)
print("=== DEMO FINISHED ===")
"""

try:
    with serial.Serial('COM5', 115200, timeout=0.1) as port:
        print('--- OPENED COM5 ---')
        
        # 1. Break
        port.write(b'\x03\r\n')
        time.sleep(0.5)
        
        # 2. Stop and Clear
        print('--- STOP & CLEAR ---')
        port.write(b'STOP\r\n')
        time.sleep(0.5)
        port.write(b'CLEAR\r\n')
        time.sleep(0.5)
        
        # 3. Upload Code chunk by chunk (50ms)
        print('--- UPLOADING AI CODE ---')
        for line in CODE.split('\n'):
            port.write((line + '\r\n').encode('utf-8'))
            time.sleep(0.05)
            
        # 4. Start
        print('--- STARTING EXECUTION ---')
        port.write(b'START\r\n')
        
        # 5. Read output for 8 seconds
        print('--- READING OUTPUT ---')
        end_time = time.time() + 8
        while time.time() < end_time:
            if port.in_waiting:
                sys.stdout.buffer.write(port.read(port.in_waiting))
                sys.stdout.flush()
            time.sleep(0.01)
            
except Exception as e:
    print('Failed:', e)
