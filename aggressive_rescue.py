import serial
import time
import os

PORT = 'COM5'
BAUD = 115200

def aggressive_rescue():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=0.1)
        print("Breaking into robot (SPAMMING Ctrl+C)...")
        start = time.time()
        while time.time() - start < 10:
            ser.write(b"\x03")
            time.sleep(0.01)
        
        print("Attempting to neutralize main.py...")
        ser.write(b"\r\nimport os\r\n")
        ser.write(b"try: os.rename('main.py', 'main.py.bak')\r\n")
        ser.write(b"except: pass\r\n")
        ser.write(b"print('NEUTRALIZED')\r\n")
        
        time.sleep(1)
        resp = ser.read_all().decode(errors='ignore')
        print(f"Robot Response: {resp}")
        
        if "NEUTRALIZED" in resp:
            print("SUCCESS: main.py neutralized. Robot should stay at REPL now.")
            return True
        else:
            print("FAILED: main.py still active or REPL not reached.")
            return False
            
    except Exception as e:
        print(f"ERROR: {e}")
        return False
    finally:
        ser.close()

if __name__ == "__main__":
    if aggressive_rescue():
        print("Now you can run the rescue_robot.py script safely.")
