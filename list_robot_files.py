import serial
import time

PORT = 'COM5'
BAUD = 115200

def list_all_files():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        ser.write(b"\x03") # Ctrl+C
        time.sleep(0.1)
        ser.read_all()
        
        print("Listing root / ...")
        ser.write(b"import os; print(os.listdir('/'))\r\n")
        time.sleep(0.5)
        print(ser.read_all().decode(errors='ignore'))
        
        print("Listing /lib ...")
        ser.write(b"try: print(os.listdir('/lib'))\rexcept: print('no /lib')\r\n")
        time.sleep(0.5)
        print(ser.read_all().decode(errors='ignore'))

        print("Checking store_manager details...")
        ser.write(b"import store_manager; print(dir(store_manager))\r\n")
        time.sleep(0.5)
        print(ser.read_all().decode(errors='ignore'))
        
        ser.close()
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    list_all_files()
