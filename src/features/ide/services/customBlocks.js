import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';

export const defineCustomBlocks = () => {
    // --- SERVO: Set Angle (180° positional) ---
    Blockly.Blocks['esp32_servo'] = {
        init: function () {
            this.appendValueInput("ANGLE")
                .setCheck("Number")
                .appendField("🟣 Servo")
                .appendField(new Blockly.FieldDropdown([
                    ["1 (GP18)", "1"],
                    ["2 (GP19)", "2"],
                    ["3 (GP33)", "3"]
                ]), "PIN")
                .appendField("Angle");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("180\u00b0 servo: move to absolute angle 0\u2013180\u00b0.");
        }
    };

    pythonGenerator.forBlock['esp32_servo'] = function (block) {
        const pin   = block.getFieldValue('PIN');
        const angle = pythonGenerator.valueToCode(block, 'ANGLE', pythonGenerator.ORDER_ATOMIC) || '90';
        const varName = `servo_${pin}`;
        pythonGenerator.definitions_[`drv_servo_${pin}`] = `${varName} = ten.Servo(${pin})`;
        return `${varName}.angle(int(${angle}))\n`;
    };

    // --- SERVO: Sweep (180° smooth sweep) ---
    Blockly.Blocks['esp32_servo_sweep'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("🟣 Servo")
                .appendField(new Blockly.FieldDropdown([["1 (GP18)", "1"], ["2 (GP19)", "2"], ["3 (GP33)", "3"]]), "PIN")
                .appendField("Sweep");
            this.appendValueInput("START")
                .setCheck("Number")
                .appendField("from");
            this.appendValueInput("END")
                .setCheck("Number")
                .appendField("to");
            this.appendDummyInput()
                .appendField("step")
                .appendField(new Blockly.FieldNumber(5, 1, 90, 1), "STEP")
                .appendField("\u00b0  delay")
                .appendField(new Blockly.FieldNumber(20, 1, 500, 1), "DELAY")
                .appendField("ms");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("Sweep servo from one angle to another. step=degrees per step, delay=ms between steps.");
        }
    };

    pythonGenerator.forBlock['esp32_servo_sweep'] = function (block) {
        const pin   = block.getFieldValue('PIN');
        const step  = block.getFieldValue('STEP');
        const delay = block.getFieldValue('DELAY');
        const start = pythonGenerator.valueToCode(block, 'START', pythonGenerator.ORDER_ATOMIC) || '0';
        const end   = pythonGenerator.valueToCode(block, 'END',   pythonGenerator.ORDER_ATOMIC) || '180';
        const varName = `servo_${pin}`;
        pythonGenerator.definitions_[`drv_servo_${pin}`] = `${varName} = ten.Servo(${pin})`;
        return `${varName}.sweep(int(${start}), int(${end}), step_deg=${step}, delay_ms=${delay})\n`;
    };

    // --- SERVO: Step mode (nudge \u00b1 degrees) ---
    Blockly.Blocks['esp32_servo_step'] = {
        init: function () {
            this.appendValueInput("DELTA")
                .setCheck("Number")
                .appendField("🟣 Servo")
                .appendField(new Blockly.FieldDropdown([["1 (GP18)", "1"], ["2 (GP19)", "2"], ["3 (GP33)", "3"]]), "PIN")
                .appendField("Step");
            this.appendDummyInput().appendField("\u00b0");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("Nudge servo by \u00b1 degrees from its current position. Use negative values to go back.");
        }
    };

    pythonGenerator.forBlock['esp32_servo_step'] = function (block) {
        const pin   = block.getFieldValue('PIN');
        const delta = pythonGenerator.valueToCode(block, 'DELTA', pythonGenerator.ORDER_ATOMIC) || '5';
        const varName = `servo_${pin}`;
        pythonGenerator.definitions_[`drv_servo_${pin}`] = `${varName} = ten.Servo(${pin})`;
        return `${varName}.step(int(${delta}))\n`;
    };

    // --- SERVO: 360\u00b0 Continuous Rotation ---
    Blockly.Blocks['esp32_servo_360'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("🔵 360\u00b0 Servo")
                .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"]]), "PIN")
                .appendField(new Blockly.FieldDropdown([
                    ["Run CW \u21bb",  "CW"],
                    ["Run CCW \u21ba", "CCW"],
                    ["Stop \u25a0",    "STOP"]
                ]), "STATE")
                .appendField("Speed");
            this.appendValueInput("SPEED")
                .setCheck("Number");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#0077CC');
            this.setTooltip("360\u00b0 continuous rotation servo. Speed 0\u2013100. Direction: CW or CCW.");
        }
    };

    pythonGenerator.forBlock['esp32_servo_360'] = function (block) {
        const pin   = block.getFieldValue('PIN');
        const state = block.getFieldValue('STATE');
        const speed = pythonGenerator.valueToCode(block, 'SPEED', pythonGenerator.ORDER_ATOMIC) || '50';
        const varName = `servo_${pin}`;
        pythonGenerator.definitions_[`drv_servo_${pin}`] = `${varName} = ten.Servo(${pin})`;
        if (state === 'STOP') return `${varName}.stop_360()\n`;
        const s = `max(0, min(100, int(${speed})))`;
        const finalSpeed = state === 'CCW' ? `-${s}` : s;
        return `${varName}.run_360(${finalSpeed})\n`;
    };

    // --- SERVO: Center (90°) convenience block ---
    Blockly.Blocks['esp32_servo_center'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("🟣 Servo")
                .appendField(new Blockly.FieldDropdown([
                    ["1 (GP18)", "1"],
                    ["2 (GP19)", "2"],
                    ["3 (GP33)", "3"]
                ]), "PIN")
                .appendField("Center (90°)");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("Move servo to center/neutral position at 90°.");
        }
    };

    pythonGenerator.forBlock['esp32_servo_center'] = function (block) {
        const pin = block.getFieldValue('PIN');
        const varName = `servo_${pin}`;
        pythonGenerator.definitions_[`drv_servo_${pin}`] = `${varName} = ten.Servo(${pin})`;
        return `${varName}.angle(90)\n`;
    };

    // --- MOTOR BLOCK (Bidirectional: M1, M2, M3 via DRV8833) ---
    Blockly.Blocks['esp32_motor'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("⚙️ Motor")
                .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"], ["3", "3"]]), "MOTOR")
                .appendField(new Blockly.FieldDropdown([["Forward ▶", "FWD"], ["Backward ◀", "BWD"], ["Stop ■", "STOP"]]), "DIR")
                .appendField("Speed");
            this.appendValueInput("SPEED")
                .setCheck("Number");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("Control bidirectional motor (M1–M3). Speed: 0–100.");
        }
    };

    pythonGenerator.forBlock['esp32_motor'] = function (block) {
        const motor = block.getFieldValue('MOTOR');
        const dir = block.getFieldValue('DIR');
        const speed = pythonGenerator.valueToCode(block, 'SPEED', pythonGenerator.ORDER_ATOMIC) || '80';

        const speedCode = `max(0, min(100, int(${speed})))`;
        let finalSpeed = speedCode;
        if (dir === 'BWD') finalSpeed = `-${speedCode}`;
        if (dir === 'STOP') finalSpeed = '0';

        const varName = `motor_${motor}`;
        pythonGenerator.definitions_[`drv_motor_${motor}`] = `${varName} = ten.Motor(${motor})`;
        return `${varName}.drive(${finalSpeed})\n`;
    };

    // --- OUTPUT BLOCK (Single-Direction: OUT1, OUT2 via DRV8833 #2 B-channel) ---
    Blockly.Blocks['esp32_output'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("🔌 Output")
                .appendField(new Blockly.FieldDropdown([["1 (GP4)", "1"], ["2 (GP5)", "2"]]), "OUT")
                .appendField(new Blockly.FieldDropdown([["Run ▶", "RUN"], ["Stop ■", "STOP"]]), "STATE")
                .appendField("Speed");
            this.appendValueInput("SPEED")
                .setCheck("Number");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FF8C00');
            this.setTooltip("Single-direction output (OUT1 / OUT2). Speed: 0–100. No reverse.");
        }
    };

    pythonGenerator.forBlock['esp32_output'] = function (block) {
        const out = block.getFieldValue('OUT');
        const state = block.getFieldValue('STATE');
        const speed = pythonGenerator.valueToCode(block, 'SPEED', pythonGenerator.ORDER_ATOMIC) || '100';

        const varName = `output_${out}`;
        pythonGenerator.definitions_[`drv_output_${out}`] = `${varName} = ten.Output(${out})`;

        if (state === 'STOP') return `${varName}.stop()\n`;
        const speedCode = `max(0, min(100, int(${speed})))`;
        return `${varName}.run(${speedCode})\n`;
    };

    // --- STEPPER MOTOR BLOCK (DRV8833 #2 all 4 pins: M3 + OUT1/OUT2) ---
    Blockly.Blocks['esp32_stepper'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("🔄 Stepper")
                .appendField(new Blockly.FieldDropdown([["Clockwise ↻", "CW"], ["Counter-CW ↺", "CCW"]]), "DIR")
                .appendField("Steps");
            this.appendValueInput("STEPS")
                .setCheck("Number");
            this.appendDummyInput()
                .appendField("Step Delay")
                .appendField(new Blockly.FieldNumber(10, 1, 500, 1), "DELAY")
                .appendField("ms");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip("Move stepper. Step Delay: ms between each step (1=fastest, 500=slowest). Cannot use M3 or OUT1/OUT2 simultaneously.");
        }
    };

    pythonGenerator.forBlock['esp32_stepper'] = function (block) {
        const dir   = block.getFieldValue('DIR');
        const delay = block.getFieldValue('DELAY');
        const steps = pythonGenerator.valueToCode(block, 'STEPS', pythonGenerator.ORDER_ATOMIC) || '100';
        const finalSteps = dir === 'CCW' ? `-int(${steps})` : `int(${steps})`;
        pythonGenerator.definitions_['drv_stepper'] = 'stepper = ten.Stepper()';
        return `stepper.step(${finalSteps}, delay_ms=${delay})\n`;
    };

    // --- STEPPER: Move by Degrees ---
    Blockly.Blocks['esp32_stepper_degrees'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("🔄 Stepper")
                .appendField(new Blockly.FieldDropdown([["Clockwise ↻", "CW"], ["Counter-CW ↺", "CCW"]]), "DIR")
                .appendField("°");
            this.appendValueInput("DEGREES")
                .setCheck("Number");
            this.appendDummyInput()
                .appendField("Step Delay")
                .appendField(new Blockly.FieldNumber(10, 1, 500, 1), "DELAY")
                .appendField("ms");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip("Move stepper by degrees. 360° = 1 full revolution (200 steps). Uses 1.8°/step.");
        }
    };

    pythonGenerator.forBlock['esp32_stepper_degrees'] = function (block) {
        const dir     = block.getFieldValue('DIR');
        const delay   = block.getFieldValue('DELAY');
        const degrees = pythonGenerator.valueToCode(block, 'DEGREES', pythonGenerator.ORDER_ATOMIC) || '360';
        const finalDeg = dir === 'CCW' ? `-float(${degrees})` : `float(${degrees})`;
        pythonGenerator.definitions_['drv_stepper'] = 'stepper = ten.Stepper()';
        return `stepper.move_degrees(${finalDeg}, delay_ms=${delay})\n`;
    };

    // --- STEPPER: Release Coils ---
    Blockly.Blocks['esp32_stepper_stop'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("🔄 Stepper Release Coils");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#9966FF');
            this.setTooltip("De-energize all stepper coils. Saves power and releases holding torque.");
        }
    };

    pythonGenerator.forBlock['esp32_stepper_stop'] = function () {
        pythonGenerator.definitions_['drv_stepper'] = 'stepper = ten.Stepper()';
        return `stepper.release()\n`;
    };


    // --- I2C SENSOR READ BLOCK ---
    Blockly.Blocks['esp32_i2c_read'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("📡 I2C Read addr")
                .appendField(new Blockly.FieldNumber(104, 0, 127, 1), "ADDR")
                .appendField("reg")
                .appendField(new Blockly.FieldNumber(0, 0, 255, 1), "REG")
                .appendField("bytes")
                .appendField(new Blockly.FieldDropdown([["1", "1"], ["2", "2"]]), "NBYTES");
            this.setOutput(true, "Number");
            this.setColour('#00C8C8');
            this.setTooltip("Read bytes from I2C sensor register. addr=decimal (e.g. 104=0x68 MPU6050). Returns integer.");
        }
    };

    pythonGenerator.forBlock['esp32_i2c_read'] = function (block) {
        const addr   = block.getFieldValue('ADDR');
        const reg    = block.getFieldValue('REG');
        const nbytes = block.getFieldValue('NBYTES');
        return [`ten.i2c_read(${addr}, ${reg}, ${nbytes})`, pythonGenerator.ORDER_ATOMIC];
    };

    // --- I2C SENSOR WRITE BLOCK ---
    Blockly.Blocks['esp32_i2c_write'] = {
        init: function () {
            this.appendValueInput("VALUE")
                .setCheck("Number")
                .appendField("📡 I2C Write addr")
                .appendField(new Blockly.FieldNumber(104, 0, 127, 1), "ADDR")
                .appendField("reg")
                .appendField(new Blockly.FieldNumber(0, 0, 255, 1), "REG")
                .appendField("value");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#00C8C8');
            this.setTooltip("Write one byte to an I2C sensor register.");
        }
    };

    pythonGenerator.forBlock['esp32_i2c_write'] = function (block) {
        const addr  = block.getFieldValue('ADDR');
        const reg   = block.getFieldValue('REG');
        const value = pythonGenerator.valueToCode(block, 'VALUE', pythonGenerator.ORDER_ATOMIC) || '0';
        return `ten.i2c_write(${addr}, ${reg}, int(${value}))\n`;
    };

    // --- I2C SCAN BLOCK ---
    Blockly.Blocks['esp32_i2c_scan'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("📡 I2C Scan (print addresses)");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#00C8C8');
            this.setTooltip("Scan I2C bus and print all found device addresses to serial.");
        }
    };

    pythonGenerator.forBlock['esp32_i2c_scan'] = function () {
        return `print("I2C devices:", [hex(a) for a in ten.i2c_scan()])\n`;
    };

    // --- I2C MPU6050 ACCELEROMETER PRESET ---
    Blockly.Blocks['esp32_i2c_mpu6050'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("📡 MPU6050 Accel")
                .appendField(new Blockly.FieldDropdown([
                    ["X axis", "0x3B"],
                    ["Y axis", "0x3D"],
                    ["Z axis", "0x3F"]
                ]), "AXIS");
            this.setOutput(true, "Number");
            this.setColour('#00C8C8');
            this.setTooltip("Read MPU6050 accelerometer axis (addr 0x68). NOTE: first wake it up with I2C Write addr=104, reg=107, value=0.");
        }
    };

    pythonGenerator.forBlock['esp32_i2c_mpu6050'] = function (block) {
        const reg = block.getFieldValue('AXIS');
        return [`ten.i2c_read(0x68, ${reg}, 2)`, pythonGenerator.ORDER_ATOMIC];
    };

    // --- I2C TEMPERATURE (TMP102) PRESET ---
    Blockly.Blocks['esp32_i2c_temp'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("📡 Temp °C (TMP102) addr")
                .appendField(new Blockly.FieldNumber(72, 0, 127, 1), "ADDR");
            this.setOutput(true, "Number");
            this.setColour('#00C8C8');
            this.setTooltip("Read temperature in °C from TMP102 sensor. Default address: 72 (0x48).");
        }
    };

    pythonGenerator.forBlock['esp32_i2c_temp'] = function (block) {
        const addr = block.getFieldValue('ADDR');
        pythonGenerator.definitions_['fn_tmp102'] =
`def _read_tmp102(addr):
    raw = ten.i2c_read(addr, 0x00, 2)
    t = (raw >> 4) * 0.0625
    if t > 128: t -= 256
    return round(t, 1)`;
        return [`_read_tmp102(${addr})`, pythonGenerator.ORDER_ATOMIC];
    };


    // --- DIGITAL PIN BLOCK ---
    Blockly.Blocks['esp32_digital_write'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Set Digital Pin")
                .appendField(new Blockly.FieldDropdown([
                    ["OUT1 (D23)", "23"], 
                    ["OUT2 (D5)", "5"], 
                    ["M1 IN1 (D13)", "13"], 
                    ["M1 IN2 (D14)", "14"], 
                    ["M2 IN1 (D27)", "27"], 
                    ["M2 IN2 (D26)", "26"], 
                    ["M3 IN1 (D25)", "25"], 
                    ["M3 IN2 (D33)", "33"]
                ]), "PIN")
                .appendField("to")
                .appendField(new Blockly.FieldDropdown([["HIGH", "1"], ["LOW", "0"]]), "STATE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
        }
    };

    pythonGenerator.forBlock['esp32_digital_write'] = function (block) {
        const pin = block.getFieldValue('PIN');
        const state = block.getFieldValue('STATE');
        const varName = `pin_${pin}`;
        pythonGenerator.definitions_[`drv_pin_${pin}`] = `${varName} = machine.Pin(${pin}, machine.Pin.OUT)`;
        return `${varName}.value(${state})\n`;
    };

    Blockly.Blocks['esp32_sensor_read'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Sensor")
                .appendField(new Blockly.FieldDropdown([["1 (D34)", "1"], ["2 (D35)", "2"], ["3 (D32)", "3"], ["4 (D4)", "4"]]), "PORT")
                .appendField("(%)");
            this.setOutput(true, "Number");
            this.setColour('#4CBFE6');
            this.setTooltip("Get sensor value as a percentage (0-100)");
        }
    };

    pythonGenerator.forBlock['esp32_sensor_read'] = function (block) {
        const port = block.getFieldValue('PORT');
        const varName = `sensor_${port}`;
        pythonGenerator.definitions_[`drv_sensor_${port}`] = `${varName} = ten.Sensor(${port})`;
        return [`${varName}.read_pct()`, pythonGenerator.ORDER_ATOMIC];
    };


    // --- ULTRASONIC SENSOR BLOCK ---
    Blockly.Blocks['esp32_ultrasonic_read'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Read Ultrasonic Sensor")
                .appendField("Trigger")
                .appendField(new Blockly.FieldDropdown([["OUT1 (D23)", "23"], ["OUT2 (D5)", "5"], ["SN4 (D4)", "4"]]), "TRIG")
                .appendField("Echo")
                .appendField(new Blockly.FieldDropdown([["SN3 (D32)", "32"], ["SN4 (D4)", "4"]]), "ECHO");
            this.setOutput(true, "Number");
            this.setColour('#4CBFE6');
            this.setTooltip("Read distance in cm");
        }
    };

    pythonGenerator.forBlock['esp32_ultrasonic_read'] = function (block) {
        const trig = block.getFieldValue('TRIG');
        const echo = block.getFieldValue('ECHO');

        const funcName = `get_distance_${trig}_${echo}`;
        pythonGenerator.definitions_[funcName] = `
def ${funcName}():
    t_pin = machine.Pin(${trig}, machine.Pin.OUT)
    e_pin = machine.Pin(${echo}, machine.Pin.IN)
    t_pin.value(0)
    time.sleep_us(2)
    t_pin.value(1)
    time.sleep_us(10)
    t_pin.value(0)
    try:
        pulse_time = machine.time_pulse_us(e_pin, 1, 30000)
        if pulse_time > 0: return pulse_time / 58.0
    except: pass
    return 999.0
`;
        return [`${funcName}()`, pythonGenerator.ORDER_ATOMIC];
    };

    // --- BROADCAST TELEMETRY ---
    Blockly.Blocks['esp32_broadcast'] = {
        init: function () {
            this.appendValueInput("VAL").appendField("Broadcast Data (0-100)");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4CBFE6');
        }
    };

    pythonGenerator.forBlock['esp32_broadcast'] = function (block) {
        const val = pythonGenerator.valueToCode(block, 'VAL', pythonGenerator.ORDER_ATOMIC) || '0';
        return `print(f"SENSOR:{int(${val})}")\n`;
    };

    Blockly.Blocks['esp32_oled_print'] = {
        init: function () {
            this.appendValueInput("TEXT").appendField("OLED Print");
            this.appendValueInput("LINE").appendField("Row (0-5)");
            this.appendDummyInput()
                .appendField("Size")
                .appendField(new Blockly.FieldDropdown([["1x", "1"], ["2x", "2"], ["3x", "3"], ["4x", "4"]]), "SIZE");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#475569');
        }
    };

    pythonGenerator.forBlock['esp32_oled_print'] = function (block) {
        const t = pythonGenerator.valueToCode(block, 'TEXT', pythonGenerator.ORDER_ATOMIC) || "''";
        let l = pythonGenerator.valueToCode(block, 'LINE', pythonGenerator.ORDER_ATOMIC) || 'None';
        const s = block.getFieldValue('SIZE') || '1';
        
        let yParam = 'None';
        if (l !== 'None') {
            yParam = `int(${l}) * 10`;
        }
        return `ten.display.print(${t}, y=${yParam}, size=${s})\nten.display.show()\n`;
    };

    Blockly.Blocks['esp32_oled_clear'] = {
        init: function () {
            this.appendDummyInput().appendField("OLED Clear");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#475569');
        }
    };

    pythonGenerator.forBlock['esp32_oled_clear'] = function () {
        return `ten.display.clear()\nten.display.show()\n`;
    };

    Blockly.Blocks['esp32_oled_sensor_view'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("View Sensor")
                .appendField(new Blockly.FieldDropdown([["1 (D34)", "1"], ["2 (D35)", "2"], ["3 (D32)", "3"], ["4 (D4)", "4"]]), "PORT")
                .appendField("as % on OLED Line")
                .appendField(new Blockly.FieldDropdown([["0", "0"], ["1", "10"], ["2", "20"], ["3", "30"], ["4", "40"], ["5", "50"]]), "LINE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#475569');
            this.setTooltip("Read sensor and print its 0-100% value to the OLED display");
        }
    };

    pythonGenerator.forBlock['esp32_oled_sensor_view'] = function (block) {
        const port = block.getFieldValue('PORT');
        const line = block.getFieldValue('LINE');
        const varName = `sensor_${port}`;
        pythonGenerator.definitions_[`drv_sensor_${port}`] = `${varName} = ten.Sensor(${port})`;
        return `ten.display.print(${varName}.read_pct(), y=${line})\nten.display.show()\n`;
    };

    Blockly.Blocks['esp32_oled_sensor_full'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("View Sensor")
                .appendField(new Blockly.FieldDropdown([["1 (D34)", "1"], ["2 (D35)", "2"], ["3 (D32)", "3"], ["4 (D4)", "4"]]), "PORT")
                .appendField("Full Screen (%)");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#475569');
            this.setTooltip("Display sensor value (0-100) across the entire screen");
        }
    };

    pythonGenerator.forBlock['esp32_oled_sensor_full'] = function (block) {
        const port = block.getFieldValue('PORT');
        const varName = `sensor_${port}`;
        pythonGenerator.definitions_[`drv_sensor_${port}`] = `${varName} = ten.Sensor(${port})`;
        return `ten.display.big_print(${varName}.read_pct(), scale=6)\n`;
    };


    Blockly.Blocks['esp32_oled_emoji'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Show Emoji")
                .appendField(new Blockly.FieldDropdown([
                    ["Heart", "heart"],
                    ["Smile", "smile"],
                    ["Skull", "skull"],
                    ["Upset", "upset"]
                ]), "NAME");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#D65CD6');
            this.setTooltip("Display full-screen emoji");
        }
    };

    pythonGenerator.forBlock['esp32_oled_emoji'] = function (block) {
        const name = block.getFieldValue('NAME');
        return `ten.display.emoji("${name}")\n`;
    };

    Blockly.Blocks['esp32_eyes_blink'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Eyes")
                .appendField(new Blockly.FieldDropdown([
                    ["Smooth Blink", "blink"],
                    ["Happy Animation", "happy_eye"],
                    ["Angry Smooth", "angry"],
                    ["Sad Smooth", "sad"],
                    ["Surprised Smooth", "surprised"],
                    ["Squint Smooth", "squint"],
                    ["Thinking Smooth", "thinking"],
                    ["Wakeup Sequence", "wakeup"]
                ]), "ACTION");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#33CABD');
            this.setTooltip("Smooth, high-fidelity blink and eye animations");
        }
    };

    pythonGenerator.forBlock['esp32_eyes_blink'] = function (block) {
        const action = block.getFieldValue('ACTION');
        pythonGenerator.definitions_['drv_eyes_v2'] = 'import ten_eyes\neyes_v2 = ten_eyes.get_eyes()';
        return `eyes_v2.${action}()\n`;
    };

    // --- POWER SENSOR (INA219) BLOCKS ---
    Blockly.Blocks['esp32_get_battery'] = {
        init: function () {
            this.appendDummyInput().appendField("Battery %");
            this.setOutput(true, "Number");
            this.setColour('#475569');
            this.setTooltip("Get battery percentage (0-100)");
        }
    };
    pythonGenerator.forBlock['esp32_get_battery'] = function () {
        return ["ten.battery_pct()", pythonGenerator.ORDER_ATOMIC];
    };

    Blockly.Blocks['esp32_get_voltage'] = {
        init: function () {
            this.appendDummyInput().appendField("Voltage (V)");
            this.setOutput(true, "Number");
            this.setColour('#475569');
            this.setTooltip("Get bus voltage in Volts");
        }
    };
    pythonGenerator.forBlock['esp32_get_voltage'] = function () {
        return ["ten.voltage()", pythonGenerator.ORDER_ATOMIC];
    };

    Blockly.Blocks['esp32_get_current'] = {
        init: function () {
            this.appendDummyInput().appendField("Current (mA)");
            this.setOutput(true, "Number");
            this.setColour('#475569');
            this.setTooltip("Get current draw in mA");
        }
    };
    pythonGenerator.forBlock['esp32_get_current'] = function () {
        return ["ten.current()", pythonGenerator.ORDER_ATOMIC];
    };

    Blockly.Blocks['esp32_get_power'] = {
        init: function () {
            this.appendDummyInput().appendField("Power (mW)");
            this.setOutput(true, "Number");
            this.setColour('#475569');
            this.setTooltip("Get power consumption in mW");
        }
    };
    pythonGenerator.forBlock['esp32_get_power'] = function () {
        return ["ten.power()", pythonGenerator.ORDER_ATOMIC];
    };

    // --- WORKSPACE HEADER ---
    Blockly.Blocks['robot_sketch'] = {
        init: function() {
            this.appendDummyInput()
                .appendField("🚀 CODE SKETCH");
            this.setNextStatement(true, null);
            this.setColour('#FFD500'); // Event-like yellow
            this.setTooltip("Your robot's program starts here!");
            this.setDeletable(false);
            this.setMovable(false);
            this.setEditable(false);
        }
    };

    pythonGenerator.forBlock['robot_sketch'] = function(block) {
        return ""; // Header block generates no code itself
    };

    // --- BUILT-IN OVERRIDES ---
    // Loops blocks to Green (#59C059)
    if (Blockly.Blocks['controls_repeat_ext']) {
        const oldInit = Blockly.Blocks['controls_repeat_ext'].init;
        Blockly.Blocks['controls_repeat_ext'].init = function() {
            oldInit.call(this);
            this.setColour('#59C059');
        };
    }
    if (Blockly.Blocks['controls_whileUntil']) {
        const oldInit = Blockly.Blocks['controls_whileUntil'].init;
        Blockly.Blocks['controls_whileUntil'].init = function() {
            oldInit.call(this);
            this.setColour('#59C059');
        };
    }
    // If block and Logic blocks to Blue (#4C97FF)
    const blueBlocks = ['controls_if', 'logic_compare', 'logic_operation', 'logic_negate', 'logic_boolean'];
    blueBlocks.forEach(type => {
        if (Blockly.Blocks[type]) {
            const oldInit = Blockly.Blocks[type].init;
            Blockly.Blocks[type].init = function() {
                oldInit.call(this);
                this.setColour('#4C97FF');
            };
        }
    });

    // --- LOOP STOP-AWARENESS OVERRIDES ---
    pythonGenerator.forBlock['controls_whileUntil'] = function (block) {
        const until = block.getFieldValue('MODE') === 'UNTIL';
        let condition = pythonGenerator.valueToCode(block, 'BOOL', pythonGenerator.ORDER_NONE) || 'False';
        let branch = pythonGenerator.statementToCode(block, 'DO');
        branch = pythonGenerator.addLoopTrap(branch, block);
        if (until) {
            condition = 'not ' + condition;
        }
        // Injected ten.is_running() to allow the firmware to break the loop
        return `while ${condition} and ten.is_running():\n${branch}\n`;
    };

    pythonGenerator.forBlock['controls_repeat_ext'] = function (block) {
        let repeats = pythonGenerator.valueToCode(block, 'TIMES', pythonGenerator.ORDER_NONE) || '0';
        if (Blockly.utils.string.isNumber(repeats)) {
            repeats = parseInt(repeats, 10);
        } else {
            repeats = `int(${repeats})`;
        }
        let branch = pythonGenerator.statementToCode(block, 'DO');
        branch = pythonGenerator.addLoopTrap(branch, block);
        const loopVar = pythonGenerator.nameDB_.getDistinctName('count', Blockly.utils.NameType.VARIABLE);
        // Inject is_running check inside for loops to allow breaking mid-run
        return `for ${loopVar} in range(${repeats}):\n    if not ten.is_running(): break\n${branch}\n`;
    };



    // --- TIMING ---
    Blockly.Blocks['wait_seconds'] = {
        init: function () {
            this.appendValueInput("SECONDS").setCheck("Number").appendField("Wait");
            this.appendDummyInput().appendField("Seconds");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FFAB19');
        }
    };

    pythonGenerator.forBlock['wait_seconds'] = function (block) {
        const s = pythonGenerator.valueToCode(block, 'SECONDS', pythonGenerator.ORDER_ATOMIC) || '1';
        return `ten.delay(int(${s}*1000))\n`;
    };

    Blockly.Blocks['wait_ms'] = {
        init: function () {
            this.appendValueInput("MS").setCheck("Number").appendField("Wait");
            this.appendDummyInput().appendField("Milliseconds");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#FFAB19');
            this.setTooltip("Wait for a specific number of milliseconds");
        }
    };

    pythonGenerator.forBlock['wait_ms'] = function (block) {
        const ms = pythonGenerator.valueToCode(block, 'MS', pythonGenerator.ORDER_ATOMIC) || '100';
        return `ten.delay(int(${ms}))\n`;
    };

    Blockly.Blocks['esp32_get_uptime'] = {
        init: function () {
            this.appendDummyInput().appendField("Time since start (s)");
            this.setOutput(true, "Number");
            this.setColour('#FFAB19');
            this.setTooltip("Get the number of seconds since the robot started");
        }
    };

    pythonGenerator.forBlock['esp32_get_uptime'] = function () {
        return ["time.ticks_ms() / 1000.0", pythonGenerator.ORDER_ATOMIC];
    };

    // --- RESTRICTED NUMBER BLOCK (0-100) ---
    Blockly.Blocks['ten_number_100'] = {
        init: function() {
            this.appendDummyInput()
                .appendField(new Blockly.FieldNumber(0, 0, 100, 1), "NUM");
            this.setOutput(true, "Number");
            this.setColour('#4C97FF');
            this.setTooltip("Enter a value between 0 and 100 (Integers only)");
        }
    };

    pythonGenerator.forBlock['ten_number_100'] = function(block) {
        const num = block.getFieldValue('NUM');
        return [num, pythonGenerator.ORDER_ATOMIC];
    };
};
