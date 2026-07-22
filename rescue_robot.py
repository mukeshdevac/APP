import serial
import time
import os

PORT = 'COM5'
BAUD = 115200

FILES_TO_RESCUE = ['store_manager.py', 'sync_master.py', 'main.py', 'ten.py', 'hardware.py']

def send_to_repl(ser, command, wait=0.1):
    ser.write(command.encode() + b"\r\n")
    time.sleep(wait)
    return ser.read_all().decode(errors='ignore')

def upload_via_repl(ser, filename):
    local_path = os.path.join('firmware', filename)
    with open(local_path, 'r') as f:
        content = f.read()
    
    print(f"Uploading {filename} via REPL...")
    # Escape quotes for the string
    escaped_content = content.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n').replace('\r', '\\r')
    
    # Send chunks to avoid buffer overflow in REPL
    ser.write(f"f = open('{filename}', 'w')\r\n".encode())
    time.sleep(0.2)
    
    lines = content.split('\n')
    for i, line in enumerate(lines):
        # We use a trick: f.write(repr(line)[1:-1] + '\n')
        # But simpler: f.write(binascii.a2b_base64(...))
        # For simplicity, we'll just send lines using f.write()
        line_escaped = line.replace('\\', '\\\\').replace("'", "\\'").replace('\r', '')
        cmd = f"f.write('{line_escaped}\\n')\r\n"
        ser.write(cmd.encode())
        if i % 10 == 0:
            time.sleep(0.1)
            ser.read_all() # Keep buffer clean
            print(f"  ... line {i}/{len(lines)}")
            
    ser.write(b"f.close()\r\n")
    time.sleep(0.2)
    print(f"Finished {filename}")

def rescue():
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        print("Stopping robot loop (sending Ctrl+C)...")
        for _ in range(5):
            ser.write(b"\x03") # Ctrl+C
            time.sleep(0.1)
        
        ser.read_all()
        print("Entering Raw REPL (sending Ctrl+A)...")
        ser.write(b"\x01") # Ctrl+A (Raw REPL)
        time.sleep(0.5)
        resp = ser.read_all().decode(errors='ignore')
        if "raw REPL; CTRL-B to exit" not in resp:
            print("Warning: Could not confirm Raw REPL, but continuing...")

        for filename in FILES_TO_RESCUE:
            upload_via_repl(ser, filename)
            
        print("Exiting Raw REPL (sending Ctrl+B)...")
        ser.write(b"\x02") # Ctrl+B (Normal REPL / Reboot)
        time.sleep(1)
        
        print("\n--- RESCUE COMPLETE ---")
        ser.close()
    except Exception as e:
        print(f"RESCUE ERROR: {e}")

if __name__ == "__main__":
    rescue()
