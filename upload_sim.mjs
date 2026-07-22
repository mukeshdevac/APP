import { SerialPort } from 'serialport';

// Using the 75ms delay the user just set in ConnectionManager.js
const DELAY_MS = 75;
const port = new SerialPort({ path: 'COM5', baudRate: 115200 });

let buffer = '';
port.on('data', chunk => {
    buffer += chunk.toString();
    if (buffer.includes('\n')) {
        const lines = buffer.split('\n');
        buffer = lines.pop();
        lines.forEach(line => {
            const clean = line.replace(/[\r\n]/g, '');
            if (clean) console.log('ESP32 >', clean);
        });
    }
});

const CODE = `import machine, time, ten, gc

# --- SETUP ---
led = machine.Pin(2, machine.Pin.OUT)

try:
    print("Blink Started!")
    while ten.is_running():
        # Toggle LED
        led.value(not led.value())
        
        # Display Status
        ten.display.fill(0)
        ten.display.text("STATUS: RUNNING", 10, 20, 1)
        ten.display.text(f"LED: {led.value()}", 10, 40, 1)
        ten.display.show()
        
        # Log to App
        print(f"Blinking: {led.value()}")
        
        # Wait 500ms
        ten.delay(500)

except Exception as e:
    print(f"ERROR: {e}")

finally:
    led.value(0)
    gc.collect()
`;

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
async function write(data) {
    return new Promise(resolve => port.write(data, () => resolve()));
}

port.on('open', async () => {
    console.log(`\\n>>> SIMULATING UPLOAD WITH ${DELAY_MS}ms DELAY <<<\\n`);

    await write('STOP\r\n');
    await delay(500);

    await write('CLEAR\r\n');
    await delay(200);

    const lines = CODE.split('\n');
    for (const line of lines) {
        await write(line + '\r\n');
        await delay(DELAY_MS);
    }

    await write('START\r\n');

    console.log('\n--- MONITORING OUTPUT (8s) ---\n');
    await delay(8000);

    port.close();
});
