import serial
import time

PORT = 'COM5'
BAUD = 115200

def blanking_rescue():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=0.1)
        print("Breaking into robot (SPAMMING Ctrl+C)...")
        start = time.time()
        while time.time() - start < 10:
            ser.write(b"\x03")
            time.sleep(0.01)
        
        print("Creating BLANK main.py to shadow frozen/broken versions...")
        ser.write(b"\r\nimport os\r\n")
        ser.write(b"f = open('main.py', 'w'); f.close()\r\n")
        ser.write(b"print('BLANKED')\r\n")
        
        # Also try to stop the WDT feeder if it was running
        ser.write(b"import machine\r\n")
        ser.write(b"try: machine.Timer(2).deinit()\r\n")
        ser.write(b"except: pass\r\n")
        
        time.sleep(1)
        resp = ser.read_all().decode(errors='ignore')
        print(f"Robot Response: {resp}")
        
        if "BLANKED" in resp:
            print("SUCCESS: main.py blanked. Robot should boot to REPL on next reset.")
            return True
        else:
            print("FAILED: REPL not reached.")
            return False
            
    except Exception as e:
        print(f"ERROR: {e}")
        return False
    finally:
        ser.close()

if __name__ == "__main__":
    if blanking_rescue():
        print("Now rebooting robot...")
        ser = serial.Serial(PORT, BAUD, timeout=1)
        ser.write(b"\x04") # Ctrl+D (Soft Reboot)
        time.sleep(1)
        print("Robot should be at REPL. Ready for rescue_robot.py.")
        ser.close()
