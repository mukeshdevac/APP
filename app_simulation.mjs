import { SerialPort } from 'serialport';

// Strict COM5 Connection mimicking Web Serial
const port = new SerialPort({ path: 'COM5', baudRate: 115200 });

let buffer = '';
port.on('data', chunk => {
    buffer += chunk.toString();
    if (buffer.includes('\n')) {
        const lines = buffer.split('\n');
        buffer = lines.pop(); // Keep incomplete line
        lines.forEach(line => {
            const clean = line.replace(/[\r\n]/g, '');
            if (clean) console.log('ESP32 >', clean);
        });
    }
});

const AI_CODE = `import machine, time, gc
led = machine.Pin(4, machine.Pin.OUT)
print("=== STARTING AI DIAGNOSTICS ===")
for i in range(5):
    print("AI Cycle", i, "| Memory Free:", gc.mem_free())
    led.value(not led.value())
    time.sleep(0.5)
print("=== DEMO FINISHED ===")
`;

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
async function write(data) {
    return new Promise(resolve => port.write(data, () => resolve()));
}

port.on('open', async () => {
    console.log('\\n>>> SIMULATING ConnectionManager.js UPLOAD <<<\\n');

    // 1. STOP
    console.log('[STEP 1] STOP');
    await write('STOP\r\n');
    await delay(500);

    // 2. CLEAR
    console.log('[STEP 2] CLEAR');
    await write('CLEAR\r\n');
    await delay(200);

    // 3. CHUNK & SEND
    console.log('[STEP 3] CHUNK & SEND (50ms Delay Per Line)');
    const lines = AI_CODE.split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        await write(line + '\r\n');
        await delay(50); // THIS IS THE CRITICAL FIX ADDED TO THE APP
    }

    // 4. START
    console.log('[STEP 4] START');
    await write('START\r\n');

    console.log('\n--- LISTENING FOR 8 SECONDS ---\n');
    await delay(8000);

    console.log('\\n>>> SIMULATION COMPLETE <<<\\n');
    port.close();
});

port.on('error', err => console.error('Serial Error:', err.message));
