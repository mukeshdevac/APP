import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';

// Enforce standard 4-space indentation for Python code generation
pythonGenerator.INDENT = '    ';

export const defineCustomBlocks = () => {
    pythonGenerator.INDENT = '    ';
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

    // --- DUAL MOTOR / TANK DRIVE ---
    Blockly.Blocks['esp32_dual_motor'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("⚙️ Tank Drive Left (M1)");
            this.appendValueInput("LEFT_SPEED")
                .setCheck("Number");
            this.appendDummyInput()
                .appendField("%  Right (M2)");
            this.appendValueInput("RIGHT_SPEED")
                .setCheck("Number");
            this.appendDummyInput()
                .appendField("%");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("Drive Left (M1) and Right (M2) motors together. Speed: -100 to 100.");
        }
    };

    pythonGenerator.forBlock['esp32_dual_motor'] = function (block) {
        const left = pythonGenerator.valueToCode(block, 'LEFT_SPEED', pythonGenerator.ORDER_ATOMIC) || '80';
        const right = pythonGenerator.valueToCode(block, 'RIGHT_SPEED', pythonGenerator.ORDER_ATOMIC) || '80';
        pythonGenerator.definitions_['drv_motor_1'] = 'motor_1 = ten.Motor(1)';
        pythonGenerator.definitions_['drv_motor_2'] = 'motor_2 = ten.Motor(2)';
        return `motor_1.drive(int(${left}))\nmotor_2.drive(int(${right}))\n`;
    };

    // --- STOP ALL MOTORS ---
    Blockly.Blocks['esp32_stop_all_motors'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("⚙️ Stop All Motors");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#4C97FF');
            this.setTooltip("Stop and brake all DC motors (M1, M2, M3)");
        }
    };

    pythonGenerator.forBlock['esp32_stop_all_motors'] = function () {
        return `ten.stop_motors()\n`;
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


    // --- DIGITAL PIN BLOCKS ---
    Blockly.Blocks['esp32_digital_write'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Set Digital Pin")
                .appendField(new Blockly.FieldDropdown([
                    ["OUT1 (D4)", "4"], 
                    ["OUT2 (D5)", "5"], 
                    ["S1 (D18)", "18"],
                    ["S2 (D19)", "19"],
                    ["M1 IN1 (D13)", "13"], 
                    ["M1 IN2 (D14)", "14"], 
                    ["M2 IN1 (D27)", "27"], 
                    ["M2 IN2 (D26)", "26"], 
                    ["M3 IN1 (D25)", "25"], 
                    ["M3 IN2 (D23)", "23"],
                    ["BUZZER (D33)", "33"]
                ]), "PIN")
                .appendField("to")
                .appendField(new Blockly.FieldDropdown([["HIGH (1)", "1"], ["LOW (0)", "0"]]), "STATE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#0284C7');
            this.setTooltip("Set digital output pin HIGH (3.3V) or LOW (0V)");
        }
    };

    pythonGenerator.forBlock['esp32_digital_write'] = function (block) {
        const pin = block.getFieldValue('PIN');
        const state = block.getFieldValue('STATE');
        const varName = `pin_${pin}`;
        pythonGenerator.definitions_[`drv_pin_${pin}`] = `${varName} = machine.Pin(${pin}, machine.Pin.OUT)`;
        return `${varName}.value(${state})\n`;
    };

    Blockly.Blocks['esp32_digital_read'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Read Digital Pin")
                .appendField(new Blockly.FieldDropdown([
                    ["SN1 (D34)", "34"],
                    ["SN2 (D35)", "35"],
                    ["SN3 (D32)", "32"],
                    ["OUT1 (D4)", "4"],
                    ["OUT2 (D5)", "5"],
                    ["BTN1 (D16)", "16"],
                    ["BTN2 (D17)", "17"],
                    ["S1 (D18)", "18"],
                    ["S2 (D19)", "19"],
                    ["BUZZER (D33)", "33"]
                ]), "PIN");
            this.setOutput(true, "Number");
            this.setColour('#0284C7');
            this.setTooltip("Read logic level of digital pin (returns 1 or 0)");
        }
    };

    pythonGenerator.forBlock['esp32_digital_read'] = function (block) {
        const pin = block.getFieldValue('PIN');
        const varName = `pin_${pin}_in`;
        pythonGenerator.definitions_[`drv_pin_${pin}_in`] = `${varName} = machine.Pin(${pin}, machine.Pin.IN)`;
        return [`${varName}.value()`, pythonGenerator.ORDER_ATOMIC];
    };

    Blockly.Blocks['esp32_digital_toggle'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Toggle Digital Pin")
                .appendField(new Blockly.FieldDropdown([
                    ["OUT1 (D4)", "4"],
                    ["OUT2 (D5)", "5"],
                    ["S1 (D18)", "18"],
                    ["S2 (D19)", "19"],
                    ["BUZZER (D33)", "33"]
                ]), "PIN");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#0284C7');
            this.setTooltip("Inverts current state of digital output pin");
        }
    };

    pythonGenerator.forBlock['esp32_digital_toggle'] = function (block) {
        const pin = block.getFieldValue('PIN');
        const varName = `pin_${pin}`;
        pythonGenerator.definitions_[`drv_pin_${pin}`] = `${varName} = machine.Pin(${pin}, machine.Pin.OUT)`;
        return `${varName}.value(not ${varName}.value())\n`;
    };

    Blockly.Blocks['esp32_led_builtin'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Status LED (D2)")
                .appendField(new Blockly.FieldDropdown([["ON", "1"], ["OFF", "0"]]), "STATE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#0284C7');
            this.setTooltip("Turn onboard system status LED on or off");
        }
    };

    pythonGenerator.forBlock['esp32_led_builtin'] = function (block) {
        const state = block.getFieldValue('STATE');
        pythonGenerator.definitions_['drv_sys_led'] = 'sys_led = machine.Pin(2, machine.Pin.OUT)';
        return `sys_led.value(${state})\n`;
    };

    // --- ANALOG & PWM BLOCKS ---
    Blockly.Blocks['esp32_analog_read'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Analog Read Pin")
                .appendField(new Blockly.FieldDropdown([
                    ["SN1 (D34)", "34"],
                    ["SN2 (D35)", "35"],
                    ["SN3 (D32)", "32"],
                    ["SN4 / VBAT (D36)", "36"]
                ]), "PIN")
                .appendField("Raw (0-4095)");
            this.setOutput(true, "Number");
            this.setColour('#0D9488');
            this.setTooltip("Read 12-bit ADC raw reading (0 to 4095)");
        }
    };

    pythonGenerator.forBlock['esp32_analog_read'] = function (block) {
        const pin = block.getFieldValue('PIN');
        const varName = `adc_${pin}`;
        pythonGenerator.definitions_[`drv_adc_${pin}`] = `${varName} = machine.ADC(machine.Pin(${pin}))`;
        return [`${varName}.read()`, pythonGenerator.ORDER_ATOMIC];
    };

    Blockly.Blocks['esp32_analog_read_voltage'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("Analog Read Voltage")
                .appendField(new Blockly.FieldDropdown([
                    ["SN1 (D34)", "34"],
                    ["SN2 (D35)", "35"],
                    ["SN3 (D32)", "32"],
                    ["SN4 (D36)", "36"]
                ]), "PIN")
                .appendField("(Volts)");
            this.setOutput(true, "Number");
            this.setColour('#0D9488');
            this.setTooltip("Read analog voltage in Volts (0.0 to 3.3V)");
        }
    };

    pythonGenerator.forBlock['esp32_analog_read_voltage'] = function (block) {
        const pin = block.getFieldValue('PIN');
        const varName = `adc_${pin}`;
        pythonGenerator.definitions_[`drv_adc_${pin}`] = `${varName} = machine.ADC(machine.Pin(${pin}))`;
        return [`round((${varName}.read() / 4095.0) * 3.3, 2)`, pythonGenerator.ORDER_ATOMIC];
    };

    Blockly.Blocks['esp32_pwm_write'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("PWM Write Pin")
                .appendField(new Blockly.FieldDropdown([
                    ["S1 (D18)", "18"],
                    ["S2 (D19)", "19"],
                    ["BUZZER (D33)", "33"],
                    ["OUT1 (D4)", "4"],
                    ["OUT2 (D5)", "5"]
                ]), "PIN")
                .appendField("Duty");
            this.appendValueInput("DUTY")
                .setCheck("Number");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#0D9488');
            this.setTooltip("Generate PWM signal. Duty cycle: 0 to 1023 (0=0%, 1023=100%).");
        }
    };

    pythonGenerator.forBlock['esp32_pwm_write'] = function (block) {
        const pin = block.getFieldValue('PIN');
        const duty = pythonGenerator.valueToCode(block, 'DUTY', pythonGenerator.ORDER_ATOMIC) || '512';
        const varName = `pwm_${pin}`;
        pythonGenerator.definitions_[`drv_pwm_${pin}`] = `${varName} = machine.PWM(machine.Pin(${pin}), freq=1000)`;
        return `${varName}.duty(max(0, min(1023, int(${duty}))))\n`;
    };

    Blockly.Blocks['esp32_pwm_freq'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("PWM Set Freq Pin")
                .appendField(new Blockly.FieldDropdown([
                    ["S1 (D18)", "18"],
                    ["S2 (D19)", "19"],
                    ["BUZZER (D33)", "33"],
                    ["OUT1 (D4)", "4"],
                    ["OUT2 (D5)", "5"]
                ]), "PIN");
            this.appendValueInput("FREQ")
                .setCheck("Number")
                .appendField("Freq (Hz)");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#0D9488');
            this.setTooltip("Set PWM frequency in Hz (1 to 40000 Hz)");
        }
    };

    pythonGenerator.forBlock['esp32_pwm_freq'] = function (block) {
        const pin = block.getFieldValue('PIN');
        const freq = pythonGenerator.valueToCode(block, 'FREQ', pythonGenerator.ORDER_ATOMIC) || '1000';
        const varName = `pwm_${pin}`;
        pythonGenerator.definitions_[`drv_pwm_${pin}`] = `${varName} = machine.PWM(machine.Pin(${pin}), freq=1000)`;
        return `${varName}.freq(max(1, min(40000, int(${freq}))))\n`;
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

    // --- SERIAL & COMMUNICATION ---
    Blockly.Blocks['esp32_serial_print'] = {
        init: function () {
            this.appendValueInput("TEXT")
                .appendField("🖨️ Serial Print");
            this.appendDummyInput()
                .appendField(new Blockly.FieldDropdown([["with Newline", "true"], ["same Line", "false"]]), "NEWLINE");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#8B5CF6');
            this.setTooltip("Prints text or sensor values directly to the Web Serial & Bluetooth Monitor.");
        }
    };

    pythonGenerator.forBlock['esp32_serial_print'] = function (block) {
        const text = pythonGenerator.valueToCode(block, 'TEXT', pythonGenerator.ORDER_ATOMIC) || "''";
        const newline = block.getFieldValue('NEWLINE') === 'true';
        if (newline) {
            return `print(${text})\n`;
        } else {
            return `print(${text}, end='')\n`;
        }
    };

    Blockly.Blocks['esp32_serial_print_var'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("🖨️ Serial Print Label")
                .appendField(new Blockly.FieldTextInput("Value"), "LABEL");
            this.appendValueInput("VAL")
                .appendField("=");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#8B5CF6');
            this.setTooltip("Prints a label and its value to the Serial Monitor (e.g. 'Reading: 25.4')");
        }
    };

    pythonGenerator.forBlock['esp32_serial_print_var'] = function (block) {
        const label = block.getFieldValue('LABEL');
        const val = pythonGenerator.valueToCode(block, 'VAL', pythonGenerator.ORDER_ATOMIC) || "''";
        return `print(f"${label}: {${val}}")\n`;
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


    // --- REAL 32x32 MONOCHROME BITMAP EMOJIS (STANDALONE MICROPYTHON) ---
    const EMOJI_ENGINE = `
_EMOJI_BITMAPS = {
    'heart': b'\\x00\\x00\\x00\\x00\\x00x\\x1e\\x00\\x01\\xfe\\x7f\\x80\\x03\\xff\\xff\\xc0\\x07\\xff\\xff\\xe0\\x07\\xff\\xff\\xe0\\x07\\xff\\xff\\xe0\\x07\\xff\\xff\\xe0\\x07\\xff\\xff\\xe0\\x07\\xff\\xff\\xe0\\x07\\xff\\xff\\xe0\\x07\\xff\\xff\\xe0\\x03\\xff\\xff\\xc0\\x03\\xff\\xff\\xc0\\x01\\xff\\xff\\x80\\x01\\xff\\xff\\x80\\x00\\xff\\xff\\x00\\x00\\x7f\\xfe\\x00\\x00?\\xfc\\x00\\x00\\x1f\\xf8\\x00\\x00\\x0f\\xf0\\x00\\x00\\x03\\xc0\\x00\\x00\\x01\\x80\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'smile': b'\\x00\\x00\\x00\\x00\\x00\\x0f\\xe0\\x00\\x00\\x7f\\xfc\\x00\\x01\\xf0\\x1f\\x00\\x03\\xc0\\x07\\x80\\x07\\x00\\x01\\xc0\\x0e\\x00\\x00\\xe0\\x1c\\x00\\x00p\\x18\\x00\\x0008 \\x0880p\\x1c\\x180\\xf8>\\x18\`p\\x1c\\x0c\` \\x08\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c0@\\x00\\x180\`\\x04\\x1880\\x0c8\\x18\\x1c80\\x1c\\x0f\\xf0p\\x0e\\x00\\x00\\xe0\\x07\\x00\\x01\\xc0\\x03\\xc0\\x07\\x80\\x01\\xf0\\x1f\\x00\\x00\\x7f\\xfc\\x00\\x00\\x0f\\xe0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'cool': b'\\x00\\x00\\x00\\x00\\x00\\x0f\\xe0\\x00\\x00\\x7f\\xfc\\x00\\x01\\xf0\\x1f\\x00\\x03\\xc0\\x07\\x80\\x07\\x00\\x01\\xc0\\x0e\\x00\\x00\\xe0\\x1c\\x00\\x00p\\x18\\x00\\x000;\\xfc\\x7f\\xb82|O\\x982\\xff\\xdf\\x98c\\xff\\xff\\x8cc\\xfc\\x7f\\x8cc\\xfc\\x7f\\x8cc\\xfc\\x7f\\x8c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c0\\x00\\x00\\x180\\x00\\x04\\x188\\x00\\x088\\x18\\x1f\\xf80\\x1c\\x00\\x00p\\x0e\\x00\\x00\\xe0\\x07\\x00\\x01\\xc0\\x03\\xc0\\x07\\x80\\x01\\xf0\\x1f\\x00\\x00\\x7f\\xfc\\x00\\x00\\x0f\\xe0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'grin': b'\\x00\\x00\\x00\\x00\\x00\\x0f\\xe0\\x00\\x00\\x7f\\xfc\\x00\\x01\\xf0\\x1f\\x00\\x03\\xc0\\x07\\x80\\x07\\x00\\x01\\xc0\\x0e\\x00\\x00\\xe0\\x1c\\x00\\x00p\\x18\\x00\\x0009\\x00 81\\x881\\x180\\xd8\\x1b\\x18\`p\\x0e\\x0c\` \\x04\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0ca\\xff\\xff\\x0c0\\xff\\xff\\x180\\xff\\xff\\x188\\x00\\x008\\x18\\x7f\\xfe0\\x1c?\\xfcp\\x0e\\x0f\\xf0\\xe0\\x07\\x00\\x01\\xc0\\x03\\xc0\\x07\\x80\\x01\\xf0\\x1f\\x00\\x00\\x7f\\xfc\\x00\\x00\\x0f\\xe0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'robot': b'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x01\\x80\\x00\\x00\\x01\\x80\\x00\\x00\\x01\\x80\\x00\\x00\\x01\\x80\\x00\\x07\\xff\\xff\\xe0\\x07\\xff\\xff\\xe0\\x06\\x00\\x00\`\\x06\\x00\\x00\`\\x06\\x00\\x00\`\\x06|>\\x06|>\\x1e|>x\\x1e|>x\\x1e|>x\\x1e\\x00\\x00x\\x1e\\x00\\x00x\\x1e\\x00\\x00x\\x1e\\x00\\x00x\\x06\\x7f\\xfe\`\\x06I"\\x06I"\\x06\\x7f\\xfe\`\\x06\\x00\\x00\`\\x06\\x00\\x00\`\\x07\\xff\\xff\\xe0\\x07\\xff\\xff\\xe0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'cat': b'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x0f\\xe0\\x07\\xf0\\x07\\xc0\\x03\\xe0\\x03\\x81\\x01\\xc0\\x01\\x1f\\xf0\\x80\\x00\\x7f\\xfc\\x00\\x00\\xff\\xfe\\x00\\x01\\xff\\xff\\x00\\x03\\xff\\xff\\x80\\x03\\xff\\xff\\x80\\x07\\x87\\xc3\\xc0\\x07\\xa7\\xcb\\xc0\\x07\\xa7\\xcb\\xc0\\x07\\x87\\xc3\\xc0?\\xff\\xff\\xec\\x0f\\xfe\\x7f\\xf0\\x07\\xff\\xff\\xc0\\x0f\\xff\\xff\\xf07\\xff\\xff\\xcc\\x03\\xff\\xff\\x80\\x03\\xff\\xff\\x80\\x01\\xff\\xff\\x00\\x00\\xff\\xfe\\x00\\x00\\x7f\\xfc\\x00\\x00\\x1f\\xf0\\x00\\x00\\x01\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'skull': b'\\x00\\x00\\x00\\x00\\x00\\x01\\x00\\x00\\x00\\x1f\\xf0\\x00\\x00\\x7f\\xfc\\x00\\x00\\xff\\xfe\\x00\\x01\\xff\\xff\\x00\\x03\\xff\\xff\\x80\\x03\\xff\\xff\\x80\\x07\\xff\\xff\\xc0\\x07\\xff\\xff\\xc0\\x07\\x83\\xc1\\xc0\\x07\\x83\\xc1\\xc0\\x0f\\x83\\xc1\\xe0\\x07\\x83\\xc1\\xc0\\x07\\x83\\xc1\\xc0\\x07\\xff\\xff\\xc0\\x07\\xfe\\x7f\\xc0\\x03\\xfe\\x7f\\x80\\x03\\xff\\xff\\x80\\x01\\xff\\xff\\x00\\x00\\xff\\xfe\\x00\\x00\\x7f\\xfc\\x00\\x00?\\xfc\\x00\\x006\\xdc\\x00\\x006\\xdc\\x00\\x006\\xdc\\x00\\x006\\xdc\\x00\\x00?\\xfc\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'sad': b'\\x00\\x00\\x00\\x00\\x00\\x0f\\xe0\\x00\\x00\\x7f\\xfc\\x00\\x01\\xf0\\x1f\\x00\\x03\\xc0\\x07\\x80\\x07\\x00\\x01\\xc0\\x0e\\x00\\x00\\xe0\\x1c\\x00\\x00p\\x18\\x00\\x0008 \\x0880p\\x1c\\x180\\xf8>\\x18\`p\\x1c\\x0c\` \\x08\\x0c\`\\x00\\x00\\x8c\`\\x00\\x01\\xcc\`\\x00\\x01\\xcc\`\\x00\\x00\\x8c\`\\x00\\x00\\x0c0\\x00\\x00\\x180\\x0f\\xf0\\x188\\x1c88\\x180\\x0c0\\x1c\`\\x04p\\x0e\\x00\\x00\\xe0\\x07\\x00\\x01\\xc0\\x03\\xc0\\x07\\x80\\x01\\xf0\\x1f\\x00\\x00\\x7f\\xfc\\x00\\x00\\x0f\\xe0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'surprised': b'\\x00\\x00\\x00\\x00\\x00\\x0f\\xe0\\x00\\x00\\x7f\\xfc\\x00\\x01\\xf0\\x1f\\x00\\x03\\xc0\\x07\\x80\\x07\\x00\\x01\\xc0\\x0e\\x00\\x00\\xe0\\x1c \\x04p\\x18\\xf8\\x1f08\\xf8\\x1f81\\xfc?\\x980\\xf8\\x1f\\x18\`\\xf8\\x1f\\x0c\` \\x04\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c\`\\x01\\x00\\x0c\`\\x07\\xc0\\x0c0\\x0f\\xe0\\x180\\x0e\\xe0\\x188\\x1ep8\\x18\\x0e\\xe00\\x1c\\x0f\\xe0p\\x0e\\x07\\xc0\\xe0\\x07\\x01\\x01\\xc0\\x03\\xc0\\x07\\x80\\x01\\xf0\\x1f\\x00\\x00\\x7f\\xfc\\x00\\x00\\x0f\\xe0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'angry': b'\\x00\\x00\\x00\\x00\\x00\\x0f\\xe0\\x00\\x00\\x7f\\xfc\\x00\\x01\\xf0\\x1f\\x00\\x03\\xc0\\x07\\x80\\x07\\x00\\x01\\xc0\\x0e\\x00\\x00\\xe0\\x1c\\x00\\x00p\\x19\\x00\\x00\\xb09\\x80\\x01\\xb80\\xc0\\x03\\x180\`\\x06\\x18\`0\\x0c\\x0c\`x\\x1c\\x0c\`\\xf8>\\x0c\`p\\x1c\\x0c\` \\x08\\x0c\`\\x00\\x00\\x0c\`\\x00\\x00\\x0c0\\x00\\x00\\x180\\x00\\x00\\x188\\x00\\x008\\x18 \\x040\\x1c?\\xfcp\\x0e?\\xfc\\xe0\\x07\\x00\\x01\\xc0\\x03\\xc0\\x07\\x80\\x01\\xf0\\x1f\\x00\\x00\\x7f\\xfc\\x00\\x00\\x0f\\xe0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'ghost': b'\\x00\\x00\\x00\\x00\\x00\\x01\\x00\\x00\\x00\\x1f\\xf0\\x00\\x00\\x7f\\xfc\\x00\\x00\\xff\\xfe\\x00\\x01\\xff\\xff\\x00\\x03\\xff\\xff\\x80\\x03\\xff\\xff\\x80\\x07\\xff\\xff\\xc0\\x07\\xff\\xff\\xc0\\x07\\xc7\\xc7\\xc0\\x07\\x83\\x83\\xc0\\x0f\\xa3\\xa3\\xf0\\x0f\\xa3\\xa3\\xf0\\x0f\\xc7\\xc7\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0c\\xf3\\xcf0\\x08\\xe3\\x8e0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'star': b'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x01\\x80\\x00\\x00\\x01\\x80\\x00\\x00\\x01\\x80\\x00\\x00\\x03\\xc0\\x00\\x00\\x03\\xc0\\x00\\x00\\x03\\xc0\\x00\\x00\\x07\\xe0\\x00\\x00\\x07\\xe0\\x00\\x0f\\xff\\xff\\xf0\\x03\\xff\\xff\\xc0\\x01\\xff\\xff\\x80\\x00\\xff\\xff\\x00\\x00\\x7f\\xfe\\x00\\x00\\x1f\\xf8\\x00\\x00\\x1f\\xf8\\x00\\x00?\\xfc\\x00\\x00?\\xfc\\x00\\x00?\\xfc\\x00\\x00|>\x00\\x00x\\x1e\\x00\\x00\`\\x06\\x00\\x00@\\x02\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'thumbs_up': b'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xff\\xff\\x00\\x01\\xff\\xff\\x00\\x00?\\xff\\x00\\x000\\xff\\x00\\x00?\\xff\\x00\\x00?\\xff\\x00\\x000\\xff\\x00\\x00?\\xff\\x00\\x00?\\xff\\x00\\x000\\xff\\x00\\x03\\xff\\xff\\x00\\x03\\xff\\xff\\x00\\x03\\xf0\\x00\\x00\\x03\\xf0\\x00\\x00\\x03\\xf0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'fire': b'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x1f\\xf8\\x00\\x00\\x1f\\xf8\\x00\\x00\\x1f\\xff\\x00\\x00\\x1f\\xff\\x00\\x00\\x1f\\xff\\x00\\x00\\x1f\\xff\\x00\\x01\\xff\\xff\\xc0\\x01\\xff\\xff\\xc0\\x00\\xff\\xff\\x80\\x00\\x7f\\xff\\x00\\x00\\x7f\\xff\\x00\\x00<?\\x00\\x00<?\\x00\\x00\\x1c?\\x00\\x00\\x0c?\\x00\\x00\\x0c?\\x00\\x00\\x04?\\x00\\x00\\x040\\x00\\x00\\x00 \\x00\\x00\\x01\\xc0\\x00\\x00\\x01\\xc0\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'music': b'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x01\\xe0\\x00\\x00\\x0f\\xe0\\x00\\x00\\xff\\xe0\\x00\\x07\\xfe\`\\x00\\x0f\\xf0\`\\x00\\x0f\\x00\`\\x00\\x0c\\x00\`\\x00\\x0c\\x00\`\\x00\\x0c\\x00\`\\x00\\x0c\\x00\`\\x00\\x0c\\x00\`\\x00\\x0c\\x00\`\\x00\\x0c\\x02\`\\x00\\x0c\\x0f\\xe0\\x00\\x0c\\x1f\\xe0\\x00\\x0c\\x1f\\xe0\\x00L?\\xe0\\x01\\xfc\\x1f\\xc0\\x03\\xfc\\x1f\\xc0\\x03\\xfc\\x0f\\x80\\x07\\xfc\\x02\\x00\\x03\\xf8\\x00\\x00\\x03\\xf8\\x00\\x00\\x01\\xf0\\x00\\x00\\x00@\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'lightning': b'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00@\\x00\\x00\\x00\\xc0\\x00\\x00\\x01\\xc0\\x00\\x00\\x01\\xc0\\x00\\x00\\x03\\xc0\\x00\\x00\\x07\\xc0\\x00\\x00\\x0f\\xc0\\x00\\x00\\x1f\\xc0\\x00\\x00\\x1f\\xc0\\x00\\x00?\\xc0\\x00\\x00\\x7f\\xff\\x80\\x00\\xff\\xff\\x00\\x00\\xff\\xfe\\x00\\x00\\x01\\xfc\\x00\\x00\\x01\\xf8\\x00\\x00\\x01\\xf8\\x00\\x00\\x03\\xf0\\x00\\x00\\x03\\xe0\\x00\\x00\\x03\\xc0\\x00\\x00\\x03\\x80\\x00\\x00\\x07\\x00\\x00\\x00\\x07\\x00\\x00\\x00\\x06\\x00\\x00\\x00\\x0c\\x00\\x00\\x00\\x08\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'alien': b'\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x07\\xff\\xff\\xe0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xff\\xff\\xf0\\x0f\\xdf\\xfb\\xf0\\x1f\\x8f\\xf1\\xf8\\x0f\\x07\\xe0\\xf0\\x0f\\x07\\xe0\\xf0\\x0e\\x03\\xc0p\\x0f\\x07\\xe0\\xf0\\x0f\\x07\\xe0\\xf0\\x0f\\x8f\\xf1\\xf0\\x0f\\xff\\xff\\xf0\\x07\\xfd\\xbf\\xe0\\x07\\xff\\xff\\xe0\\x03\\xff\\xff\\xc0\\x03\\xfe\\x7f\\xc0\\x01\\xff\\xff\\x80\\x01\\xff\\xff\\x80\\x00\\xff\\xff\\x00\\x00\\x7f\\xfe\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
    'check': b'\\x00\\x00\\x00\\x00\\x00\\x01\\x00\\x00\\x00?\\xf8\\x00\\x00\\xff\\xfe\\x00\\x01\\xff\\xff\\x00\\x03\\xff\\xff\\x80\\x07\\xff\\xff\\xc0\\x0f\\xff\\xff\\xe0\\x1f\\xff\\xff\\xd0\\x1f\\xff\\xff\\x90?\\xff\\xff\\x18?\\xff\\xfe8?\\xff\\xfcx?\\xff\\xf8\\xf8?\\xff\\xf1\\xf8\\x7f\\xff\\xe3\\xfc?\\x7f\\xc7\\xf8??\\x8f\\xf8?\\x1f\\x1f\\xf8?\\x8e?\\xf8?\\xc4\\x7f\\xf8\\x1f\\xe0\\xff\\xf0\\x1f\\xf1\\xff\\xf0\\x0f\\xfb\\xff\\xe0\\x07\\xff\\xff\\xc0\\x03\\xff\\xff\\x80\\x01\\xff\\xff\\x00\\x00\\xff\\xfe\\x00\\x00?\\xf8\\x00\\x00\\x01\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00\\x00',
}

def _draw_native_emoji(name, x=48, y=16):
    if not hasattr(ten, 'display'): return
    if not getattr(ten.display, 'oled', None):
        ten.display.init()
    d = ten.display.oled
    if not d: return
    try:
        key = str(name).lower()
        if key in _EMOJI_BITMAPS:
            fb = framebuf.FrameBuffer(bytearray(_EMOJI_BITMAPS[key]), 32, 32, framebuf.MONO_HLSB)
            d.fill(0)
            d.blit(fb, int(x), int(y))
        else:
            d.fill(0)
            d.text(f"[{name}]", 20, 28, 1)
        d.show()
    except Exception as e:
        pass
`;

    Blockly.Blocks['esp32_oled_emoji'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("🖼️ Show Real Emoji")
                .appendField(new Blockly.FieldDropdown([
                    ["Smile 😊", "smile"],
                    ["Heart ❤️", "heart"],
                    ["Cool Sunglasses 😎", "cool"],
                    ["Grinning 😀", "grin"],
                    ["Robot 🤖", "robot"],
                    ["Cat 🐱", "cat"],
                    ["Skull 💀", "skull"],
                    ["Sad / Crying 😢", "sad"],
                    ["Surprised 😲", "surprised"],
                    ["Angry 😡", "angry"],
                    ["Ghost 👻", "ghost"],
                    ["Star ⭐", "star"],
                    ["Thumbs Up 👍", "thumbs_up"],
                    ["Fire / Flame 🔥", "fire"],
                    ["Music 🎵", "music"],
                    ["Lightning ⚡", "lightning"],
                    ["Alien 👽", "alien"],
                    ["Checkmark ✔️", "check"]
                ]), "NAME")
                .appendField("Position")
                .appendField(new Blockly.FieldDropdown([
                    ["Center (48, 16)", "48,16"],
                    ["Left (8, 16)", "8,16"],
                    ["Right (88, 16)", "88,16"],
                    ["Top Center (48, 4)", "48,4"],
                    ["Bottom Center (48, 30)", "48,30"]
                ]), "POS");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#D65CD6');
            this.setTooltip("Display real 1-bit monochrome bitmap pixel art emoji onto OLED display");
        }
    };

    pythonGenerator.forBlock['esp32_oled_emoji'] = function (block) {
        const name = block.getFieldValue('NAME');
        const [x, y] = (block.getFieldValue('POS') || "48,16").split(',');
        pythonGenerator.definitions_['drv_emoji_bitmaps'] = EMOJI_ENGINE;
        return `_draw_native_emoji("${name}", x=${x}, y=${y})\n`;
    };

    // --- PROCEDURAL OLED ROBOT EYES BLOCKS (STANDALONE MICROPYTHON) ---
    const ROBOT_EYES_ENGINE = `
class _RobotEyes:
    def __init__(self):
        self.w = 26
        self.h = 34
        self.r = 6
        self.gap = 20
        self.cx = 64
        self.cy = 32

    def _disp(self):
        if hasattr(ten, 'display'):
            if not getattr(ten.display, 'oled', None):
                ten.display.init()
            return ten.display.oled
        return None

    def _round_rect(self, x, y, w, h, r, col=1):
        d = self._disp()
        if not d or w <= 0 or h <= 0: return
        r = max(0, min(r, w // 2, h // 2))
        d.fill_rect(int(x + r), int(y), int(max(1, w - 2 * r)), int(h), col)
        d.fill_rect(int(x), int(y + r), int(r), int(max(1, h - 2 * r)), col)
        d.fill_rect(int(x + w - r), int(y + r), int(r), int(max(1, h - 2 * r)), col)
        for dx in range(r):
            for dy in range(r):
                if (r - 1 - dx) ** 2 + (r - 1 - dy) ** 2 <= r ** 2:
                    d.pixel(int(x + dx), int(y + dy), col)
                    d.pixel(int(x + w - 1 - dx), int(y + dy), col)
                    d.pixel(int(x + dx), int(y + h - 1 - dy), col)
                    d.pixel(int(x + w - 1 - dx), int(y + h - 1 - dy), col)

    def _circle(self, x, y, r, c=1):
        d = self._disp()
        if not d or r <= 0: return
        d.hline(int(x - r), int(y), int(r * 2), c)
        for i in range(1, int(r)):
            a = int(math.sqrt(r * r - i * i))
            d.hline(int(x - a), int(y + i), int(a * 2), c)
            d.hline(int(x - a), int(y - i), int(a * 2), c)

    def _draw_heart(self, cx, cy, size=12, col=1):
        d = self._disp()
        if not d: return
        # Draw heart using two circles and a bottom triangle
        hr = max(3, size // 3)
        self._circle(cx - hr, cy - hr // 2, hr, col)
        self._circle(cx + hr, cy - hr // 2, hr, col)
        for i in range(size):
            span = max(1, (size - i) * 2)
            d.hline(int(cx - span // 2), int(cy + i), int(span), col)

    def _draw_eye(self, cx, cy, w, h, r, mood="NORMAL", look="CENTER", is_left=True):
        d = self._disp()
        if not d: return
        x = int(cx - w // 2)
        y = int(cy - h // 2)

        if mood == "DEAD":
            # Bold X mark
            for t in range(-1, 2):
                d.line(int(x), int(y + t), int(x + w), int(y + h + t), 1)
                d.line(int(x + w), int(y + t), int(x), int(y + h + t), 1)
            return

        if mood == "LOVE":
            self._draw_heart(cx, cy, size=min(14, h // 2))
            return

        if mood == "SLEEP":
            d.hline(int(x), int(cy), int(w), 1)
            d.hline(int(x), int(cy + 1), int(w), 1)
            d.hline(int(x + 2), int(cy + 2), int(w - 4), 1)
            if not is_left:
                d.text("z", int(cx + w // 2 + 4), int(cy - 14), 1)
                d.text("Z", int(cx + w // 2 + 12), int(cy - 22), 1)
            return

        if mood == "DIZZY":
            # Concentric spiral boxes
            d.rect(int(x), int(y), int(w), int(h), 1)
            d.rect(int(x + 4), int(y + 4), int(max(4, w - 8)), int(max(4, h - 8)), 1)
            d.rect(int(x + 8), int(y + 8), int(max(2, w - 16)), int(max(2, h - 16)), 1)
            d.fill_rect(int(cx - 2), int(cy - 2), 4, 4, 1)
            return

        if mood == "HAPPY":
            # Smiling crescent arch ^ ^
            self._round_rect(x, y, w, h, r, 1)
            d.fill_rect(int(x - 2), int(cy), int(w + 4), int(h // 2 + 4), 0)
            d.line(int(x), int(cy), int(x + w // 2), int(y + 2), 1)
            d.line(int(x + w // 2), int(y + 2), int(x + w), int(cy), 1)
            d.line(int(x), int(cy + 1), int(x + w // 2), int(y + 3), 1)
            d.line(int(x + w // 2), int(y + 3), int(x + w), int(cy + 1), 1)
            return

        if mood == "THINKING":
            if is_left:
                # Left eye squinted
                self._round_rect(x, cy + 2, w, max(6, h // 3), 2, 1)
            else:
                # Right eye wide looking up-right
                self._round_rect(x, y - 4, w, h, r, 1)
                # Pupil shifted top-right
                self._circle(cx + 4, cy - 8, 4, 0)
                d.text("?", int(cx + w // 2 + 6), int(cy - 18), 1)
            return

        if mood == "CURIOUS":
            if is_left:
                # Enlarged inquisitive eye
                self._round_rect(x - 3, y - 4, w + 6, h + 8, r + 2, 1)
                self._circle(cx + 2, cy - 2, 4, 0)
            else:
                # Smaller tilted eye
                self._round_rect(x + 2, y + 4, max(8, w - 4), max(8, h - 8), max(2, r - 2), 1)
            return

        if mood == "CRYING":
            self._round_rect(x, y, w, h, r, 1)
            # Drooping brow
            for i in range(h // 3):
                if is_left: d.line(int(x + (i * 2)), int(y), int(x + w), int(y + i), 0)
                else: d.line(int(x), int(y + i), int(x + w - (i * 2)), int(y), 0)
            # Falling tear
            d.fill_rect(int(cx - 2), int(cy + h // 2 + 2), 4, 8, 1)
            d.pixel(int(cx), int(cy + h // 2 + 11), 1)
            return

        if mood == "DEVIL":
            self._round_rect(x, y, w, h, r, 1)
            # Angry brow
            for i in range(h // 2):
                if is_left: d.line(int(x), int(y + i), int(x + w - (i * 2)), int(y), 0)
                else: d.line(int(x + (i * 2)), int(y), int(x + w), int(y + i), 0)
            # Devil Horn
            if is_left:
                d.line(int(x + 2), int(y), int(x - 4), int(y - 8), 1)
                d.line(int(x + 8), int(y), int(x - 4), int(y - 8), 1)
            else:
                d.line(int(x + w - 2), int(y), int(x + w + 4), int(y - 8), 1)
                d.line(int(x + w - 8), int(y), int(x + w + 4), int(y - 8), 1)
            return

        # Default / Normal base
        self._round_rect(x, y, w, h, r, 1)

        if mood == "ANGRY":
            for i in range(h // 2):
                if is_left: d.line(int(x), int(y + i), int(x + w - (i * 2)), int(y), 0)
                else: d.line(int(x + (i * 2)), int(y), int(x + w), int(y + i), 0)
        elif mood == "SAD":
            for i in range(h // 2):
                if is_left: d.line(int(x + (i * 2)), int(y), int(x + w), int(y + i), 0)
                else: d.line(int(x), int(y + i), int(x + w - (i * 2)), int(y), 0)

    def show(self, mood="NORMAL", look="CENTER", w=None, h=None, r=None, ox=0, oy=0):
        d = self._disp()
        if not d: return
        w = w if w is not None else self.w
        h = h if h is not None else self.h
        r = r if r is not None else self.r
        dx, dy = 0, 0
        if look == "LEFT": dx = -14
        elif look == "RIGHT": dx = 14
        elif look == "UP": dy = -8
        elif look == "DOWN": dy = 8
        elif look == "TOP_LEFT": dx, dy = -10, -6
        elif look == "TOP_RIGHT": dx, dy = 10, -6
        elif look == "BOTTOM_LEFT": dx, dy = -10, 6
        elif look == "BOTTOM_RIGHT": dx, dy = 10, 6
        
        lx = (self.cx - self.gap // 2 - w // 2) + dx + ox
        rx = (self.cx + self.gap // 2 + w // 2) + dx + ox
        cy = self.cy + dy + oy

        d.fill(0)
        if mood == "WINK_LEFT":
            self._draw_eye(lx, cy, w, h, r, "SLEEP", look, is_left=True)
            self._draw_eye(rx, cy, w, h, r, "NORMAL", look, is_left=False)
        elif mood == "WINK_RIGHT":
            self._draw_eye(lx, cy, w, h, r, "NORMAL", look, is_left=True)
            self._draw_eye(rx, cy, w, h, r, "SLEEP", look, is_left=False)
        elif mood == "SQUINT":
            self._draw_eye(lx, cy, w, max(6, h // 3), 2, "NORMAL", look, is_left=True)
            self._draw_eye(rx, cy, w, max(6, h // 3), 2, "NORMAL", look, is_left=False)
        elif mood == "SURPRISED":
            self._draw_eye(lx, cy, w + 6, h + 8, r + 4, "NORMAL", look, is_left=True)
            self._draw_eye(rx, cy, w + 6, h + 8, r + 4, "NORMAL", look, is_left=False)
            self._circle(lx, cy, 3, 0)
            self._circle(rx, cy, 3, 0)
        else:
            self._draw_eye(lx, cy, w, h, r, mood, look, is_left=True)
            self._draw_eye(rx, cy, w, h, r, mood, look, is_left=False)
        d.show()

    def animate(self, anim="BLINK", mood="NORMAL", look="CENTER", speed_ms=30):
        d = self._disp()
        if not d: return
        if anim == "BLINK":
            for sh in [self.h, self.h * 2 // 3, self.h // 3, 2, self.h // 3, self.h * 2 // 3, self.h]:
                self.show(mood=mood, look=look, h=max(2, int(sh)), r=min(self.r, max(1, int(sh) // 3)))
                time.sleep_ms(speed_ms)
        elif anim == "DOUBLE_BLINK":
            for _ in range(2):
                for sh in [self.h, self.h // 3, 2, self.h // 3, self.h]:
                    self.show(mood=mood, look=look, h=max(2, int(sh)))
                    time.sleep_ms(speed_ms)
                time.sleep_ms(speed_ms * 2)
        elif anim == "LOOK_AROUND":
            for lk in ["CENTER", "LEFT", "TOP_LEFT", "UP", "TOP_RIGHT", "RIGHT", "CENTER"]:
                self.show(mood=mood, look=lk)
                time.sleep_ms(max(100, speed_ms * 4))
        elif anim == "WINK":
            self.show(mood="WINK_LEFT", look=look)
            time.sleep_ms(max(150, speed_ms * 6))
            self.show(mood="NORMAL", look=look)
        elif anim == "WAKEUP":
            for sh in [2, 6, 12, 20, self.h]:
                self.show(mood="NORMAL", look=look, h=int(sh))
                time.sleep_ms(speed_ms * 2)
        elif anim == "FALL_ASLEEP":
            for sh in [self.h, 20, 12, 6, 2]:
                self.show(mood="NORMAL", look=look, h=int(sh))
                time.sleep_ms(speed_ms * 2)
            self.show(mood="SLEEP", look=look)
        elif anim == "HAPPY_BOUNCE":
            for oy in [0, -6, 0, -4, 0, -2, 0]:
                self.show(mood="HAPPY", look=look, oy=oy)
                time.sleep_ms(speed_ms * 2)
        elif anim == "ANGRY_SHAKE":
            for ox in [0, -4, 4, -3, 3, -1, 1, 0]:
                self.show(mood="ANGRY", look=look, ox=ox)
                time.sleep_ms(speed_ms)
        elif anim == "DIZZY_SPIN":
            for ang in range(4):
                self.show(mood="DIZZY", ox=(ang % 2) * 2, oy=((ang + 1) % 2) * 2)
                time.sleep_ms(speed_ms * 3)
        elif anim == "CURIOUS_TILT":
            self.show(mood="CURIOUS")
            time.sleep_ms(speed_ms * 8)
            self.show(mood="NORMAL")
        elif anim == "ROLL":
            self.spidermaf_look("ROLL")

    def draw_spidermaf_eyes(self, plh=0, prh=0, plv=0, eye_r=16, pupil_r=7, exl=38, exr=90, ey=32):
        d = self._disp()
        if not d: return
        d.fill(0)
        self._circle(exl, ey, eye_r, 1)
        self._circle(exr, ey, eye_r, 1)
        self._circle(exl + plh, ey + plv, pupil_r, 0)
        self._circle(exr + prh, ey + plv, pupil_r, 0)
        d.show()

    def spidermaf_look(self, direction="CENTER", eye_r=16, pupil_r=7):
        d = self._disp()
        if not d: return
        max_h = max(2, eye_r - pupil_r - 2)
        max_v = max(2, eye_r - pupil_r - 2)
        if direction == "CENTER":
            self.draw_spidermaf_eyes(0, 0, 0, eye_r, pupil_r)
        elif direction == "LEFT":
            self.draw_spidermaf_eyes(-max_h, -max_h, 0, eye_r, pupil_r)
        elif direction == "RIGHT":
            self.draw_spidermaf_eyes(max_h, max_h, 0, eye_r, pupil_r)
        elif direction == "UP":
            self.draw_spidermaf_eyes(0, 0, -max_v, eye_r, pupil_r)
        elif direction == "DOWN":
            self.draw_spidermaf_eyes(0, 0, max_v, eye_r, pupil_r)
        elif direction == "TOP_LEFT":
            self.draw_spidermaf_eyes(-max_h + 1, -max_h + 1, -max_v + 1, eye_r, pupil_r)
        elif direction == "TOP_RIGHT":
            self.draw_spidermaf_eyes(max_h - 1, max_h - 1, -max_v + 1, eye_r, pupil_r)
        elif direction == "BOTTOM_LEFT":
            self.draw_spidermaf_eyes(-max_h + 1, -max_h + 1, max_v - 1, eye_r, pupil_r)
        elif direction == "BOTTOM_RIGHT":
            self.draw_spidermaf_eyes(max_h - 1, max_h - 1, max_v - 1, eye_r, pupil_r)
        elif direction == "ROLL":
            for d_name in ["CENTER", "LEFT", "TOP_LEFT", "UP", "TOP_RIGHT", "RIGHT", "BOTTOM_RIGHT", "DOWN", "BOTTOM_LEFT", "CENTER"]:
                self.spidermaf_look(d_name, eye_r, pupil_r)
                time.sleep_ms(80)
        elif direction == "LOOK_LEFT":
            self.spidermaf_look("LEFT", eye_r, pupil_r)
            time.sleep_ms(300)
            self.spidermaf_look("CENTER", eye_r, pupil_r)
        elif direction == "LOOK_RIGHT":
            self.spidermaf_look("RIGHT", eye_r, pupil_r)
            time.sleep_ms(300)
            self.spidermaf_look("CENTER", eye_r, pupil_r)
        elif direction == "LOOK_UP":
            self.spidermaf_look("UP", eye_r, pupil_r)
            time.sleep_ms(300)
            self.spidermaf_look("CENTER", eye_r, pupil_r)
        elif direction == "LOOK_DOWN":
            self.spidermaf_look("DOWN", eye_r, pupil_r)
            time.sleep_ms(300)
            self.spidermaf_look("CENTER", eye_r, pupil_r)
        elif direction == "RANDOM":
            dirs = ["CENTER", "LEFT", "RIGHT", "UP", "DOWN", "TOP_LEFT", "TOP_RIGHT"]
            chosen = dirs[random.randint(0, len(dirs) - 1)]
            self.spidermaf_look(chosen, eye_r, pupil_r)

robot_eyes = _RobotEyes()
`;

    Blockly.Blocks['esp32_eyes_expression'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("👀 Robot Eyes Mood")
                .appendField(new Blockly.FieldDropdown([
                    ["Normal 😊", "NORMAL"],
                    ["Happy ^ ^", "HAPPY"],
                    ["Angry > <", "ANGRY"],
                    ["Sad / \\", "SAD"],
                    ["Thinking 🤔", "THINKING"],
                    ["Curious 🧐", "CURIOUS"],
                    ["Surprised 😲", "SURPRISED"],
                    ["Squint 😑", "SQUINT"],
                    ["Sleep - -", "SLEEP"],
                    ["Wink Left 😉", "WINK_LEFT"],
                    ["Wink Right 😉", "WINK_RIGHT"],
                    ["Love ❤️", "LOVE"],
                    ["Dizzy 😵 @ @", "DIZZY"],
                    ["Crying 😢", "CRYING"],
                    ["Devil 😈", "DEVIL"],
                    ["KO / Dead ✕ ✕", "DEAD"]
                ]), "MOOD")
                .appendField("Look")
                .appendField(new Blockly.FieldDropdown([
                    ["Center ⏺", "CENTER"],
                    ["Left ◀", "LEFT"],
                    ["Right ▶", "RIGHT"],
                    ["Up ▲", "UP"],
                    ["Down ▼", "DOWN"],
                    ["Top-Left ◤", "TOP_LEFT"],
                    ["Top-Right ◥", "TOP_RIGHT"],
                    ["Bottom-Left ◣", "BOTTOM_LEFT"],
                    ["Bottom-Right ◢", "BOTTOM_RIGHT"]
                ]), "LOOK");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#D65CD6');
            this.setTooltip("Display expressive robotic eyes on OLED display");
        }
    };

    pythonGenerator.forBlock['esp32_eyes_expression'] = function (block) {
        const mood = block.getFieldValue('MOOD');
        const look = block.getFieldValue('LOOK');
        pythonGenerator.definitions_['drv_robot_eyes'] = ROBOT_EYES_ENGINE;
        return `robot_eyes.show(mood="${mood}", look="${look}")\n`;
    };

    Blockly.Blocks['esp32_eyes_animate'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("👀 Animate Eyes")
                .appendField(new Blockly.FieldDropdown([
                    ["Blink Sequence", "BLINK"],
                    ["Double Blink", "DOUBLE_BLINK"],
                    ["Look Around", "LOOK_AROUND"],
                    ["Quick Wink", "WINK"],
                    ["Wake Up", "WAKEUP"],
                    ["Fall Asleep", "FALL_ASLEEP"],
                    ["Happy Bounce", "HAPPY_BOUNCE"],
                    ["Angry Shake", "ANGRY_SHAKE"],
                    ["Dizzy Spin", "DIZZY_SPIN"],
                    ["Curious Tilt", "CURIOUS_TILT"],
                    ["Roll Eyes 360", "ROLL"]
                ]), "ANIM")
                .appendField("Speed")
                .appendField(new Blockly.FieldDropdown([
                    ["Fast (20ms)", "20"],
                    ["Normal (35ms)", "35"],
                    ["Slow (60ms)", "60"]
                ]), "SPEED");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#D65CD6');
            this.setTooltip("Play smooth procedural eye animation sequence");
        }
    };

    pythonGenerator.forBlock['esp32_eyes_animate'] = function (block) {
        const anim = block.getFieldValue('ANIM');
        const speed = block.getFieldValue('SPEED') || '35';
        pythonGenerator.definitions_['drv_robot_eyes'] = ROBOT_EYES_ENGINE;
        return `robot_eyes.animate("${anim}", speed_ms=${speed})\n`;
    };

    Blockly.Blocks['esp32_eyes_custom'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("👀 Custom Eyes Width")
                .appendField(new Blockly.FieldNumber(26, 8, 48, 1), "W")
                .appendField("Height")
                .appendField(new Blockly.FieldNumber(34, 4, 56, 1), "H")
                .appendField("Radius")
                .appendField(new Blockly.FieldNumber(6, 0, 20, 1), "R")
                .appendField("Offset X")
                .appendField(new Blockly.FieldNumber(0, -30, 30, 1), "OX")
                .appendField("Y")
                .appendField(new Blockly.FieldNumber(0, -20, 20, 1), "OY");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#D65CD6');
            this.setTooltip("Design custom robotic eyes geometry");
        }
    };

    pythonGenerator.forBlock['esp32_eyes_custom'] = function (block) {
        const w = block.getFieldValue('W');
        const h = block.getFieldValue('H');
        const r = block.getFieldValue('R');
        const ox = block.getFieldValue('OX');
        const oy = block.getFieldValue('OY');
        pythonGenerator.definitions_['drv_robot_eyes'] = ROBOT_EYES_ENGINE;
        return `robot_eyes.show(mood="NORMAL", w=${w}, h=${h}, r=${r}, ox=${ox}, oy=${oy})\n`;
    };

    Blockly.Blocks['esp32_spidermaf_eyes'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("👁️ SpiderMaf Eyes Look")
                .appendField(new Blockly.FieldDropdown([
                    ["Center ⏺", "CENTER"],
                    ["Left ◀", "LEFT"],
                    ["Right ▶", "RIGHT"],
                    ["Up ▲", "UP"],
                    ["Down ▼", "DOWN"],
                    ["Top-Left ◤", "TOP_LEFT"],
                    ["Top-Right ◥", "TOP_RIGHT"],
                    ["Bottom-Left ◣", "BOTTOM_LEFT"],
                    ["Bottom-Right ◢", "BOTTOM_RIGHT"],
                    ["Roll Eyes 🔄", "ROLL"],
                    ["Glance Left & Back ◀", "LOOK_LEFT"],
                    ["Glance Right & Back ▶", "LOOK_RIGHT"],
                    ["Glance Up & Back ▲", "LOOK_UP"],
                    ["Glance Down & Back ▼", "LOOK_DOWN"],
                    ["Random Gaze 🎲", "RANDOM"]
                ]), "DIR")
                .appendField("Size")
                .appendField(new Blockly.FieldDropdown([
                    ["Normal (R=16, Pupil=7)", "16,7"],
                    ["Large (R=20, Pupil=9)", "20,9"],
                    ["Small (R=12, Pupil=5)", "12,5"]
                ]), "SIZE");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#A855F7');
            this.setTooltip("SpiderMaf OLED animated eyes with circular iris and moving black pupils");
        }
    };

    pythonGenerator.forBlock['esp32_spidermaf_eyes'] = function (block) {
        const dir = block.getFieldValue('DIR');
        const [eyeR, pupilR] = (block.getFieldValue('SIZE') || "16,7").split(',');
        pythonGenerator.definitions_['drv_robot_eyes'] = ROBOT_EYES_ENGINE;
        return `robot_eyes.spidermaf_look("${dir}", eye_r=${eyeR}, pupil_r=${pupilR})\n`;
    };

    Blockly.Blocks['esp32_spidermaf_custom'] = {
        init: function () {
            this.appendDummyInput()
                .appendField("👁️ SpiderMaf Custom: Eye Radius")
                .appendField(new Blockly.FieldNumber(16, 6, 24, 1), "EYE_R")
                .appendField("Pupil Radius")
                .appendField(new Blockly.FieldNumber(7, 2, 14, 1), "PUPIL_R")
                .appendField("Pupil Offset X")
                .appendField(new Blockly.FieldNumber(0, -12, 12, 1), "OX")
                .appendField("Y")
                .appendField(new Blockly.FieldNumber(0, -12, 12, 1), "OY");
            this.setInputsInline(true);
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#A855F7');
            this.setTooltip("Custom SpiderMaf eyes with precise pupil offset positions");
        }
    };

    pythonGenerator.forBlock['esp32_spidermaf_custom'] = function (block) {
        const eyeR = block.getFieldValue('EYE_R');
        const pupilR = block.getFieldValue('PUPIL_R');
        const ox = block.getFieldValue('OX');
        const oy = block.getFieldValue('OY');
        pythonGenerator.definitions_['drv_robot_eyes'] = ROBOT_EYES_ENGINE;
        return `robot_eyes.draw_spidermaf_eyes(plh=${ox}, prh=${ox}, plv=${oy}, eye_r=${eyeR}, pupil_r=${pupilR})\n`;
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
    const loopBlocks = ['controls_repeat_ext', 'controls_whileUntil', 'controls_for', 'controls_forEach', 'controls_flow_statements'];
    loopBlocks.forEach(type => {
        if (Blockly.Blocks[type]) {
            const oldInit = Blockly.Blocks[type].init;
            Blockly.Blocks[type].init = function() {
                oldInit.call(this);
                this.setColour('#59C059');
            };
        }
    });

    // Control & Logic blocks to Blue (#4C97FF)
    const blueBlocks = ['controls_if', 'controls_ifelse', 'logic_compare', 'logic_operation', 'logic_negate', 'logic_boolean', 'logic_null', 'logic_ternary'];
    blueBlocks.forEach(type => {
        if (Blockly.Blocks[type]) {
            const oldInit = Blockly.Blocks[type].init;
            Blockly.Blocks[type].init = function() {
                oldInit.call(this);
                this.setColour('#4C97FF');
            };
        }
    });

    // Math blocks to Green (#59C059)
    const mathBlocks = ['math_number', 'math_arithmetic', 'math_single', 'math_trig', 'math_constant', 'math_number_property', 'math_change', 'math_round', 'math_on_list', 'math_modulo', 'math_constrain', 'math_random_int', 'math_random_float', 'math_atan2'];
    mathBlocks.forEach(type => {
        if (Blockly.Blocks[type]) {
            const oldInit = Blockly.Blocks[type].init;
            Blockly.Blocks[type].init = function() {
                oldInit.call(this);
                this.setColour('#59C059');
            };
        }
    });

    // Text blocks to Purple (#9333EA)
    const textBlocks = ['text', 'text_join', 'text_append', 'text_length', 'text_isEmpty', 'text_indexOf', 'text_charAt', 'text_getSubstring', 'text_changeCase', 'text_trim', 'text_print', 'text_count', 'text_replace', 'text_reverse'];
    textBlocks.forEach(type => {
        if (Blockly.Blocks[type]) {
            const oldInit = Blockly.Blocks[type].init;
            Blockly.Blocks[type].init = function() {
                oldInit.call(this);
                this.setColour('#9333EA');
            };
        }
    });

    // Lists blocks to Orange (#EA580C)
    const listBlocks = ['lists_create_with', 'lists_create_empty', 'lists_repeat', 'lists_length', 'lists_isEmpty', 'lists_indexOf', 'lists_getIndex', 'lists_setIndex', 'lists_getSublist', 'lists_split', 'lists_sort', 'lists_reverse'];
    listBlocks.forEach(type => {
        if (Blockly.Blocks[type]) {
            const oldInit = Blockly.Blocks[type].init;
            Blockly.Blocks[type].init = function() {
                oldInit.call(this);
                this.setColour('#EA580C');
            };
        }
    });

    // Procedures / Functions blocks to Purple (#A855F7)
    const procBlocks = ['procedures_defnoreturn', 'procedures_defreturn', 'procedures_ifreturn', 'procedures_callnoreturn', 'procedures_callreturn'];
    procBlocks.forEach(type => {
        if (Blockly.Blocks[type]) {
            const oldInit = Blockly.Blocks[type].init;
            Blockly.Blocks[type].init = function() {
                oldInit.call(this);
                this.setColour('#A855F7');
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
        if (!branch || branch.trim() === '') {
            branch = '    ten.delay(10)\n';
        } else if (!branch.includes('ten.delay') && !branch.includes('time.sleep')) {
            branch = branch + '    ten.delay(2)\n';
        }
        return `while ${condition} and ten.is_running():\n${branch}`;
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
        if (!branch || branch.trim() === '') {
            branch = '    ten.delay(10)\n';
        } else if (!branch.includes('ten.delay') && !branch.includes('time.sleep')) {
            branch = branch + '    ten.delay(2)\n';
        }
        const varType = Blockly.Names?.NameType?.VARIABLE || 'VARIABLE';
        const loopVar = pythonGenerator.nameDB_ ? pythonGenerator.nameDB_.getDistinctName('count', varType) : 'count';
        return `for ${loopVar} in range(${repeats}):\n    if not ten.is_running(): break\n${branch}`;
    };

    pythonGenerator.forBlock['controls_for'] = function (block) {
        const varType = Blockly.Names?.NameType?.VARIABLE || 'VARIABLE';
        const varField = block.getFieldValue('VAR');
        const variable = pythonGenerator.nameDB_ ? pythonGenerator.nameDB_.getName(varField, varType) : (varField || 'i');
        const from = pythonGenerator.valueToCode(block, 'FROM', pythonGenerator.ORDER_NONE) || '0';
        const to = pythonGenerator.valueToCode(block, 'TO', pythonGenerator.ORDER_NONE) || '0';
        const step = pythonGenerator.valueToCode(block, 'BY', pythonGenerator.ORDER_NONE) || '1';
        let branch = pythonGenerator.statementToCode(block, 'DO');
        if (!branch || branch.trim() === '') {
            branch = '    ten.delay(10)\n';
        } else if (!branch.includes('ten.delay') && !branch.includes('time.sleep')) {
            branch = branch + '    ten.delay(2)\n';
        }
        return `for ${variable} in range(int(${from}), int(${to}) + 1, int(${step})):\n    if not ten.is_running(): break\n${branch}`;
    };

    pythonGenerator.forBlock['controls_forEach'] = function (block) {
        const varType = Blockly.Names?.NameType?.VARIABLE || 'VARIABLE';
        const varField = block.getFieldValue('VAR');
        const variable = pythonGenerator.nameDB_ ? pythonGenerator.nameDB_.getName(varField, varType) : (varField || 'item');
        const list = pythonGenerator.valueToCode(block, 'LIST', pythonGenerator.ORDER_RELATIONAL) || '[]';
        let branch = pythonGenerator.statementToCode(block, 'DO');
        if (!branch || branch.trim() === '') {
            branch = '    ten.delay(10)\n';
        } else if (!branch.includes('ten.delay') && !branch.includes('time.sleep')) {
            branch = branch + '    ten.delay(2)\n';
        }
        return `for ${variable} in ${list}:\n    if not ten.is_running(): break\n${branch}`;
    };

    // --- ESP32 / ARDUINO MAP RANGE BLOCK ---
    Blockly.Blocks['esp32_map'] = {
        init: function () {
            this.appendValueInput("VAL")
                .setCheck("Number")
                .appendField("Map");
            this.appendValueInput("FROM_LOW")
                .setCheck("Number")
                .appendField("from");
            this.appendValueInput("FROM_HIGH")
                .setCheck("Number")
                .appendField("..");
            this.appendValueInput("TO_LOW")
                .setCheck("Number")
                .appendField("to");
            this.appendValueInput("TO_HIGH")
                .setCheck("Number")
                .appendField("..");
            this.setInputsInline(true);
            this.setOutput(true, "Number");
            this.setColour('#59C059');
            this.setTooltip("Map a number from one range to another range (e.g. 0-4095 to 0-100)");
        }
    };

    pythonGenerator.forBlock['esp32_map'] = function (block) {
        const val = pythonGenerator.valueToCode(block, 'VAL', pythonGenerator.ORDER_NONE) || '0';
        const fl = pythonGenerator.valueToCode(block, 'FROM_LOW', pythonGenerator.ORDER_NONE) || '0';
        const fh = pythonGenerator.valueToCode(block, 'FROM_HIGH', pythonGenerator.ORDER_NONE) || '4095';
        const tl = pythonGenerator.valueToCode(block, 'TO_LOW', pythonGenerator.ORDER_NONE) || '0';
        const th = pythonGenerator.valueToCode(block, 'TO_HIGH', pythonGenerator.ORDER_NONE) || '100';
        pythonGenerator.definitions_['helper_map_range'] = 
            `def _map_range(x, in_min, in_max, out_min, out_max):\n` +
            `    if in_max == in_min: return out_min\n` +
            `    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min\n`;
        return [`_map_range(${val}, ${fl}, ${fh}, ${tl}, ${th})`, pythonGenerator.ORDER_FUNCTION_CALL];
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
