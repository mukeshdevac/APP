import serial
import time

PORT = 'COM5'
BAUD = 115200

def read_back(filename):
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        ser.write(b"\x03") # Ctrl+C
        time.sleep(0.1)
        ser.read_all()
        
        print(f"Reading {filename} from robot...")
        ser.write(f"with open('{filename}', 'r') as f: print(f.read(500))\r\n".encode())
        time.sleep(1)
        print("--- CONTENT START ---")
        print(ser.read_all().decode(errors='ignore'))
        print("--- CONTENT END ---")
        
        ser.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    read_back('store_manager.py')
    read_back('main.py')
