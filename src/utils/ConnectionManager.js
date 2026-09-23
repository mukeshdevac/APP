/**
 * ConnectionManager v3.0 - Unified Multi-Transport Connectivity Engine
 * Seamlessly manages Web Serial (USB), Instant Web Bluetooth (BLE with NUS/LOF), and WiFi WebSocket.
 * Features instant-pair BLE discovery, closed-loop code flashing with ACK retry, live telemetry, and resilient error recovery.
 * Website: https://www.tenrobotics.in/
 */

const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const NUS_RX_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const NUS_TX_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

const LOF_SERVICE_UUID = '4c4f4600-7469-7461-6e00-000000000001';
const LOF_CTRL_UUID    = '4c4f4601-7469-7461-6e00-000000000001';
const LOF_CONS_UUID    = '4c4f4604-7469-7461-6e00-000000000001';

export class ConnectionManager {
    constructor() {
        this.type = 'serial'; // 'serial', 'wifi', 'bluetooth'
        this.port = null;
        this.socket = null;
        this.bleDevice = null;
        this.bleServer = null;
        this.bleCharacteristicRX = null;
        this.bleCharacteristicTX = null;

        this.onLog = null;
        this.onData = null;
        this.onSensorUpdate = null;
        this.onTelemetryUpdate = null;
        this.onDisconnect = null;
        this.onStatusChange = null;

        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();

        this.isConnecting = false;
        this.isWriting = false;
        this.buffer = ''; // Line buffer for incoming stream assembly

        this.pendingResponse = null; // For closed-loop handshake: { pattern, resolve, reject, timer }
        this._pingInterval = null;
    }

    get isConnected() {
        if (this.type === 'serial') return !!(this.port && this.port.readable);
        if (this.type === 'bluetooth') return !!(this.bleDevice && this.bleDevice.gatt && this.bleDevice.gatt.connected);
        if (this.type === 'wifi') return !!(this.socket && this.socket.readyState === WebSocket.OPEN);
        return false;
    }

