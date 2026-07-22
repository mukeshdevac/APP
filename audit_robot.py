import serial
import time

PORT = 'COM5'
BAUD = 115200

def audit_esp32_files():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        print("Breaking into ESP32...")
        for _ in range(15): # Very aggressive
            ser.write(b"\x03")
            time.sleep(0.05)
        
        print("Entering Raw REPL...")
        ser.write(b"\x01")
        time.sleep(1)
        ser.read_all()
        
        # Audit Script
        audit_code = b"""
import os, sys
def scan(path='/'):
    print('SCAN:', path)
    try:
        for f in os.listdir(path):
            full = path + ('/' if path != '/' else '') + f
            try:
                stat = os.stat(full)
                if stat[0] & 0x4000: # Directory
                    scan(full)
                else:
                    print('FILE:', full, 'SIZE:', stat[6])
                    if f == 'ten.py':
                        with open(full, 'r') as f_obj:
                            head = f_obj.read(100)
                            print('HEAD:', head)
            except: pass
    except: pass
print('--- AUDIT START ---')
scan()
print('--- AUDIT END ---')
"""
        ser.write(audit_code)
        time.sleep(0.1)
        ser.write(b"\x04") # Execute
        
        time.sleep(2)
        resp = ser.read_all().decode(errors='ignore')
        print(resp)
        
        ser.write(b"\x02") # Normal REPL
        ser.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    audit_esp32_files()
