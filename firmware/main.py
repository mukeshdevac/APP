import sys
# Ensure filesystem path is first, but keep .frozen as fallback
if '' not in sys.path: sys.path.insert(0, '')
for mod in ['store_manager', 'ten', 'sync_master', 'hardware']:
    if mod in sys.modules: del sys.modules[mod]

import machine

# --- HARDWARE SAFETY: Liberate GPIO 15 & Force Motors LOW ---
# The ESP32 boot ROM attaches UART0 to GPIO 15. We must explicitly remap UART0
# to pins 1 and 3 to free GPIO 15, otherwise it remains stuck HIGH (7.6V) forever!
try:
    machine.UART(0, tx=1, rx=3)
except:
    pass

_safe_pwms = []
for p in [14, 15, 26, 27, 25, 23, 4, 5]:
    try:
        pwm = machine.PWM(machine.Pin(p), freq=1000)
        pwm.duty(0)
        _safe_pwms.append(pwm)
    except:
        pass

import gc
import time
import os
import store_manager
import select

# -- WDT and WDT Feeder Timer -------------------------------------------------
print("Initializing WDT (Timer 2)...")
try:
    wdt = machine.WDT(timeout=15000)   # 15 second timeout
    wdt_timer = machine.Timer(2)
    wdt_timer.init(period=4000, mode=machine.Timer.PERIODIC, callback=lambda t: wdt.feed())
    print("WDT Initialized.")
except Exception as e:
    print("WDT Init Warning:", e)

def main():
    print("Starting Main Sequence (FS PRIORITY)...")

    import gc
    print(f"Memory Free: {gc.mem_free()} bytes")
    if 'wdt' in globals(): wdt.feed()

    try:
        if 'wdt' in globals(): wdt.feed()
        print("Initializing Store Manager...")
        store_manager.start()
        if 'wdt' in globals(): wdt.feed()
        print("Store Manager Ready")
    except Exception as e:
        print("Store Manager init failed:")
        sys.print_exception(e)

    # -- Main Loop -------------------------------------------------------------
    print("Entering Main Loop...")
    loop_count = 0
    
    while True:
        try:
            if 'wdt' in globals(): wdt.feed()
            loop_count += 1
            mgr = store_manager.manager
            
            if mgr:
                mgr.poll_serial()
                mgr.poll_ble()
            
            if hasattr(mgr, 'pending_start') and mgr.pending_start:
                mgr.pending_start = False
                mgr.start_prog()
                
            if loop_count % 10 == 0:
                gc.collect()

            if mgr:
                status = mgr.prog_status
                if status == "RUNNING":
                    import sh1106
                    gc.collect()
                    
                    try:
                        fsize = os.stat("app.py")[6]
                    except:
                        fsize = 0
                    if fsize > 0:
                        time.sleep_ms(100)
                        current_session = mgr.exec_start_ticks
                        
                        if mgr.prog_status != "RUNNING":
                            continue
                        
                        if mgr.display:
                            try:
                                mgr.display.fill(0)
                                mgr.display.show()
                            except: pass
                            
                        def check_abort():
                            if mgr.prog_status != "RUNNING" or mgr.exec_start_ticks != current_session:
                                raise SystemExit("STOPPED_BY_USER")
                                
                        exec_globals = {
                            "__name__": "__main__",
                            "machine": machine, "time": time, "os": os, "gc": gc,
                            "i2c": mgr.i2c, "oled": mgr.display,
                            "display": mgr.display,
                            "check_abort": check_abort
                        }
                        
                        try:
                            print(f"--- EXEC START (Session {current_session}) ---")
                            mgr._in_exec = True
                            with open("app.py", "r") as f:
                                code_str = f.read()
                            gc.collect() 
                            import ten
                            ten.start()
                            exec(code_str, exec_globals)
                            mgr._in_exec = False
                            print(f"--- EXEC DONE (Session {current_session}) ---")
                            if mgr.prog_status == "RUNNING" and mgr.exec_start_ticks == current_session:
                                mgr.stop_prog()
                        except KeyboardInterrupt:
                            mgr._in_exec = False
                            print(f"--- EXEC INTERRUPT (Session {current_session}) ---")
                            if mgr.exec_start_ticks == current_session:
                                mgr.stop_prog()
                        except BaseException as e:
                            mgr._in_exec = False
                            print(f"--- EXEC ERROR (Session {current_session}) ---")
                            sys.print_exception(e)
                            if mgr.exec_start_ticks == current_session:
                                mgr.stop_prog(e)
                        finally:
                            try:
                                import ten
                                ten.stop_all()
                            except: pass
                            exec_globals.clear()
                            gc.collect()
                    
                    time.sleep(0.1)
                else:
                    time.sleep_ms(50)

        except KeyboardInterrupt:
            break
        except Exception as e:
            print("Main loop system error:")
            sys.print_exception(e)
            time.sleep(0.5)

if __name__ == "__main__":
    main()
