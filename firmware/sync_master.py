import sys
import micropython
from micropython import const

class SyncMaster:
    """
    SyncMaster v4: A robust, library-grade communication layer for ESP32.
    Implements a closed-loop handshake protocol (ACK-based) to ensure 
    zero-loss code uploads over Bluetooth and Serial.
    """
    def __init__(self, on_command_cb, on_data_cb):
        self.on_command = on_command_cb
        self.on_data = on_data_cb
        self.serial_buf = bytearray()
        self.ble_buf = bytearray()
        self._is_uploading = False
        
        # Pre-allocate response bytes to avoid memory allocation in IRQs
        self._ACK_OK = b"UPLOAD:OK\n"
        self._ACK_READY = b"UPLOAD:READY\n"
        self._ACK_ERR = b"UPLOAD:ERR\n"
        
    def reset_buffers(self):
        self.serial_buf = bytearray()
        self.ble_buf = bytearray()
        self._is_uploading = False

    def purge(self, poller):
        """Clears all internal buffers and drains sys.stdin entirely."""
        self.reset_buffers()
        try:
            # Drain hardware buffer
            while poller.poll(0):
                sys.stdin.read(1)
        except: pass

    def capture_ble(self, payload):
        """Append raw BLE bytes directly to the protocol buffer with safety guard."""
        # Check for buffer overflow (garbage data protection), increased for large uploads
        if len(self.ble_buf) > 4096:
            self.ble_buf = bytearray()
        self.ble_buf.extend(payload)

    def poll_serial(self, poller):
        """Drains sys.stdin safely without blocking."""
        if len(self.serial_buf) > 8192:
            self.serial_buf = bytearray()
            
        try:
            # Drain ALL available characters in a non-blocking way
            while poller.poll(0):
                c = sys.stdin.read(1)
                if not c: break
                self.serial_buf.append(ord(c))
            
            if len(self.serial_buf) > 0 and b'\n' in self.serial_buf:
                self._harvest(self.serial_buf, source="SERIAL")
        except Exception as e:
            pass

    def poll_ble(self):
        """Processes accumulated BLE bytes."""
        if self.ble_buf:
            self._harvest(self.ble_buf, source="BLE")

    def _harvest(self, buffer, source):
        """Splits buffer into lines and routes to the correct handler."""
        if b'\n' not in buffer:
            return

        import gc
        gc.collect() # Pre-emptive GC for large line processing
        
        parts = buffer.split(b'\n')
        # Keep the last (incomplete) part in the buffer
        buffer[:] = parts.pop()

        for line_bytes in parts:
            # 1. Identify if this is a command (commands are always stripped text)
            try:
                line_str = line_bytes.decode().strip()
            except:
                line_str = ""

            # Check for protocol specific markers
            if line_str in ("CLEAR", "STOP", "START", "RESTART", "SYNC", "SERIAL_ON") or line_str.startswith("BEGIN_UPLOAD"):
                # AUTO-ENABLE Serial mirroring if command comes from Serial
                if source == "SERIAL":
                    self.on_command("SERIAL_ON", None)
                
                if line_str == "CLEAR":
                    self.reset_buffers()
                    self.on_command("CLEAR", None)
                elif line_str == "STOP":
                    self._is_uploading = False
                    self.on_command("STOP", None)
                elif line_str == "START" or line_str == "RESTART":
                    self._is_uploading = False
                    self.on_command("START", None)
                elif line_str == "SYNC":
                    self.on_command("SYNC", None)
                elif line_str == "SERIAL_ON":
                    self.on_command("SERIAL_ON", None)
                elif line_str.startswith("BEGIN_UPLOAD"):
                    self._is_uploading = True
                    self._current_line = 0
                    self._total_lines = 0
                    self._target_file = "app.py"
                    
                    parts = line_str.split(":")
                    if len(parts) >= 2:
                        try: self._total_lines = int(parts[1])
                        except: pass
                    if len(parts) >= 3:
                        self._target_file = parts[2]
                        
                    self.on_command("BEGIN_UPLOAD", (self._total_lines, self._target_file))
                    self.send_ack("READY")
                continue # Handled as command

            # 2. Otherwise it is USER DATA (Code or Input)
            raw_full = line_bytes + b'\n'
            self.on_data(raw_full)
            if self._is_uploading:
                self._current_line += 1
                self.on_command("PROGRESS", (self._current_line, self._total_lines))
                self.send_ack("OK")

    def send_ack(self, type):
        """Sends a protocol ACK back to the App."""
        # Note: Actual transmission is handled via store_manager context
        # but the protocol logic lives here.
        if type == "OK":
            self.on_command("SEND_RAW", self._ACK_OK)
        elif type == "READY":
            self.on_command("SEND_RAW", self._ACK_READY)
        elif type == "ERR":
            self.on_command("SEND_RAW", self._ACK_ERR)
