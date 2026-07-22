import serial
import time
import sys

port = serial.Serial('COM5', 115200, timeout=0.1)
print('--- OPENED COM5 ---')

def write(data):
    port.write(data.encode('utf-8'))
    port.flush()

print('--- INIT ---')
write('STOP\r\n')
time.sleep(1)
write('CLEAR\r\n')
time.sleep(0.5)

CODE = """import machine, time, gc
led = machine.Pin(4, machine.Pin.OUT)
print("=== STARTING AI DIAGNOSTICS ===")
for i in range(5):
    print("AI Cycle", i)
    led.value(not led.value())
    time.sleep(0.5)
print("=== DEMO FINISHED ===")
"""

print('--- UPLOADING CODE ---')
for line in CODE.split('\n'):
    write(line + '\r\n')
    time.sleep(0.05)

print('--- STARTING EXECUTION ---')
write('START\r\n')

print('--- READING OUTPUT ---')
end = time.time() + 8
while time.time() < end:
    if port.in_waiting:
        raw = port.read(port.in_waiting)
        sys.stdout.buffer.write(raw)
        sys.stdout.flush()
    time.sleep(0.01)

print('\n--- HALTING ---')
write('STOP\r\n')
port.close()
