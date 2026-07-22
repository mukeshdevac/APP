import serial
import time

PORT = 'COM5'
BAUD = 115200

def force_repl():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        print("Breaking into robot (Aggressive)...")
        for _ in range(1000):
            ser.write(b"\x03")
            time.sleep(0.001)
        
        ser.read_all()
        print("REPL reached. Checking state...")
        ser.write(b"import sys; print('PATH:', sys.path)\r\n")
        ser.write(b"import store_manager; print('SM FILE:', getattr(store_manager, '__file__', 'FROZEN'))\r\n")
        ser.write(b"import os; print('FILES:', os.listdir('/'))\r\n")
        
        time.sleep(2)
        print("--- OUTPUT ---")
        print(ser.read_all().decode(errors='ignore'))
        print("--- END ---")
        ser.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    force_repl()
