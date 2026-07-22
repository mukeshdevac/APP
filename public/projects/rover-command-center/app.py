import network
import time
import gc

# --- 1. AGGRESSIVE WIFI INITIALIZATION (Run FIRST before ANY fragmentation) ---
def init_wifi():
    print("MGR: Powering up WiFi Radio...")
    gc.collect()
    
    # Force driver cleanup
    try:
        network.WLAN(network.STA_IF).active(False)
        w = network.WLAN(network.AP_IF)
        w.active(False)
        time.sleep_ms(100)
    except: pass
    
    gc.collect()
    
    try:
        ap = network.WLAN(network.AP_IF)
        ap.active(True)
        # Low frequency/channel for stability
        ap.config(essid="TEN-ROVER-01", authmode=network.AUTH_OPEN, channel=1)
        
        # Immediate sync
        time.sleep_ms(200)
        ip = ap.ifconfig()[0]
        print(f"MGR: WiFi AP Ready at {ip}")
        return ip
    except Exception as e:
        print("MGR: WiFi OOM/Driver Error:", e)
        # Final fallback
        time.sleep(1)
        gc.collect()
        try:
            network.WLAN(network.AP_IF).active(True)
            return network.WLAN(network.AP_IF).ifconfig()[0]
        except: return "0.0.0.0"

# Start WiFi before importing hardware libs
ip_addr = init_wifi()
gc.collect()

from machine import Pin, PWM
import socket

# --- 2. HARDWARE SETUP ---
# Motor Pins (6 control pins)
M_IN1, M_IN2 = 13, 14
M_IN3, M_IN4 = 27, 26
SYS_LED = Pin(2, Pin.OUT)

# Setup PWM
freq = 20000 
pwm_m1 = PWM(Pin(M_IN1), freq=freq, duty=0)
pwm_m2 = PWM(Pin(M_IN2), freq=freq, duty=0)
pwm_m3 = PWM(Pin(M_IN3), freq=freq, duty=0)
pwm_m4 = PWM(Pin(M_IN4), freq=freq, duty=0)

def set_motor(pwm1, pwm2, value):
    duty = abs(int(value * 1023 / 100))
    if value > 0:
        pwm1.duty(duty); pwm2.duty(0)
    elif value < 0:
        pwm1.duty(0); pwm2.duty(duty)
    else:
        pwm1.duty(0); pwm2.duty(0)

def control_rover(throttle, steer):
    l, r = throttle + steer, throttle - steer
    l = max(min(l, 100), -100)
    r = max(min(r, 100), -100)
    set_motor(pwm_m1, pwm_m2, l)
    set_motor(pwm_m3, pwm_m4, r)

# Display Update
try:
    from store_manager import manager
    oled = manager.display
    oled.fill(0)
    oled.text("PROGRAM RUNNING", 0, 10)
    oled.text("IP: " + ip_addr, 0, 30)
    oled.show()
except: pass

# --- 3. SERVER LOGIC ---
def start_server():
    print("MGR: Starting Web Server...")
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    s.bind(('', 80))
    s.listen(1)
    s.settimeout(0.1)
    
    led_state = False
    
    while True:
        try:
            from store_manager import manager
            if manager.prog_status != "RUNNING": break
        except: pass

        try:
            conn, addr = s.accept()
        except OSError:
            time.sleep_ms(20); continue

        try:
            gc.collect()
            conn.settimeout(2.0)
            req = conn.recv(1024)
            if not req: 
                conn.close()
                continue
                
            print(f"MGR: Request -> {req[:50]}...") # Log start of request
            
            if b'GET /c' in req:
                # Toggle LED for activity
                led_state = not led_state
                SYS_LED.value(led_state)
                
                try:
                    line = req.split(b'\n')[0]
                    p_idx = line.find(b'?')
                    if p_idx != -1:
                        params = line[p_idx+1:].split(b' ')[0]
                        t_val, s_val = 0, 0
                        for p in params.split(b'&'):
                            k, v = p.split(b'=')
                            if k == b't': t_val = int(v)
                            if k == b's': s_val = int(v)
                        control_rover(t_val, s_val)
                    conn.sendall(b'HTTP/1.1 200 OK\r\nConnection: close\r\n\r\n')
                except:
                    conn.sendall(b'HTTP/1.1 400 ERR\r\nConnection: close\r\n\r\n')
                conn.close()
                
            elif b'GET / ' in req:
                conn.sendall(b'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nConnection: close\r\n\r\n')
                total_sent = 0
                try:
                    with open('index.html', 'rb') as f:
                        buf = bytearray(256)
                        while True:
                            n = f.readinto(buf)
                            if not n: break
                            conn.sendall(buf[:n])
                            total_sent += n
                            time.sleep_ms(2) # Tiny pause for driver stability
                    print(f"MGR: Served index.html ({total_sent} bytes)")
                except Exception as e:
                    print(f"MGR: Serve Error: {e}")
                    conn.sendall(b'404 Missing HTML')
                conn.close()
            else:
                conn.sendall(b'HTTP/1.1 404 NOT FOUND\r\n\r\n')
                conn.close()
        except:
            try: conn.close()
            except: pass
    
    s.close()
    print("MGR: Server Stopped.")

if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        control_rover(0, 0)
