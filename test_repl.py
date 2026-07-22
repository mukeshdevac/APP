import serial, time
try:
    with serial.Serial('COM5', 115200, timeout=1) as port:
        port.write(b'\r\n\r\n')
        time.sleep(0.5)
        print('Initial REPL output:')
        print(port.read_all().decode('utf-8'))
        
        port.write(b'print("HELLO WORLD")\r\n')
        time.sleep(1)
        print('\nCommand execution output:')
        print(port.read_all().decode('utf-8'))
        
        print('\nNow trying STOP and CLEAR:')
        port.write(b'STOP\r\n')
        time.sleep(1)
        port.write(b'CLEAR\r\n')
        time.sleep(0.5)
        print(port.read_all().decode('utf-8'))
        
        # Test basic upload logic with exact delay
        CODE = "import gc\r\nprint('Memory:', gc.mem_free())\r\n"
        print('\nUploading test code:')
        for line in CODE.split('\r\n'):
            port.write((line + '\r\n').encode('utf-8'))
            time.sleep(0.05)
        
        port.write(b'START\r\n')
        time.sleep(3)
        print(port.read_all().decode('utf-8'))
        
except Exception as e:
    print('Error:', e)
