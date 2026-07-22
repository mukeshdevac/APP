import select
import sys
import bluetooth
import machine
import sh1106
import time
import os
import gc
import micropython
from micropython import const
import sync_master

# BLE Constants
_IRQ_CENTRAL_CONNECT    = const(1)
_IRQ_CENTRAL_DISCONNECT = const(2)
_IRQ_GATTS_WRITE        = const(3)
micropython.alloc_emergency_exception_buf(100)
_FLAG_READ               = const(0x0002)
_FLAG_WRITE_NO_RESPONSE  = const(0x0004)
_FLAG_WRITE              = const(0x0008)
_FLAG_NOTIFY             = const(0x0010)
_UART_UUID    = bluetooth.UUID("6E400001-B5A3-F393-E0A9-E50E24DCCA9E")
_UART_TX      = (bluetooth.UUID("6E400003-B5A3-F393-E0A9-E50E24DCCA9E"), _FLAG_READ | _FLAG_NOTIFY,)
_UART_RX      = (bluetooth.UUID("6E400002-B5A3-F393-E0A9-E50E24DCCA9E"), _FLAG_WRITE | _FLAG_WRITE_NO_RESPONSE,)
_UART_SERVICE = (_UART_UUID, (_UART_TX, _UART_RX),)


class BLEUARTStream:
    """A stream wrapper that relays standard output to BLE UART."""
    def __init__(self, ble, handle_tx, connections):
        self.ble = ble
        self.handle_tx = handle_tx
        self.connections = connections

    def write(self, buf):
        # We don't want to endlessly loop trying to print errors inside the BLE write
        if not self.connections or self.handle_tx is None:
            return len(buf)
        for conn in self.connections:
            try:
                for i in range(0, len(buf), 20):
                    self.ble.gatts_notify(conn, self.handle_tx, buf[i:i+20])
            except:
                pass
        return len(buf)

    def read(self, size):
        return None