    async connect(type, options = {}) {
        if (this.isConnecting) {
            this.log(`[CONN] Already connecting to ${this.type}. Please wait.`);
            return false;
        }
        this.type = type;
        if (type === 'serial') return this.connectSerial();
        if (type === 'wifi') return this.connectWiFi(options.host || '192.168.4.1', options.password || '');
        if (type === 'bluetooth') return this.connectBluetooth();
        throw new Error(`Unsupported connection type: ${type}`);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // USB Serial (Web Serial API)
    // ─────────────────────────────────────────────────────────────────────────
    async connectSerial() {
        if (!('serial' in navigator)) {
            const msg = 'Web Serial is not supported in this browser. Please use Google Chrome, Edge, or Opera.';
            this.log(`[ERROR] ${msg}`);
            throw new Error(msg);
        }

        this.isConnecting = true;
        try {
            this.log('[Serial] Requesting USB COM Port...');
            this.port = await navigator.serial.requestPort();
            await this.port.open({ baudRate: 115200 });
            this.log('[Serial] Port opened at 115200 baud.');

            // Start async non-blocking read loop
            this.startReadingSerial();

            // Request initial sync
            await this.write('SERIAL_ON\n');
            await this.write('SYNC\n');
            return true;
        } catch (err) {
            this.log(`[Serial ERR] ${err.message}`);
            this.port = null;
            throw err;
        } finally {
            this.isConnecting = false;
        }
    }

    async startReadingSerial() {
        this.log('[Serial] Reader loop active.');
        while (this.port && this.port.readable) {
            let reader = null;
            try {
                reader = this.port.readable.getReader();
                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    if (value) {
                        const text = this.decoder.decode(value, { stream: true });
                        this._handleIncomingData(text);
                    }
                }
            } catch (e) {
                this.log(`[Serial ERR] Read loop warning: ${e.message}`);
                if (e.message.includes('device has been lost') || e.message.includes('Framing error')) {
                    break;
                }
            } finally {
                if (reader) {
                    try { reader.releaseLock(); } catch {}
                }
            }

            if (this.port && this.port.readable) {
                await new Promise(r => setTimeout(r, 200));
            } else {
                break;
            }
        }

        this.log('[Serial] Disconnected.');
        this.port = null;
        if (this.onDisconnect) this.onDisconnect();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // WiFi (WebSockets / WebREPL / Socket Server on Port 8266)
    // ─────────────────────────────────────────────────────────────────────────
    async connectWiFi(host = '192.168.4.1', password = '') {
        this.isConnecting = true;
        return new Promise((resolve, reject) => {
            try {
                const cleanHost = host.replace(/^ws:\/\//, '').replace(/\/$/, '');
                const targetUrl = cleanHost.includes(':') ? `ws://${cleanHost}` : `ws://${cleanHost}:8266`;
                this.log(`[WiFi] Connecting to ${targetUrl}...`);
                this.socket = new WebSocket(targetUrl);
                this.socket.binaryType = 'arraybuffer';

                const timeout = setTimeout(() => {
                    if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
                        this.socket.close();
                        this.isConnecting = false;
                        reject(new Error(`WiFi connection to ${host} timed out (8s). Make sure you are connected to the TEN_DEVKIT WiFi network.`));
                    }
                }, 8000);

                this.socket.onopen = async () => {
                    clearTimeout(timeout);
                    this.isConnecting = false;
                    this.log('[WiFi] Connected! Sending handshake...');
                    if (password) {
                        this.socket.send(this.encoder.encode(password + '\n'));
                    }
                    await new Promise(r => setTimeout(r, 100));
                    this.socket.send(this.encoder.encode('SYNC\n'));

                    // Setup periodic ping keepalive every 10s
                    if (this._pingInterval) clearInterval(this._pingInterval);
                    this._pingInterval = setInterval(() => {
                        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                            try { this.socket.send(this.encoder.encode('SYNC\n')); } catch {}
                        }
                    }, 10000);

                    resolve(true);
                };

                this.socket.onmessage = (event) => {
                    const text = typeof event.data === 'string' ? event.data : this.decoder.decode(event.data);
                    this._handleIncomingData(text);
                };

                this.socket.onclose = () => {
                    this.log('[WiFi] Socket closed.');
                    if (this._pingInterval) clearInterval(this._pingInterval);
                    this.socket = null;
                    this.isConnecting = false;
                    if (this.onDisconnect) this.onDisconnect();
                };

                this.socket.onerror = (err) => {
                    clearTimeout(timeout);
                    this.isConnecting = false;
                    reject(new Error(`WiFi socket error: ${err.message || 'Connection failed. Ensure you are connected to TEN_DEVKIT WiFi.'}`));
                };
            } catch (err) {
                this.isConnecting = false;
                reject(err);
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Instant Web Bluetooth (BLE UART with Nordic UART Service + LOF fallback)
    // ─────────────────────────────────────────────────────────────────────────
    async connectBluetooth() {
        if (!('bluetooth' in navigator)) {
            const msg = 'Web Bluetooth is not supported in this browser. Please use Chrome or Edge on Desktop or Android.';
            this.log(`[ERROR] ${msg}`);
            throw new Error(msg);
        }

        this.isConnecting = true;

        if (this.bleDevice && this.bleDevice.gatt && this.bleDevice.gatt.connected) {
            try { await this.bleDevice.gatt.disconnect(); } catch {}
        }
        this.bleDevice = null;

        let device = null;
        try {
            // 1. Fast reconnect check: If browser has remembered paired devices, try direct connection
            if (navigator.bluetooth.getDevices) {
                try {
                    const knownDevices = await navigator.bluetooth.getDevices();
                    const tenDevice = knownDevices.find(d => d.name && (d.name.startsWith('TEN_') || d.name.startsWith('TENROBOTICS') || d.name.startsWith('TEN')));
                    if (tenDevice && tenDevice.gatt) {
                        this.log(`[BT] Fast-reconnecting to remembered device: ${tenDevice.name}...`);
                        device = tenDevice;
                    }
                } catch (recErr) {
                    console.warn('[BT] Fast reconnect check skipped:', recErr);
                }
            }

            // 2. Strict Filter Discovery: Only display TEN Robotics DevKits (e.g. TEN_DEVKIT_XXXX, TEN_...)
            if (!device) {
                this.log('[BT] Scanning for TEN Robotics DevKits only...');
                device = await navigator.bluetooth.requestDevice({
                    filters: [
                        { namePrefix: 'TEN_' },
                        { namePrefix: 'TEN_DEVKIT' },
                        { namePrefix: 'TENROBOTICS' },
                        { namePrefix: 'TEN' }
                    ],
                    optionalServices: [NUS_SERVICE_UUID, LOF_SERVICE_UUID]
                });
            }

            this.bleDevice = device;
            this.log(`[BT] Selected: ${device.name || 'TEN DevKit'}`);

            device.addEventListener('gattserverdisconnected', () => {
                this.log('[BT] GATT Server link disconnected.');
                this.handleBTDisconnect();
            });

            // Connect to GATT Server
            const server = await device.gatt.connect();
            this.bleServer = server;
            this.log('[BT] GATT Server Connected. Discovering services...');

            // Discover Nordic UART Service (NUS) or LOF Service
            let service = null;
            let rxUuid = NUS_RX_CHAR_UUID;
            let txUuid = NUS_TX_CHAR_UUID;

            try {
                service = await server.getPrimaryService(NUS_SERVICE_UUID);
                this.log('[BT] Nordic UART Service (NUS) active.');
            } catch (nusErr) {
                this.log(`[BT] NUS fallback to LOF Service: ${nusErr.message}`);
                try {
                    service = await server.getPrimaryService(LOF_SERVICE_UUID);
                    rxUuid = LOF_CTRL_UUID;
                    txUuid = LOF_CONS_UUID;
                    this.log('[BT] LOF Service active.');
                } catch (lofErr) {
                    throw new Error('Neither NUS nor LOF service was found on the Bluetooth device.');
                }
            }

            this.bleCharacteristicRX = await service.getCharacteristic(rxUuid);
            this.bleCharacteristicTX = await service.getCharacteristic(txUuid);

            this.log('[BT] Subscribing to Notifications...');
            await this.bleCharacteristicTX.startNotifications();
            this.bleCharacteristicTX.addEventListener('characteristicvaluechanged', (event) => {
                const value = event.target.value;
                const text = this.decoder.decode(value);
                this._handleIncomingData(text);
            });

            // Handshake & Sync
            await this.write('SYNC\n');
            this.log('[BT SUCCESS] Connected and synchronized in instant mode!');
            return true;
        } catch (error) {
            this.log(`[BT ERR] ${error.message}`);
            if (device && device.gatt && device.gatt.connected) {
                try { device.gatt.disconnect(); } catch {}
            }
            this.bleDevice = null;
            this.bleServer = null;
            throw error;
        } finally {
            this.isConnecting = false;
        }
    }

    handleBTDisconnect() {
        this.bleDevice = null;
        this.bleServer = null;
        this.bleCharacteristicRX = null;
        this.bleCharacteristicTX = null;
        if (this.onDisconnect) this.onDisconnect();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Incoming Data & Telemetry Parsing
    // ─────────────────────────────────────────────────────────────────────────
    _handleIncomingData(text) {
        this.buffer += text;
        if (!this.buffer.includes('\n')) return;

        const lines = this.buffer.split('\n');
        this.buffer = lines.pop(); // Keep uncompleted fragment in buffer

        lines.forEach((line) => {
            const rawLine = line.replace('\r', '');
            const cleanLine = rawLine.trim();
            if (!cleanLine && rawLine === '') return;

            // 1. JSON & Key-Value Telemetry Parser (updates UI gauges silently)
            if (cleanLine.startsWith('POWER:')) {
                const payload = cleanLine.substring(6).trim();
                if (payload.startsWith('{')) {
                    try {
                        const d = JSON.parse(payload);
                        if (this.onTelemetryUpdate) {
                            this.onTelemetryUpdate({
                                v: d.v !== undefined ? Number(d.v) : 0,
                                pct: d.pct !== undefined ? Number(d.pct) : (d.b !== undefined ? Number(d.b) : 0),
                                ma: d.ma !== undefined ? Number(d.ma) : (d.i !== undefined ? Number(d.i) : 0),
                                p: d.p !== undefined ? Number(d.p) : 0,
                                b: d.pct !== undefined ? Number(d.pct) : (d.b !== undefined ? Number(d.b) : 0)
                            });
                        }
                    } catch (e) {}
                } else {
                    const kvMatch = cleanLine.match(/V=([-\d.]+).*?I=([-\d.]+).*?P=([-\d.]+).*?B=([-\d]+)/i);
                    if (kvMatch && this.onTelemetryUpdate) {
                        this.onTelemetryUpdate({
                            v: parseFloat(kvMatch[1]),
                            ma: parseFloat(kvMatch[2]),
                            p: parseFloat(kvMatch[3]),
                            pct: Math.max(0, Math.min(100, parseInt(kvMatch[4], 10))),
                            b: Math.max(0, Math.min(100, parseInt(kvMatch[4], 10)))
                        });
                    }
                }
                return; // Telemetry updates HUD silently, does not clutter Serial Monitor text
            }

            // 2. Sensor Live Stream: SENSOR:1234
            const sensorMatch = cleanLine.match(/^SENSOR:(\d+)/i);
            if (sensorMatch && this.onSensorUpdate) {
                this.onSensorUpdate(parseInt(sensorMatch[1], 10));
            }

            // 3. Status Notification: STATUS:RUNNING / STATUS:STOPPED / STATUS:READY
            if (cleanLine.startsWith('STATUS:')) {
                const st = cleanLine.substring(7).trim();
                if (this.onStatusChange) this.onStatusChange(st);
                return; // Consumed internally
            }

            // 4. Closed-loop Handshake Resolver
            if (this.pendingResponse && cleanLine.includes(this.pendingResponse.pattern)) {
                const resolver = this.pendingResponse.resolve;
                clearTimeout(this.pendingResponse.timer);
                this.pendingResponse = null;
                resolver(cleanLine);
                return; // Handshake ACK consumed internally
            }

            // 5. Internal Handshake & Upload Control Filter
            if (cleanLine.startsWith('UPLOAD:') || cleanLine.startsWith('BEGIN_UPLOAD:') || cleanLine.startsWith('SERIAL:') || cleanLine === 'SYNC') {
                return;
            }

            // 6. Clean User Code & DevKit Serial Output -> Serial Monitor
            if (this.onData) {
                this.onData(rawLine + '\n');
            }
        });
    }

    async waitForResponse(pattern, timeoutMs = 5000) {
        return new Promise((resolve, reject) => {
            if (this.pendingResponse) {
                clearTimeout(this.pendingResponse.timer);
                this.pendingResponse.reject(new Error('Cancelled by new pending response'));
            }

            const timer = setTimeout(() => {
                this.pendingResponse = null;
                reject(new Error(`Timeout waiting for robot acknowledgement: "${pattern}" (${timeoutMs / 1000}s)`));
            }, timeoutMs);

            this.pendingResponse = { pattern, resolve, reject, timer };
        });
    }

    log(message) {
        console.log(message);
        if (this.onLog) this.onLog(message);
    }

    async disconnect() {
        if (this._pingInterval) clearInterval(this._pingInterval);
        if (this.type === 'serial' && this.port) {
            try { await this.port.close(); } catch (e) { console.warn('[Serial] Close error:', e); }
        }
        if (this.type === 'wifi' && this.socket) {
            try { this.socket.close(); } catch (e) { console.warn('[WiFi] Close error:', e); }
        }
        if (this.type === 'bluetooth' && this.bleDevice) {
            try {
                if (this.bleDevice.gatt && this.bleDevice.gatt.connected) {
                    await this.bleDevice.gatt.disconnect();
                }
            } catch (e) {
                console.warn('[BT] Disconnect error:', e);
            }
        }

        this.port = null;
        this.socket = null;
        this.bleDevice = null;
        this.bleServer = null;
        this.bleCharacteristicRX = null;
        this.bleCharacteristicTX = null;
        this.buffer = '';
    }

    async stopCode() {
        await this.write('STOP\n');
        this.log('[CONTROL] Stop command sent.');
    }

    async runCode() {
        await this.write('START\n');
        this.log('[CONTROL] Run command sent.');
    }

    async syncState() {
        await this.write('SYNC\n');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Pre-registered Handshake and ACK Transmitter with Auto-Retry
    // ─────────────────────────────────────────────────────────────────────────
    async writeAndAwaitResponse(data, pattern, timeoutMs = 4000, maxRetries = 3) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            let timer = null;
            try {
                const ackPromise = new Promise((resolve, reject) => {
                    timer = setTimeout(() => {
                        this.pendingResponse = null;
                        reject(new Error(`Timeout waiting for robot acknowledgement "${pattern}" (attempt ${attempt}/${maxRetries})`));
                    }, timeoutMs);

                    this.pendingResponse = { pattern, resolve, reject, timer };
                });

                // Write command AFTER pendingResponse is safely registered
                await this.write(data);

                // Await response
                const result = await ackPromise;
                return result;
            } catch (err) {
                if (this.pendingResponse && this.pendingResponse.timer === timer) {
                    this.pendingResponse = null;
                }
                if (timer) clearTimeout(timer);

                if (attempt >= maxRetries) {
                    throw new Error(`Upload handshake failed: Robot did not acknowledge "${pattern}" after ${maxRetries} attempts.`);
                }
                this.log(`[UPLOAD] Retrying "${pattern}" (attempt ${attempt + 1}/${maxRetries})...`);
                await new Promise(r => setTimeout(r, 250));
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Mutex Write Stream with BLE Packet Throttling
    // ─────────────────────────────────────────────────────────────────────────
    async write(data) {
        while (this.isWriting) {
            await new Promise(r => setTimeout(r, 8));
        }

        this.isWriting = true;
        try {
            const encoded = this.encoder.encode(data);

            if (this.type === 'serial' && this.port && this.port.writable) {
                const writer = this.port.writable.getWriter();
                try {
                    await writer.write(encoded);
                } finally {
                    writer.releaseLock();
                }
            } else if (this.type === 'wifi' && this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(encoded);
            } else if (this.type === 'bluetooth' && this.bleCharacteristicRX) {
                // Fragment into 20-byte MTU-safe chunks for standard BLE UART
                for (let i = 0; i < encoded.length; i += 20) {
                    const chunk = encoded.slice(i, i + 20);
                    if (this.bleCharacteristicRX.writeValueWithoutResponse) {
                        await this.bleCharacteristicRX.writeValueWithoutResponse(chunk);
                    } else {
                        await this.bleCharacteristicRX.writeValue(chunk);
                    }
                    if (encoded.length > 20) {
                        await new Promise(r => setTimeout(r, 12));
                    }
                }
            }
        } catch (err) {
            this.log(`[WRITE ERR] ${err.message}`);
            throw err;
        } finally {
            this.isWriting = false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Closed-Loop Code Flashing Engine with Auto-Retry
    // ─────────────────────────────────────────────────────────────────────────
    async uploadCode(code, onProgress = null) {
        if (!this.isConnected) {
            throw new Error('Device is not connected. Please connect via USB, Bluetooth, or WiFi.');
        }

        if (onProgress) onProgress(2);
        const newline = '\n';

        let files = {};
        if (typeof code === 'string') {
            files['app.py'] = code;
        } else if (code && code.sourceDirectory && code.filesToUpload) {
            this.log(`[UPLOAD] Fetching project files from ${code.sourceDirectory}...`);
            for (const filename of code.filesToUpload) {
                const response = await fetch(`${code.sourceDirectory}${filename}?t=${Date.now()}`);
                if (!response.ok) throw new Error(`Failed to load ${filename}`);
                files[filename] = await response.text();
            }
        } else if (typeof code === 'object' && code.files) {
            files = code.files;
        } else if (typeof code === 'object') {
            files = code;
        }

        const fileEntries = Object.entries(files);
        if (fileEntries.length === 0) {
            throw new Error('No code files provided to upload.');
        }

        const totalLinesAllFiles = fileEntries.reduce((sum, [_, content]) => sum + (content ? content.split('\n').length : 0), 0);
        let linesProcessed = 0;

        try {
            this.log('[UPLOAD] Halting any active program...');
            await this.stopCode();
            await new Promise(r => setTimeout(r, 150));

            this.log('[UPLOAD] Sanitizing transmission buffers...');
            await this.write(`CLEAR${newline}`);
            await new Promise(r => setTimeout(r, 100));

            for (const [filename, content] of fileEntries) {
                const lines = (content || '').split('\n').map(l => l.trimEnd());
                this.log(`[UPLOAD] Writing ${filename} (${lines.length} lines)...`);

                // 1. Send Handshake Initiation with closed-loop ACK & retry
                await this.writeAndAwaitResponse(`BEGIN_UPLOAD:${lines.length}:${filename}${newline}`, 'UPLOAD:READY', 3000, 3);

                // 2. Stream Lines with ACK & Retry
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i] + newline;
                    await this.writeAndAwaitResponse(line, 'UPLOAD:OK', 2500, 3);

                    linesProcessed++;
                    if (onProgress) {
                        const pct = Math.min(98, Math.floor((linesProcessed / Math.max(1, totalLinesAllFiles)) * 96) + 2);
                        onProgress(pct);
                    }
                }
            }

            // 3. Start Execution
            this.log('[UPLOAD] Flash complete. Launching program...');
            await this.write(`START${newline}`);
            if (onProgress) onProgress(100);
            this.log('[UPLOAD] Robot successfully updated and running.');
        } catch (err) {
            this.log(`[UPLOAD ERR] ${err.message}`);
            throw err;
        }
    }
}

export const connectionManager = new ConnectionManager();
