import serial
import time
import binascii

PORT = 'COM5'
BAUD = 115200

def override_rescue():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        print("Breaking into robot...")
        for _ in range(500):
            ser.write(b"\x03")
            time.sleep(0.005)
        
        print("Uploading boot.py...")
        content = """import machine, time
print("STABLE BOOT")
try:
    machine.Timer(2).deinit()
    print("WDT Feeder Stopped")
except:
    pass
while True:
    print("STABLE_REPL_LOOP")
    time.sleep(2)
"""
        hex_data = binascii.hexlify(content.encode()).decode()
        ser.write(b"f = open('boot.py', 'wb')\r\n")
        time.sleep(0.1)
        
        chunk_size = 64
        for i in range(0, len(hex_data), chunk_size):
            chunk = hex_data[i:i+chunk_size]
            ser.write(f"f.write(binascii.unhexlify('{chunk}'))\r".encode())
            time.sleep(0.02)
            
        ser.write(b"f.close()\r\n")
        time.sleep(0.2)
        print("Rebooting...")
        ser.write(b"\x04")
        ser.close()
        print("SUCCESS")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    override_rescue()
