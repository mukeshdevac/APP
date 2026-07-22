import serial
import time

PORT = 'COM5'
BAUD = 115200

def debug_robot():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        print("Breaking into robot...")
        for _ in range(50):
            ser.write(b"\x03")
            time.sleep(0.01)
        
        ser.read_all()
        print("Stabilizing REPL...")
        ser.write(b"\r\nimport machine; try: machine.Timer(2).deinit(); print('WDT STOPPED')\rexcept: pass\r\n")
        time.sleep(0.5)
        
        print("Inspecting store_manager...")
        ser.write(b"import sys; print('PATH:', sys.path)\r\n")
        ser.write(b"import store_manager\r\n")
        ser.write(b"print('FILE:', getattr(store_manager, '__file__', 'FROZEN'))\r\n")
        ser.write(b"print('DIR:', dir(store_manager))\r\n")
        ser.write(b"try:\r\n with open('store_manager.py', 'r') as f: print('CONTENT:', f.read(200))\r\nexcept Exception as e: print('READ ERROR:', e)\r\n")
        
        time.sleep(1)
        resp = ser.read_all().decode(errors='ignore')
        print(f"--- ROBOT OUTPUT ---\n{resp}\n--- END ---")
        
        ser.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    debug_robot()
