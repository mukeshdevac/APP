import serial
import time
import os
import binascii

PORT = 'COM5'
BAUD = 115200

FILES_TO_RESCUE = ['store_manager.py', 'sync_master.py', 'main.py', 'ten.py', 'hardware.py']

def upload_hex(ser, filename):
    local_path = os.path.join('firmware', filename)
    with open(local_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"Uploading {filename} via HEX REPL...")
    # Convert to hex
    hex_data = binascii.hexlify(content.encode('utf-8')).decode()
    
    # Open file in binary write mode
    ser.write(f"import binascii; f = open('{filename}', 'wb')\r\n".encode())
    time.sleep(0.1)
    
    chunk_size = 64
    for i in range(0, len(hex_data), chunk_size):
        chunk = hex_data[i:i+chunk_size]
        cmd = f"f.write(binascii.unhexlify('{chunk}'))\r".encode()
        ser.write(cmd)
        # We need to wait for MicroPython to process the line
        time.sleep(0.02)
        if i % 512 == 0:
            print(f"  ... {i}/{len(hex_data)} hex chars")
            
    ser.write(b"\r\nf.close()\r\n")
    time.sleep(0.2)
    ser.read_all()
    print(f"Finished {filename}")

def super_rescue():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        print("Breaking into robot (SPAMMING Ctrl+C)...")
        start = time.time()
        while time.time() - start < 5:
            ser.write(b"\x03")
            time.sleep(0.01)
        
        ser.read_all()
        print("Entering Raw REPL (Ctrl+A)...")
        ser.write(b"\x01")
        time.sleep(0.5)
        
        print("Wiping existing modules to prevent shadowing...")
        ser.write(b"import os\r\n")
        ser.write(b"def wipe(p):\r\n try:\r\n  for f in os.listdir(p):\r\n   if f.endswith('.py') or f.endswith('.mpy'): os.remove(p+'/'+f)\r\n except: pass\r\n")
        ser.write(b"wipe('/')\r\n")
        ser.write(b"wipe('/lib')\r\n")
        time.sleep(0.5)
        print("Filesystem wiped.")

        for filename in FILES_TO_RESCUE:
            upload_hex(ser, filename)
            
        print("Rebooting robot (Ctrl+B / Ctrl+D)...")
        ser.write(b"\x02") # Exit raw REPL
        time.sleep(0.5)
        ser.write(b"\x04") # Soft reboot
        time.sleep(1)
        
        print("\n--- SUPER RESCUE COMPLETE ---")
        ser.close()
    except Exception as e:
        print(f"SUPER RESCUE ERROR: {e}")

if __name__ == "__main__":
    super_rescue()
