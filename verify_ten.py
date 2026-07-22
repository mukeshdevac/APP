import serial
import time

PORT = 'COM5'
BAUD = 115200

def verify_ten_py():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        for _ in range(5):
            ser.write(b"\x03")
            time.sleep(0.1)
        
        ser.write(b"\x01")
        time.sleep(0.5)
        ser.read_all()
        
        # Read ten.py
        ser.write(b"with open('ten.py', 'r') as f:\n    print('TEN_PY_START')\n    print(f.read())\n    print('TEN_PY_END')\n")
        time.sleep(1)
        resp = ser.read_all().decode(errors='ignore')
        
        if 'TEN_PY_START' in resp:
            content = resp.split('TEN_PY_START')[1].split('TEN_PY_END')[0]
            print("--- CONTENT OF ten.py ON ESP32 ---")
            print(content)
            if 'def start():' in content:
                print("\nSUCCESS: 'def start():' FOUND in ten.py on device.")
            else:
                print("\nFAILURE: 'def start():' NOT FOUND in ten.py on device!")
        else:
            print("FAILED to read ten.py content.")
            
        ser.write(b"\x02")
        ser.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    verify_ten_py()
