import serial
import time

PORT = 'COM5'
BAUD = 115200

def check_env():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        ser.write(b"\x03") # Ctrl+C
        time.sleep(0.1)
        ser.read_all()
        
        print("Checking sys.path...")
        ser.write(b"import sys; print(sys.path)\r\n")
        time.sleep(0.5)
        print(ser.read_all().decode(errors='ignore'))
        
        print("Checking store_manager source...")
        ser.write(b"import store_manager; print(store_manager.__file__)\r\n")
        time.sleep(0.5)
        print(ser.read_all().decode(errors='ignore'))
        
        ser.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    check_env()
