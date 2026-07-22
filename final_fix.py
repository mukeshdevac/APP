import serial
import time
import os

PORT = 'COM5'
BAUD = 115200

def wait_for_prompt(ser, timeout=2):
    buff = b""
    start = time.time()
    while time.time() - start < timeout:
        if ser.in_waiting:
            char = ser.read(1)
            buff += char
            if buff.endswith(b">>> "):
                return True
    return False

def final_fix():
    files_to_sync = ['ten.py', 'ten_eyes.py', 'hardware.py', 'main.py', 'sync_master.py', 'store_manager.py']
    
    try:
        ser = serial.Serial(PORT, BAUD, timeout=0.1)
        print("Breaking into ESP32...")
        for _ in range(25): # Even more aggressive breaking
            ser.write(b"\x03")
            time.sleep(0.04)
        
        ser.write(b"\r\n")
        time.sleep(0.5)
        ser.read_all()
        
        print("Ensuring REPL prompt...")
        ser.write(b"\r\n")
        if not wait_for_prompt(ser):
            print("FAILED to reach REPL prompt.")
            return

        for filename in files_to_sync:
            local_path = os.path.join('firmware', filename)
            if not os.path.exists(local_path):
                print(f"SKIP: Local file {local_path} not found.")
                continue

            print(f"Uploading {filename}...")
            with open(local_path, 'r') as f:
                lines = f.readlines()

            ser.write(f"f = open('{filename}', 'w')\n".encode())
            wait_for_prompt(ser)
            
            for i, line in enumerate(lines):
                # Using representation for safer escaping of complex strings in ten.py/ten_eyes.py
                line_escaped = line.replace('\\', '\\\\').replace("'", "\\'").replace('\r', '').replace('\n', '')
                cmd = f"f.write('{line_escaped}\\n')\n"
                ser.write(cmd.encode())
                if not wait_for_prompt(ser):
                    print(f"TIMEOUT at line {i} of {filename}")
                    break
                if i % 50 == 0:
                    print(f"  ... {i}/{len(lines)} lines", end='\r')
            
            ser.write(b"f.close()\n")
            wait_for_prompt(ser)
            print(f"  --- {filename} uploaded successfully. ---")
            
        print("\nAll files uploaded.")
        ser.write(b"import os; print('FILES:', os.listdir())\n")
        wait_for_prompt(ser)
        resp = ser.read_all().decode(errors='ignore')
        print(resp)
        
        print("Rebooting ESP32...")
        ser.write(b"machine.reset()\n")
        ser.close()
    except Exception as e:
        print(f"FINAL FIX ERROR: {e}")
    except Exception as e:
        print(f"FINAL FIX ERROR: {e}")

if __name__ == "__main__":
    final_fix()
