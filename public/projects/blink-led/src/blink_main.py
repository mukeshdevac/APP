import machine, time, ten, gc

def run():
    # 1. Hardware Definitions
    # Built-in LED is on GPIO 2
    led = machine.Pin(2, machine.Pin.OUT)
    
    print("MGR: Starting Blink Project with OLED...")
    
    # 2. Check if display is available
    if not hasattr(ten.display, 'oled') or ten.display.oled is None:
        print("MGR WARNING: OLED hardware not detected by system manager.")
    
    # 3. Initialization & OLED Feedback
    try:
        ten.display.clear()
        ten.display.print("TEN ROBOTICS")
        ten.display.print("PROJECT: BLINK")
        ten.display.print("STATUS: INITIALIZING")
        ten.display.show()
        print("MGR: Initial splash sent to display.")
    except Exception as e:
        print(f"MGR: Splash Display Error: {e}")

    # Small delay to ensure display is ready
    ten.delay(500)

    try:
        # 4. Main Loop Logic
        print("MGR: Entering main loop...")
        while ten.is_running():
            # LED ON
            led.value(1)
            print("MGR: LED ON")
            
            try:
                ten.display.clear()
                ten.display.print("BLINK PROJECT")
                ten.display.print("STATUS: LED ON")
                ten.display.show()
            except Exception as e:
                print(f"MGR: OLED Update (ON) Err: {e}")
            
            ten.delay(1000)
            
            # LED OFF
            led.value(0)
            print("MGR: LED OFF")
            
            try:
                ten.display.clear()
                ten.display.print("BLINK PROJECT")
                ten.display.print("STATUS: LED OFF")
                ten.display.show()
            except Exception as e:
                print(f"MGR: OLED Update (OFF) Err: {e}")
            
            ten.delay(1000)
            
    except Exception as e:
        print(f"MGR CRITICAL ERROR: {e}")
    finally:
        # 5. Final Cleanup
        print("MGR: Stopping project and clearing display...")
        led.value(0)
        try:
            ten.display.clear()
            ten.display.print("PROJECT STOPPED")
            ten.display.show()
        except: pass
        gc.collect()

if __name__ == "__main__":
    run()
