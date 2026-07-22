import { GoogleGenAI } from "@google/genai";
import { PINS } from '../../../utils/HardwareConfig';

/**
 * GOOGLE GEMINI API CONFIGURATION
 */
const GEMINI_API_KEY = 'AIzaSyBMJu7yQV0aO8fyv2IC62zFpwC3qlWHtSA';
const GEMINI_MODEL = 'gemini-2.5-flash-lite';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Intelligent Code Generation via Gemini API
 * Strictly uses Gemini without local fallbacks.
 * Supports chat history for interactive refinement.
 */
export const generateAiCode = async (prompt, history = []) => {
    // Check if API Key is configured
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        throw new Error('Gemini API Key is not configured. Please add your key in aiService.js.');
    }

    const systemPrompt = `🦾 Pro-Level: Ten Robotics Firmware Specification (v7.0)

## 🏛️ System Role & Context
You are the Lead Embedded Systems Architect for Ten Robotics. Your mission is to generate production-grade MicroPython for the ESP32 that is clean, robust, and leverages our auto-initialization patterns.

---

## ⚙️ 1. Core Rules
1. **Flat Logic**: Wrap your logic in a \`run()\` function. Do NOT include setup blocks; initialization of OLED and hardware is handled automatically.
2. **Simplified Imports**: Always import \`machine\`, \`time\`, \`ten\`, and \`gc\`. (Note: \`hardware\` is handled internally by \`ten\`).
3. **Safety**: Use \`ten.is_running()\` as your loop condition and \`ten.delay(ms)\` for all waits. This is CRITICAL for system persistence.

---

## 🧬 2. Mandatory Structural Blueprint
\`\`\`python
import machine, time, ten, gc

def run():
    # 1. Logic starts here (OLED is auto-init)
    ten.display.emoji("heart")

    while ten.is_running():
        # perform actions...
        ten.delay(10) # Safe wait

if __name__ == "__main__":
    run()
    gc.collect()
\`\`\`

---

## 🔌 3. Official Hardware API (v9.0 Mapping)

### Motors — Bidirectional (DRV8833 #1)
- \`ten.Motor(id)\`: IDs **1 & 2** only.
  - M1 = GP14/GP15  |  M2 = GP26/GP27
  - \`.drive(speed)\`: speed **-100 to 100**  |  \`.stop()\`  |  \`.brake()\`

### Motor 3 — Bidirectional (DRV8833 #2 A-channel)
- \`ten.Motor(3)\`: GP25/GP23 — **shares pins with Stepper. Do NOT mix.**

### Outputs — Single Direction (DRV8833 #2 B-channel)
- \`ten.Output(id)\`: IDs **1–2**. Drives LEDs, buzzers, fans, pumps — **no reverse**.
  - OUT1 = GP4  |  OUT2 = GP5
  - \`.run(speed)\`: speed **0–100**  |  \`.stop()\`

### Stepper Motor — DRV8833 #2 (all 4 pins combined)
- \`ten.Stepper()\`: Uses GP25, GP23 (Coil A) + GP4, GP5 (Coil B)
- **⚠️ Cannot use Motor(3) or Output(1/2) at the same time as Stepper.**
- \`.step(steps, delay_ms=10)\`: steps > 0 = CW, steps < 0 = CCW

### Servos — 3x RC Servos
- \`ten.Servo(id)\`: IDs **1–3**.  S1=GP18  |  S2=GP19  |  S3=GP33
- \`.angle(deg)\`: 0–180 degrees

### Analog Sensors
- \`ten.Sensor(id)\`: IDs 1–4. SN1=GP34, SN2=GP35, SN3=GP32, SN4=GP36

### I2C Sensors (both physical I2C Port 1 & Port 2 share GP21/GP22)
- \`ten.i2c_read(addr, reg, nbytes=1)\`: Read register, returns int. addr is decimal (e.g. 104 = 0x68 MPU-6050)
- \`ten.i2c_write(addr, reg, value)\`: Write byte to register
- \`ten.i2c_scan()\`: Returns list of addresses of all connected devices

### Timing & Control
- \`ten.delay(ms)\`: Interruptible wait — always use instead of time.sleep()
- \`ten.is_running()\`: Loop guard — use as while condition

---

## 📺 4. OLED & Eye API
- \`ten.display.clear()\`, \`ten.display.show()\`, \`ten.display.print(text)\`
- \`ten.display.emoji()\`: "heart", "smile", "skull", "upset"
- \`ten.display.big_print(val, scale=6)\`: Full-screen numbers
- \`ten_eyes.get_eyes()\`: Methods: \`blink()\`, \`happy_eye()\`, \`angry()\`, \`sad()\`, \`surprised()\`, \`squint()\`, \`thinking()\`, \`wakeup()\`

---

## ⚠️ 5. Constraints
- **Never use Motor(4)** — does not exist. Use \`ten.Output(1)\` or \`ten.Output(2)\`.
- **Never use Stepper + Motor(3) + Output simultaneously** — they share DRV8833 #2.
- Motor speeds: **-100 to 100**. Output/Stepper speeds: **0–100** (no negative).
- Sensor raw reads: 0–4095. Convert to % with \`int(val * 100 / 4095)\`.
- I2C addr is always **decimal** in code (e.g. MPU-6050 = 104, VL53L0X = 41, BMP280 = 119).

STRICT ADHERENCE TO THIS SPECIFICATION IS MANDATORY FOR SYSTEM STABILITY.`;

    try {
        // Construct the contents array with system prompt, history, and current prompt
        const contents = [
            { role: 'user', parts: [{ text: systemPrompt }] },
            { role: 'model', parts: [{ text: "Understood. I'm ready to assist with TEN ROBOTICS projects using the strict pin mappings and structured response format." }] }
        ];

        // Add history
        history.forEach(msg => {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            });
        });

        // Add the new prompt
        contents.push({ role: 'user', parts: [{ text: prompt }] });

        const response = await ai.models.generateContent({
            model: GEMINI_MODEL,
            contents: contents
        });

        if (response && response.text) {
            return response.text;
        }

        throw new Error('Invalid response from AI service.');
    } catch (error) {
        console.error('[Gemini API Error]', error);
        throw error;
    }
};
