import { SerialPort, ReadlineParser } from 'serialport';

const port = new SerialPort({ path: 'COM5', baudRate: 115200 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));

const TEST_CODE = `import machine, time
led = machine.Pin(4, machine.Pin.OUT)
print("TEST SCRIPT RUNNING!")
for _ in range(5):
    led.value(1)
    time.sleep(0.5)
    led.value(0)
    time.sleep(0.5)
print("TEST SCRIPT FINISHED!")
`;

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function write(data) {
    return new Promise((resolve) => {
        port.write(data, () => resolve());
    });
}

parser.on('data', data => console.log('<<<', data.trimEnd()));

port.on('open', async () => {
    console.log("--- OPENED COM5 ---");

    console.log("1. Sending STOP");
    await write("STOP\n");
    await delay(1000);

    console.log("2. Sending CLEAR");
    await write("CLEAR\n");
    await delay(500);

    console.log("3. Uploading Code");
    const lines = TEST_CODE.split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        await write(line + '\n');
        await delay(50);
    }

    console.log("4. Sending START");
    await write("START\n");

    console.log("--- WAITING FOR OUTPUT (10s) ---");
    await delay(10000);

    console.log("--- CLEANING UP ---");
    await write("STOP\n");
    await delay(500);
    port.close();
});

port.on('error', err => console.log('Error: ', err.message));
