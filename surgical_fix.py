import serial
import time
import os

PORT = 'COM5'
BAUD = 115200

def surgical_fix():
    files_to_sync = ['ten.py', 'ten_eyes.py', 'hardware.py', 'main.py', 'sync_master.py', 'store_manager.py']
    
    try:
        ser = serial.Serial(PORT, BAUD, timeout=1)
        print(f"Connecting to ESP32 on {PORT}...")
        
        print("Stopping robot loop (sending Ctrl+C)...")
        for _ in range(10): # Increased spamming
            ser.write(b"\x03") # Ctrl+C
            time.sleep(0.05)
        
        ser.read_all()
        print("Entering Raw REPL (sending Ctrl+A)...")
        ser.write(b"\x01") # Ctrl+A (Raw REPL)
        time.sleep(0.5)
        resp = ser.read_all().decode(errors='ignore')
        if "raw REPL; CTRL-B to exit" not in resp:
            print("Warning: Could not confirm Raw REPL, but continuing...")

        for filename in files_to_sync:
            local_path = os.path.join('firmware', filename)
            if not os.path.exists(local_path):
                print(f"SKIP: Local file {local_path} not found.")
                continue

            print(f"Uploading {filename}...")
            with open(local_path, 'r') as f:
                content = f.read()
            
            # Send chunks to avoid buffer overflow in REPL
            ser.write(f"f = open('{filename}', 'w')\r\n".encode())
            time.sleep(0.2)
            
            lines = content.split('\n')
            for i, line in enumerate(lines):
                line_escaped = line.replace('\\', '\\\\').replace("'", "\\'").replace('\r', '')
                cmd = f"f.write('{line_escaped}\\n')\r\n"
                ser.write(cmd.encode())
                if i % 10 == 0:
                    time.sleep(0.02) # Faster but still safe
                    ser.read_all()
                    print(f"  ... {i}/{len(lines)} lines", end='\r')
            
            print(f"  ... {len(lines)}/{len(lines)} lines (Done)")
            ser.write(b"f.close()\r\n")
            time.sleep(0.2)
        
        print("\nExiting Raw REPL (Rebooting)...")
        ser.write(b"\x04") # Ctrl+D (Soft Reboot)
        time.sleep(1)
        
        print("\n--- ALL CORE LIBRARIES UPDATED SUCCESSFULLY ---")
        ser.close()
    except Exception as e:
        print(f"FIX ERROR: {e}")
    except Exception as e:
        print(f"FIX ERROR: {e}")

if __name__ == "__main__":
    surgical_fix()
