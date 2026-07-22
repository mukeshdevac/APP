import { SerialPort } from 'serialport';

// 1. Establish strict COM5 connection
const port = new SerialPort({ path: 'COM5', baudRate: 115200 });

// 2. Use the exact buffer logic from the App's ConnectionManager fix!
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

// 3. AI Generated Code Payload
const AI_CODE = `import machine, time
import gc

led = machine.Pin(4, machine.Pin.OUT)
print('--- AI SCRIPT INITIALIZED ---')

count = 0
try:
    while True:
        count += 1
        print('AI Loop Iteration: ' + str(count) + ' | Memory Free: ' + str(gc.mem_free()))
        led.value(not led.value())
        time.sleep(0.5)
except Exception as e:
    print('--- AI SCRIPT STOPPED ---')
    print('Reason: ' + str(e))
    led.value(0)
`;

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
async function write(data) {
    return new Promise(resolve => port.write(data, () => resolve()));
}

port.on('open', async () => {
    console.log('\\n>>> COM5 CONNECTION ESTABLISHED <<<\\n');

    console.log('[STEP 1/4] Sending STOP command... (\\r\\n)');
    await write('STOP\r\n');
    await delay(1000);

    console.log('[STEP 2/4] Sending CLEAR command... (\\r\\n)');
    await write('CLEAR\r\n');
    await delay(500);

    console.log('[STEP 3/4] Uploading AI-Generated Code snippet (chunked at 50ms) ...');
    const lines = AI_CODE.split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        await write(line + '\r\n');
        await delay(50);
    }

    console.log('[STEP 4/4] Sending START command... (\\r\\n)');
    await write('START\r\n');

    console.log('\n=======================================');
    console.log('   WAITING 5 SECONDS FOR AI EXECUTION  ');
    console.log('=======================================\n');
    await delay(5000);

    console.log('\n=======================================');
    console.log('   SENDING STOP COMMAND TO HALT SCRIPT ');
    console.log('=======================================\n');
    await write('STOP\r\n');
    await delay(1500);

    console.log('\\n>>> SIMULATION COMPLETE <<<\\n');
    port.close();
});

port.on('error', err => console.error('Serial Error:', err.message));
