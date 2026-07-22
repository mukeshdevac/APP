import serial
import time
import os
import base64

PORT = 'COM5'
BAUD = 115200

def ultimate_fix():
    filename = 'ten.py'
    local_path = os.path.join('firmware', filename)
    
    if not os.path.exists(local_path):
        print(f"ERROR: Local file {local_path} not found.")
        return

    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        print(f"Connecting to ESP32 on {PORT}...")
        
        print("Breaking into robot (SPAMMING Ctrl+C for 5 seconds)...")
        start = time.time()
        while time.time() - start < 5:
            ser.write(b"\x03")
            time.sleep(0.01)
        
        print("Ensuring Raw REPL (Ctrl+A)...")
        for _ in range(3):
            ser.write(b"\x01")
            time.sleep(0.2)
        
        resp = ser.read_all().decode(errors='ignore')
        if "raw REPL; CTRL-B to exit" not in resp:
            print("Still not confirmed Raw REPL... attempting rescue...")
            ser.write(b"\x03\r\n\x01") # Ctrl+C then Ctrl+A
            time.sleep(1)
            resp = ser.read_all().decode(errors='ignore')

        print(f"Uploading {filename} (BASE64 MODE)...")
        with open(local_path, 'rb') as f:
            full_content = f.read()
        
        b64_data = base64.b64encode(full_content).decode()
        
        # Prepare file
        ser.write(b"import ubinascii\n")
        ser.write(f"f = open('{filename}', 'wb')\n".encode())
        
        # Send in 128-char chunks
        chunk_size = 128
        total = len(b64_data)
        for i in range(0, total, chunk_size):
            chunk = b64_data[i:i+chunk_size]
            cmd = f"f.write(ubinascii.a2b_base64('{chunk}'))\n"
            ser.write(cmd.encode())
            time.sleep(0.05)
            if i % 1024 == 0:
                print(f"  ... {i}/{total} bytes uploaded")
                ser.read_all() # Clear buffer
        
        ser.write(b"f.close()\n")
        time.sleep(0.5)
        print("Upload finished.")
        
        # Verify size
        ser.write(f"import os; print('VERIFY_SIZE:', os.stat('{filename}')[6])\n".encode())
        time.sleep(0.5)
        final_resp = ser.read_all().decode(errors='ignore')
        print(final_resp)
        
        if str(len(full_content)) in final_resp:
            print(f"SUCCESS: {filename} size matches! ({len(full_content)} bytes)")
        else:
            print(f"WARNING: Size mismatch or could not verify. Source size: {len(full_content)}")

        print("Rebooting ESP32...")
        ser.write(b"\x04") # Soft reboot
        ser.close()
    except Exception as e:
        print(f"ULTIMATE FIX ERROR: {e}")

if __name__ == "__main__":
    ultimate_fix()
