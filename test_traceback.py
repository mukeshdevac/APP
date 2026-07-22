import serial
import time

try:
    with serial.Serial('COM5', 115200, timeout=1) as port:
        port.write(b'\x03\r\n')
        time.sleep(0.5)
        port.write(b'\x01\r\n')
        time.sleep(0.1)
        port.read_all()
        # Test traceback output explicitly
        code_to_send = b'import sys\ntry:\n  import ten\nexcept BaseException as e:\n  print("---- TRACEBACK ----")\n  sys.print_exception(e)\n'
        port.write(code_to_send)
        time.sleep(0.5)
        port.write(b'\x04')
        time.sleep(1)
        print(port.read_all().decode('utf-8', 'ignore'))
        port.write(b'\x02')
except Exception as e:
    print('Err:', e)
