export class ConnectionManager {
    constructor() {
        this.type = 'serial'; // 'serial', 'wifi', 'bluetooth'
        this.port = null;
        this.socket = null;
        this.bleDevice = null;
        this.bleCharacteristicRX = null;
        this.bleCharacteristicTX = null;

        this.onLog = null;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();

        this.onData = null;
        this.onSensorUpdate = null;
        this.onTelemetryUpdate = null;
        this.onDisconnect = null;
        this.isConnecting = false;
        this.buffer = ''; // BLE line buffer

        // Bluetooth Hardening
        this.isWriting = false; // Mutex lock for GATT operations
        this.bleIncomingBuffer = '';
        this.pendingResponse = null; // For handshake: { pattern, resolve }
    }

    async connect(type, options = {}) {
        if (this.isConnecting) {
            this.log(`[CONN] Already connecting to ${this.type}. Ignoring request.`);
            return false;
        }
        this.type = type;
        if (type === 'serial') return this.connectSerial();
        if (type === 'wifi') return this.connectWiFi(options.host, options.password);
        if (type === 'bluetooth') return this.connectBluetooth();
    }

    // --- SERIAL ---
    async connectSerial() {
        if (!('serial' in navigator)) throw new Error('Web Serial not supported');
        this.isConnecting = true;
        try {
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: 115200 });
            this.startReadingSerial();
            return true;
        } catch (err) {
            this.log(`[Serial ERR] ${err.message}`);
            this.isConnecting = false;
            throw err;
        } finally {
            this.isConnecting = false;
        }
    }

    async startReadingSerial() {
        this.log('[Serial] Starting reader loop...');
        while (this.port && this.port.readable) {
            let reader;
            try {
                reader = this.port.readable.getReader();
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) {
                        this.log('[Serial] Stream done.');
                        break;
                    }
                    if (value) {
                        const text = this.decoder.decode(value);
                        this._handleIncomingData(text);
                    }
                }
            } catch (e) {
                // Framing errors or unexpected disconnects
                this.log(`[Serial ERR] Read loop halt: ${e.message}`);
                // Don't kill the whole connection immediately if it's a transient error
                if (e.message.includes('The device has been lost')) break;
            } finally {
                if (reader) {
                    try { reader.releaseLock(); } catch { }
                }
            }

            // Wait a bit before trying to get a new reader if we broke out but port is still alive
            if (this.port && this.port.readable) {
                await new Promise(r => setTimeout(r, 500));
                this.log('[Serial] Attempting reader recovery...');
            } else {
                break;
            }
        }

        this.log('[Serial] Port stream closed or hardware lost.');
        this.port = null;
        if (this.onDisconnect) this.onDisconnect();
    }

    // --- WIFI (WebREPL) ---
    async connectWiFi(host = '192.168.4.1', password = 'abcd') {
        return new Promise((resolve, reject) => {
            this.socket = new WebSocket(`ws://${host}:8266`);
            this.socket.binaryType = 'arraybuffer';

            this.socket.onopen = () => {
                // WebREPL handshake: send password + \n
                this.socket.send(this.encoder.encode(password + '\n'));
                resolve(true);
            };

            this.socket.onmessage = (event) => {
                const text = this.decoder.decode(event.data);
                this._handleIncomingData(text);
            };

            this.socket.onclose = () => {
                if (this.onDisconnect) this.onDisconnect();
            };

            this.socket.onerror = (err) => reject(err);
        });
    }

    // --- BLUETOOTH (BLE UART) ---
    async connectBluetooth() {
        if (this.isConnecting) {
            this.log('[BT] Already attempting to connect...');
            return;
        }

        if (!('bluetooth' in navigator)) {
            const msg = 'Web Bluetooth not supported in this browser. Please use Chrome or Edge.';
            this.log(`[ERROR] ${msg}`);
            throw new Error(msg);
        }

        const UART_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
        const UART_RX_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
        const UART_TX_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

        this.isConnecting = true;

        // Cleanup stale state
        if (this.bleDevice) {
            try { if (this.bleDevice.gatt.connected) await this.bleDevice.gatt.disconnect(); } catch { /* ignore */ }
            this.bleDevice = null;
        }

        let device = null;
        try {
            this.log('[BT] Requesting device...');
            device = await navigator.bluetooth.requestDevice({
                filters: [{ services: [UART_SERVICE_UUID] }],
                optionalServices: [UART_SERVICE_UUID]
            });

            this.bleDevice = device;
            this.log(`[BT] Device selected: ${device.name || 'Unknown'}`);

            device.addEventListener('gattserverdisconnected', () => {
                this.log('[BT] Link lost.');
                this.handleBTDisconnect();
            });

            // Pre-connect cooldown (helps some OS stacks)
            await new Promise(r => setTimeout(r, 500));

            const connectAndDiscover = async (maxAttempts = 3) => {
                for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                    try {
                        this.log(`[BT] Connection attempt ${attempt}/${maxAttempts}...`);
                        const server = await device.gatt.connect();

                        this.log('[BT] Link established. Enumerating services...');
                        await new Promise(r => setTimeout(r, 1000));

                        // STABILITY PROBE: On Windows, calling the plural version often 
                        // "warms up" the GATT cache and prevents subsequent "not connected" errors.
                        try {
                            const services = await server.getPrimaryServices();
                            this.log(`[BT] Cache ready. Found ${services.length} services.`);
                        } catch (probeErr) {
                            this.log(`[BT] Warning during probe: ${probeErr.message}`);
                        }

                        this.log('[BT] Getting UART Service...');
                        const service = await server.getPrimaryService(UART_SERVICE_UUID);

                        this.log('[BT] Getting Characteristics...');
                        this.bleCharacteristicRX = await service.getCharacteristic(UART_RX_CHAR_UUID);
                        this.bleCharacteristicTX = await service.getCharacteristic(UART_TX_CHAR_UUID);

                        this.log('[BT] Enabling Notifications...');
                        await this.bleCharacteristicTX.startNotifications();
                        this.bleCharacteristicTX.addEventListener('characteristicvaluechanged', (event) => {
                            const value = event.target.value;
                            const text = this.decoder.decode(value);

                            // Internal line buffering to handle fragmented BLE/Serial chunks
                            this._handleIncomingData(text);
                        });

                        return true;
                    } catch (err) {
                        this.log(`[BT] Attempt ${attempt} failed: ${err.message}`);
                        if (attempt < maxAttempts) {
                            this.log('[BT] Retrying in 2s (Resetting stack)...');
                            try { device.gatt.disconnect(); } catch { /* ignore */ }
                            await new Promise(r => setTimeout(r, 2000));
                        } else {
                            throw err;
                        }
                    }
                }
            };

            await connectAndDiscover();
            this.log('\r\n[BT SUCCESS] Immersive connection established!\r\n');
            return true;
        } catch (error) {
            let finalMsg = error.message;
            if (finalMsg.includes('GATT Server is disconnected')) {
                finalMsg += '. PRO TIP: Try unpairing the device in Windows Settings > Bluetooth, then try again here.';
            }
            // Comprehensive cleanup on failure
            if (device && device.gatt && device.gatt.connected) {
                try { device.gatt.disconnect(); } catch { /* ignore */ }
            }
            this.bleDevice = null;
            this.isConnecting = false;
            throw new Error(finalMsg);
        } finally {
            this.isConnecting = false;
        }
    }

    handleBTDisconnect() {
        this.log('[BT] Disconnected.');
        this.bleDevice = null;
        this.bleCharacteristicRX = null;
        this.bleCharacteristicTX = null;
        if (this.onDisconnect) this.onDisconnect();
    }

    _handleIncomingData(text) {
        // Shared line buffering for cleaner App-side logic
        this.buffer += text;
        if (this.buffer.includes('\n')) {
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop(); // Keep partial line in buffer

            lines.forEach(line => {
                const cleanLine = line.replace('\r', '');
                // Handle Sensor Telemetry if enabled
                const sensorMatch = cleanLine.match(/^SENSOR:(\d+)/);
                if (sensorMatch && this.onSensorUpdate) {
                    this.onSensorUpdate(parseInt(sensorMatch[1]));
                }

                const powerMatch = cleanLine.match(/^POWER:V=([\d.]+),I=([\d.]+),P=([\d.]+),B=(\d+)/);
                if (powerMatch && this.onTelemetryUpdate) {
                    this.onTelemetryUpdate({
                        v: parseFloat(powerMatch[1]),
                        i: parseFloat(powerMatch[2]),
                        p: parseFloat(powerMatch[3]),
                        b: parseInt(powerMatch[4], 10)
                    });
                    return; // Don't pass telemetry to standard logs
                }

                // Pass full line to UI
                if (this.onData) this.onData(cleanLine + '\n');

                // Handshake logic
                if (this.pendingResponse && cleanLine.includes(this.pendingResponse.pattern)) {
                    const resolve = this.pendingResponse.resolve;
                    this.pendingResponse = null;
                    resolve(cleanLine);
                }
            });
        }
    }

    async waitForResponse(pattern, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pendingResponse = null;
                reject(new Error(`Timeout waiting for robot: ${pattern} (Waited 5s)`));
            }, timeout);

            this.pendingResponse = {
                pattern,
                resolve: (val) => {
                    clearTimeout(timer);
                    resolve(val);
                }
            };
        });
    }

    log(message) {
        console.log(message);
        if (this.onLog) {
            this.onLog(message);
        }
        if (this.onData) {
            // Log messages are always complete lines
            this.onData(`[SYSTEM] ${message}\n`);
        }
    }

    async disconnect() {
        if (this.type === 'serial' && this.port) {
            try { await this.port.close(); } catch (e) { console.warn('[Serial] Close error:', e); }
        }
        if (this.type === 'wifi' && this.socket) {
            try { this.socket.close(); } catch (e) { console.warn('[WiFi] Close error:', e); }
        }
        if (this.type === 'bluetooth' && this.bleDevice) {
            try { await this.bleDevice.gatt.disconnect(); } catch (e) { console.warn('[BT] Disconnect error:', e); }
        }

        this.port = null;
        this.socket = null;
        this.bleDevice = null;
        this.bleCharacteristicRX = null;
        this.bleCharacteristicTX = null;
        this.type = null;
    }

    async stopCode() {
        await this.writeWithDelay('STOP\n', 500);
        this.log('[CONTROL] Stop signal sent.');
    }

    async runCode() {
        await this.writeWithDelay('START\n', 100);
        this.log('[CONTROL] Run signal sent.');
    }

    async write(data) {
        if (this.isWriting) {
            // Wait for previous write to complete (Very simple queue)
            while (this.isWriting) {
                await new Promise(r => setTimeout(r, 10));
            }
        }

        this.isWriting = true;
        try {
            const encoded = this.encoder.encode(data);
            if (this.type === 'serial' && this.port?.writable) {
                const writer = this.port.writable.getWriter();
                await writer.write(encoded);
                writer.releaseLock();
            } else if (this.type === 'wifi' && this.socket?.readyState === WebSocket.OPEN) {
                this.socket.send(encoded);
            } else if (this.type === 'bluetooth' && this.bleCharacteristicRX) {
                // Stricter write for BLE: Chunking with "WithoutResponse" for speed/stability
                for (let i = 0; i < encoded.length; i += 20) {
                    const chunk = encoded.slice(i, i + 20);
                    if (this.bleCharacteristicRX.writeValueWithoutResponse) {
                        await this.bleCharacteristicRX.writeValueWithoutResponse(chunk);
                    } else {
                        await this.bleCharacteristicRX.writeValue(chunk);
                    }
                    // THICK THROTTLE: 40ms between fragments is required for 
                    // stability on Windows/Chrome BLE stack to prevent overflow.
                    await new Promise(r => setTimeout(r, 40));
                }
            }
        } catch (err) {
            this.log(`[WRITE ERR] ${err.message}`);
            throw err;
        } finally {
            this.isWriting = false;
        }
    }

    async writeWithDelay(data, delayMs = 75) {
        // Since write() now handles the Bluetooth chunking AND has a lock,
        // we just need to call it and then yield.
        await this.write(data);
        await new Promise(r => setTimeout(r, delayMs));
    }

    async uploadCode(code, onProgress = null) {
        if (onProgress) onProgress(1);
        const newline = '\n';

        // Support for string, literal file map, or dynamic fetch
        let files = {};

        if (typeof code === 'string') {
            files['app.py'] = code;
        } else if (code.sourceDirectory && code.filesToUpload) {
            this.log(`[UPLOAD] Fetching files from ${code.sourceDirectory}...`);
            try {
                for (const filename of code.filesToUpload) {
                    const response = await fetch(`${code.sourceDirectory}${filename}?t=${new Date().getTime()}`);
                    if (!response.ok) throw new Error(`Failed to load ${filename}`);
                    files[filename] = await response.text();
                }
            } catch (err) {
                this.log(`[UPLOAD ERR] Fetch failed: ${err.message}`);
                throw new Error(`Failed to fetch project files: ${err.message}`);
            }
        } else if (typeof code === 'object' && code.files) {
            files = code.files;
        } else {
            files = code; // Assume it's already a { filename: code } map
        }

        const fileEntries = Object.entries(files);
        let totalLinesAllFiles = fileEntries.reduce((sum, [_, content]) => sum + content.split('\n').length, 0);
        let linesProcessedSoFar = 0;

        try {
            this.log('[UPLOAD] Syncing with robot (sending STOP)...');
            await this.stopCode();
            await new Promise(r => setTimeout(r, 300));

            this.log('[UPLOAD] Sanitizing protocol state...');
            await this.write(`CLEAR${newline}`);
            await new Promise(r => setTimeout(r, 250));

            for (const [filename, content] of fileEntries) {
                const lines = content.split('\n').map(line => line.trimEnd());
                this.log(`[UPLOAD] Flashing ${filename} (${lines.length} lines)...`);

                // Use the new protocol: BEGIN_UPLOAD:line_count:filename
                await this.write(`BEGIN_UPLOAD:${lines.length}:${filename}${newline}`);
                await this.waitForResponse('UPLOAD:READY', 5000);

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i] + newline;
                    await this.write(line);
                    await this.waitForResponse('UPLOAD:OK', 4000);

                    linesProcessedSoFar++;
                    if (onProgress) {
                        const percent = Math.floor((linesProcessedSoFar / totalLinesAllFiles) * 98) + 1;
                        onProgress(percent);
                    }
                }
            }

            // 3. START (Always runs app.py by firmware design)
            await this.write(`START${newline}`);
            if (onProgress) onProgress(100);
            this.log('[UPLOAD] Multi-file Sync Complete.');
        } catch (err) {
            this.log(`[UPLOAD ERR] ${err.message}`);
            throw err;
        }
    }
}

export const connectionManager = new ConnectionManager();
