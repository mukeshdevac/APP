import serial
import time
import os

# --- CONFIGURATION ---
PORT = 'COM5'  # Common port for ESP32 on this machine
BAUD = 115200
TIMEOUT = 2

FIRMWARE_DIR = 'firmware'
FILES_TO_SYNC = ['ten.py', 'ten_eyes.py', 'hardware.py', 'main.py', 'sync_master.py', 'store_manager.py']

def flash_file(ser, filename):
    local_path = os.path.join(FIRMWARE_DIR, filename)
    if not os.path.exists(local_path):
        print(f"ERROR: Local file {local_path} not found.")
        return False
    
    with open(local_path, 'r') as f:
        lines = f.readlines()
    
    print(f"Flashing {filename} ({len(lines)} lines)...")
    
    # 1. Start Upload Protocol
    ser.write(f"BEGIN_UPLOAD:{len(lines)}:{filename}\n".encode())
    
    # 2. Wait for UPLOAD:READY
    deadline = time.time() + 5
    while time.time() < deadline:
        line = ser.readline().decode().strip()
        if "UPLOAD:READY" in line:
            break
    else:
        print("FAILED: Timeout waiting for UPLOAD:READY")
        return False
    
    # 3. Send Lines
    for i, line in enumerate(lines):
        ser.write(line.encode())
        # Wait for UPLOAD:OK
        deadline = time.time() + 3
        while time.time() < deadline:
            resp = ser.readline().decode().strip()
            if "UPLOAD:OK" in resp:
                break
        else:
            print(f"FAILED: Timeout waiting for UPLOAD:OK at line {i+1}")
            return False
        
    print(f"SUCCESS: {filename} uploaded.")
    return True

def run_fix():
    print(f"Connecting to ESP32 on {PORT}...")
    try:
        ser = serial.Serial(PORT, BAUD, timeout=TIMEOUT)
        time.sleep(1) # Wait for reboot if any
        
        # Stop any running code
        print("Stopping robot...")
        ser.write(b"STOP\n")
        time.sleep(0.5)
        ser.read_all() # Clear buffer
        
        for filename in FILES_TO_SYNC:
            if not flash_file(ser, filename):
                print(f"ABORTED: Failure during {filename} upload.")
                break
        else:
            print("\n--- ALL LIBRARIES UPDATED SUCCESSFULLY ---")
            print("You can now run your Blockly code from the web app.")
            
        ser.close()
    except Exception as e:
        print(f"SERIAL ERROR: {e}")

if __name__ == "__main__":
    run_fix()