class StoreManager:
    def __init__(self):
        # -- 1. ALL STATE FIRST ---------------------------------------------
        self.header_text    = "TEN ROBOTICS"
        self.bt_status      = "DISC"
        self.connections    = set()
        self.prog_status    = "STOPPED"  # STOPPED, RUNNING
        self.last_error     = None
        self.view_mode      = 0
        self._update_pending  = False
        self._display_locked  = False
        self._in_exec         = False
        self.pending_start    = False
        self.lockout_until    = 0
        self._btn_samples     = [0, 0]
        self._last_btn_time   = [0, 0]
        self._btn_prev        = [1, 1] # Only 2 buttons now
        self.exec_start_ticks = 0
        self._refresh_tick    = 0  # for periodic display refresh
        # BLE handles
        self.ble       = None
        self.handle_tx = None
        self.handle_rx = None
        self._ble_stream = None
        # Hardware refs
        self.display   = None
        self.btn_view = self.btn_action = None
        self._btn_timer = None
        self.serial_active = False
        self._poller = select.poll()
        self._poller.register(sys.stdin, select.POLLIN)
        self._current_upload_file = "app.py"
        self._upload_handle = None
        
        # -- 1.1 SyncMaster Integration ------------------------------------
        self.sync = sync_master.SyncMaster(self._on_sync_command, self._on_sync_data)

        # -- 2. OLED (short I2C timeout to prevent WDT death) ---------------
        self.i2c = None
        for attempt in range(3):
            try:
                # timeout=50000 us = 50ms per operation — prevents WDT starvation
                self.i2c = machine.I2C(0, sda=machine.Pin(21), scl=machine.Pin(22),
                                       freq=400000, timeout=50000)
                # Scan first — avoid hanging on init_display if no device present
                devices = self.i2c.scan()
                print(f"MGR: I2C Scan: {[hex(d) for d in devices]}")
                if 0x3c in devices or 0x3d in devices:
                    addr = 0x3c if 0x3c in devices else 0x3d
                    self.display = sh1106.SH1106_I2C(128, 64, self.i2c, addr=addr)
                    print(f"MGR: OLED Ready at 0x{addr:02x} (Attempt {attempt+1})")
                    break
                else:
                    print(f"MGR: OLED not found on I2C bus (Attempt {attempt+1})")
                    self.display = None
                    break  # No point retrying if device not present
            except Exception as e:
                print(f"MGR: OLED Init Attempt {attempt+1} Failed: {e}")
                self.display = None
                time.sleep_ms(100)

        # -- 2.5 INA219 Power Sensor (only if I2C is alive) ------------------
        self.power_sensor = None
        if self.i2c is not None:
            try:
                import ina219
                # Re-scan only if devices was never set (OLED init failed via exception)
                i2c_devices = self.i2c.scan()
                print(f"MGR: INA219 Scan: {[hex(d) for d in i2c_devices]}")
                if 0x40 in i2c_devices:
                    self.power_sensor = ina219.INA219(self.i2c)
                    print("MGR: INA219 Ready")
                else:
                    print("MGR: INA219 not found on I2C bus")
            except Exception as e:
                print("MGR: INA219 Init Failed:", e)

        # --- 3. BUZZER REMOVED ---

        # -- 4. PERSISTENCE -------------------------------------------------
        try:
            stats = os.stat("app.py")
            if stats[6] > 0:
                self.view_mode = 1
        except:
            pass

        # -- 5. BUTTONS: BTN1(GPIO16)=Start/Stop, BTN2(GPIO17)=View --
        try:
            self.btn_action = machine.Pin(16, machine.Pin.IN, machine.Pin.PULL_UP)  # BTN1 → GND
            self.btn_view   = machine.Pin(17, machine.Pin.IN, machine.Pin.PULL_UP)  # BTN2 → GND
        except Exception as e:
            print("Button Init Failed:", e)

        # -- 6. BLE ---------------------------------------------------------
        try:
            self.ble = bluetooth.BLE()
            self.ble.active(True)
            self.ble.irq(self._irq)
            ((self.handle_tx, self.handle_rx),) = self.ble.gatts_register_services((_UART_SERVICE,))
            self.ble.gatts_set_buffer(self.handle_rx, 1024, True) # Sync Master v3: 1KB + Append
            self._do_advertise()
        except Exception as e:
            print("BLE Init Failed:", e)


        # Sync button previous state to current hardware to prevent boot-glitch clicks
        try:
            self._btn_prev = [self.btn_view.value(), self.btn_action.value()]
        except:
            self._btn_prev = [0, 0]

        self.show_splash()
        self.update_display()

        # -- 9. ENABLE BUTTONS AFTER STARTUP ----------------------------
        try:
            self._btn_timer = machine.Timer(1)
            self._btn_timer.init(period=20, mode=machine.Timer.PERIODIC,
                                 callback=self._poll_buttons_cb)
            print("MGR: Button polling started")
        except:
            pass



    # -- BLE INTERNALS -------------------------------------------------------

    def _send_status(self):
        msg = f"STATUS:{self.prog_status}\n"
        self.write(msg)

    def _irq(self, event, data):
        if event == _IRQ_CENTRAL_CONNECT:
            conn_handle, _, _ = data
            self.connections.add(conn_handle)
            self.bt_status = "CONN"
            
            # Setup stream reflection
            if not self._ble_stream:
                self._ble_stream = BLEUARTStream(self.ble, self.handle_tx, self.connections)
            os.dupterm(self._ble_stream, 1)

            micropython.schedule(lambda _: self.update_display(), None)
            micropython.schedule(lambda _: self._send_status(), None)
        elif event == _IRQ_CENTRAL_DISCONNECT:
            conn_handle, _, _ = data
            self.connections.discard(conn_handle)
            self.bt_status = "DISC"
            
            # Remove stream reflection if no connections remain
            if not self.connections:
                os.dupterm(None, 1)
                self._ble_stream = None

            micropython.schedule(lambda _: self.update_display(), None)
            micropython.schedule(lambda _: self._do_advertise(), None)
        elif event == _IRQ_GATTS_WRITE:
            # Sync Master v4: ISR-FREE POLLING. 
            # We don't read here. We let the timer poll it to avoid collisions.
            pass

    def _do_advertise(self, interval_us=500000):
        if self.ble is None:
            return
        try:
            uid = machine.unique_id()
            suffix = "".join("{:02X}".format(b) for b in uid[:2])
            name = f"TENROBOTICS_{suffix}"
            adv_data = bytearray(b'\x02\x01\x06')
            adv_data.append(17)
            adv_data.append(0x07)
            adv_data.extend(bytes(_UART_UUID))
            resp_data = bytearray()
            resp_data.append(len(name) + 1)
            resp_data.append(0x09)
            resp_data.extend(name.encode())
            self.ble.gap_advertise(interval_us, adv_data=adv_data, resp_data=resp_data)
        except Exception as e:
            print("Advertise failed:", e)

    def write(self, message):
        """Sends data back to the App (BLE or Serial)."""
        if not message: return 0
        data = message if isinstance(message, (bytes, bytearray)) else str(message).encode()
        
        # 1. Broadast to all Bluetooth centrals
        if self.handle_tx is not None and self.connections:
            for conn in self.connections:
                try:
                    for i in range(0, len(data), 20):
                        self.ble.gatts_notify(conn, self.handle_tx, data[i:i+20])
                except: pass
        
        # 2. Mirror to Serial if active
        if self.serial_active:
            try: sys.stdout.write(data)
            except: pass
            
        return len(data)

    def _draw_load_bar(self, current, total):
        """Draws a premium progress bar on the OLED."""
        if not self.display: return
        try:
            self.display.fill(0)
            self.display.text("DOWNLOADING...", 10, 5)
            
            # Progress calculation
            percent = 0
            if total > 0:
                percent = min(100, int((current / total) * 100))
            
            # Draw bar container
            self.display.rect(10, 25, 108, 12, 1)
            # Fill progress
            fill_width = int((percent / 100) * 104)
            if fill_width > 0:
                self.display.fill_rect(12, 27, fill_width, 8, 1)
            
            # Text status
            self.display.text(f"{percent}%", 50, 45)
            if total > 0:
                self.display.text(f"{current}/{total}", 10, 55)
            
            self.display.show()
        except: pass

    # -- DISPLAY -------------------------------------------------------------

    def _schedule_update(self):
        if self._update_pending:
            return
        self._update_pending = True
        micropython.schedule(lambda _: self.update_display(), None)

    def show_splash(self):
        if not self.display:
            return
        try:
            self.display.fill(0)
            self.display.text("TE", 30, 15)
            self.display.rect(50, 15, 12, 12, 1)
            self.display.fill_rect(53, 18, 2, 2, 1)
            self.display.fill_rect(57, 18, 2, 2, 1)
            self.display.rect(54, 23, 4, 1, 1)
            self.display.line(52, 15, 50, 11, 1)
            self.display.line(60, 15, 62, 11, 1)
            self.display.text("N", 65, 15)
            self.display.text("ROBOTICS", 32, 40)
            self.display.show()
            time.sleep(0.5) # REDUCED splash for speed
            self.display.fill(0)
            self.display.show()

        except Exception as e:
            print("Splash failed:", e)

    def update_display(self):
        self._update_pending = False
        if not self.display or self._display_locked:
            return
        try:
            self.display.fill(0)
            self.display.text(self.header_text, 0, 0)
            # -- Battery icon top-right (graphical only, no text) ----------
            try:
                if getattr(self, 'power_sensor', None):
                    v   = self.power_sensor.get_bus_voltage_V()
                    pct = max(0, min(100, int((v - 6.0) / 2.4 * 100)))
                else:
                    pct = -1
                # Body: 106,1 → 20x6px | tip: 2x4px at 126,3
                self.display.rect(106, 1, 20, 6, 1)
                self.display.fill_rect(126, 3, 2, 2, 1)
                if pct >= 0:
                    fw = max(0, int(18 * pct / 100))
                    if fw > 0:
                        self.display.fill_rect(107, 2, fw, 4, 1)
            except:
                pass  # No sensor — icon stays empty (0% look)
            self.display.hline(0, 10, 128, 1)

            if self.view_mode == 0:
                # Connection status only
                if self.connections:
                    self.display.text("CONNECTED", 16, 22)
                    self.display.text("BLUETOOTH", 16, 36)
                elif self.serial_active:
                    self.display.text("CONNECTED", 16, 22)
                    self.display.text("SERIAL", 32, 36)
                else:
                    self.display.text("NOT", 44, 22)
                    self.display.text("CONNECTED", 16, 36)

            elif self.view_mode == 1:
                self.display.text("PROGRAM VIEW", 0, 15)
                if self.last_error:
                    self.display.text("ERROR:", 0, 28)
                    err = str(self.last_error)
                    self.display.text(err[:16], 0, 40)
                    self.display.text(err[16:32], 0, 52)
                else:
                    try:
                        if os.stat("app.py")[6] > 0:
                            self.display.text("FILE: app.py", 0, 30)
                        else:
                            self.display.text("FILE: EMPTY", 0, 30)
                    except:
                        self.display.text("FILE: NOT FOUND", 0, 30)
                    self.display.text(f"PROG: {self.prog_status}", 0, 45)

            elif self.view_mode == 2:
                self.display.text("POWER MONITOR", 0, 15)
                if getattr(self, 'power_sensor', None):
                    try:
                        v = self.power_sensor.get_bus_voltage_V()
                        i = self.power_sensor.get_current_mA()
                        p = self.power_sensor.get_power_mW()
                        self.display.text(f"V: {v:.2f} V", 0, 28)
                        self.display.text(f"I: {i:.0f} mA", 0, 40)
                        self.display.text(f"P: {p:.0f} mW", 0, 52)
                    except Exception as e:
                        self.display.text("SENSOR ERROR", 0, 30)
                else:
                    self.display.text("NO SENSOR", 0, 30)

            self.display.show()
        except Exception as e:
            print("Display err:", e)

    # -- BUTTON POLLING -----------------------------------------------------

    def _poll_buttons_cb(self, t):
        # Soft timer handles both buttons
        try:
            buttons = [self.btn_view, self.btn_action]
            now = time.ticks_ms()
            for i, btn in enumerate(buttons):
                if btn is None: continue
                cur_raw = btn.value()
                
                # Multi-Sample Debounce: active-LOW (PULL_UP, button → GND)
                # Need 3 consecutive LOW polls (60ms) to trigger.
                if cur_raw == 0:
                    self._btn_samples[i] += 1
                else:
                    self._btn_samples[i] = 0
                
                # Only trigger if samples reach threshold AND we are not locked out
                if self._btn_samples[i] >= 3 and time.ticks_diff(now, self.lockout_until) > 0:
                    if time.ticks_diff(now, self._last_btn_time[i]) > 400:
                        print(f"MGR: Button {i} Triggered (Debounced)")
                        self._last_btn_time[i] = now
                        self._btn_samples[i] = 0 # Reset samples after trigger
                        micropython.schedule(self._handle_button, i)

            # -- Periodic refresh for live windows (every 500ms = 25 ticks × 20ms) --
            self._refresh_tick += 1
            if self._refresh_tick >= 25:
                self._refresh_tick = 0
                if self.view_mode == 2 and not self._display_locked:
                    micropython.schedule(lambda _: self.update_display(), None)
        except:
            pass

    def _handle_button(self, index):
        if index == 0:  # View cycle
            self.view_mode = (self.view_mode + 1) % 3
            self.update_display()
        elif index == 1:  # Start/Stop Toggle
            self.lockout_until = time.ticks_ms() + 1000 # 1s Lockout
            if self.prog_status == "RUNNING" or self._in_exec:
                self.pending_start = False
                self._trigger_interrupt(force=True)
                self.stop_prog()
            else:
                self.start_prog()

    # -- PROGRAM CONTROL -----------------------------------------------------

    def _trigger_interrupt(self, force=False):
        # Record the exact time this interrupt was requested
        req_time = time.ticks_ms()
        
        def trigger(t_req):
            # Only fire if the VM is actually executing user code AND it's the right session
            if self._in_exec and time.ticks_diff(t_req, self.exec_start_ticks) >= 0:
                raise KeyboardInterrupt("FORCE_STOP")
                
        if self.prog_status == "RUNNING" or force:
            micropython.schedule(trigger, req_time)

    def _on_sync_command(self, cmd, param):
        """Callback for SyncMaster protocol commands."""
        if cmd == "SEND_RAW":
            self.write(param)
        elif cmd == "CLEAR":
            self.last_error = None
            self._trigger_interrupt()
            with open("app.py", "w") as f: pass
        elif cmd == "STOP":
            self.pending_start = False
            self.stop_prog()
        elif cmd == "START":
            if self.prog_status == "RUNNING" or self._in_exec:
                self.pending_start = True
                self.stop_prog()
            else:
                self.start_prog()
        elif cmd == "SYNC":
            self.sync.send_ack("OK")
        elif cmd == "SERIAL_ON":
            self.serial_active = True
            self._schedule_update()
        elif cmd == "BEGIN_UPLOAD":
            self.last_error = None
            # param is now (total_lines, target_file)
            tot, filename = param
            self._current_upload_file = filename
            
            # Prep for new code: stop and clear
            self._trigger_interrupt()
            self.stop_prog()
            
            # Persist the handle for speed
            if self._upload_handle:
                try: self._upload_handle.close()
                except: pass
            
            try:
                # Ensure parent directory exists for nested files
                if "/" in filename:
                    parts = filename.split("/")
                    curr_path = ""
                    for i in range(len(parts) - 1):
                        curr_path += ("/" if curr_path else "") + parts[i]
                        try: os.mkdir(curr_path)
                        except: pass
                
                self._upload_handle = open(filename, "wb")
            except Exception as e:
                print(f"MGR: Failed to open {filename}: {e}")
                self._upload_handle = None
            
            # Switch to progress view if param (total) is valid
            if tot and tot > 0:
                self._draw_load_bar(0, tot)
        elif cmd == "PROGRESS":
            curr, tot = param
            if tot > 0:
                self._draw_load_bar(curr, tot)

    def _on_sync_data(self, raw_bytes):
        """Callback for raw code lines from SyncMaster."""
        try:
            if self._upload_handle:
                self._upload_handle.write(raw_bytes)
                # No flush here - let OS buffer for speed, close() will flush.
        except:
            pass
        # gc.collect() - Avoid frequent GC during streaming for speed

    # Logic moved back to main loop polling for safety (not in timer IRQ)
    def poll_serial(self): 
        self.sync.poll_serial(self._poller)
        self.sync.poll_ble()

    def poll_ble(self):
        # Actively poll the GATT buffer (ISR-Free) in main loop
        if self.ble is None or self.handle_rx is None:
            return
        try:
            payload = self.ble.gatts_read(self.handle_rx)
            if payload:
                # CRITICAL: Clear the append buffer so we don't read duplicates
                self.ble.gatts_write(self.handle_rx, b'')
                self.sync.capture_ble(payload)
        except Exception:
            pass

    def handle_nus_data(self, data): pass

    def start_prog(self):
        self._upload_handle = None

        # 0.5. Purge any stale signals (STOP commands from previous run)
        if hasattr(self, 'sync') and hasattr(self, 'poller'):
            self.sync.purge(self.poller)

        # 1. Update session ID (CRITICAL: Invalidate all old session cleanups)
        self.exec_start_ticks = time.ticks_ms()
        
        # 2. Update state
        self.prog_status     = "RUNNING"
        self.last_error      = None
        self.view_mode       = 1
        self._display_locked = True
        
        print(f"MGR: SESSION START {self.exec_start_ticks}")
        self._send_status()

    def stop_prog(self, error=None):
        # 1. Capture running state BEFORE we change it
        was_running = (self.prog_status == "RUNNING")
        
        # 2. Update state and unlock display IMMEDIATELY
        self.prog_status    = "STOPPED"
        self._display_locked = False
        if error: self.last_error = str(error)
        
        # 3. Handle persistent file handles
        if self._upload_handle:
            try:
                self._upload_handle.close()
                print(f"MGR: Upload finished for {self._current_upload_file}")
            except: pass
            self._upload_handle = None
            gc.collect()

        # 4. Trigger interrupt only if we were actually running
        if was_running:
            self._trigger_interrupt(force=True)
            duration = (time.ticks_ms() - self.exec_start_ticks) / 1000
            print(f"MGR: SESSION STOP {self.exec_start_ticks} (Ran: {duration:.1f}s)")
        else:
            print(f"MGR: SESSION STOP {self.exec_start_ticks}")
            
        self._schedule_update()
        self._send_status()


# -- MODULE ENTRY POINT -------------------------------------------------------
manager = None

def start():
    global manager
    manager = StoreManager()
