import serial
import time

try:
    with serial.Serial('COM5', 115200, timeout=1) as port:
        # 1. Enter RAW REPL (Ctrl+A)
        port.write(b'\x03\r\n')
        time.sleep(0.5)
        port.write(b'\x01\r\n')
        time.sleep(0.2)
        port.read_all()

        # 2. Read app.py
        cmd = "with open('app.py','r') as f: print(f.read())\r\n"
        port.write(cmd.encode())
        time.sleep(0.5)
        
        # 3. Read result
        result = port.read_all().decode('utf-8', 'ignore')
        print("--- ESP32 app.py CONTENT ---")
        print(result)
        print("--- END ---")

        # 4. Exit RAW REPL (Ctrl+B)
        port.write(b'\x02\r\n')
except Exception as e:
    print('Err:', e)
