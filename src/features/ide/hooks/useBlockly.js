import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import { defineCustomBlocks } from '../services/customBlocks';

export const useBlockly = (project) => {
    const blocklyDiv = useRef(null);
    const workspace = useRef(null);
    const [pythonCode, setPythonCode] = useState('');

    useEffect(() => {
        if (!blocklyDiv.current) return;

        defineCustomBlocks();

        workspace.current = Blockly.inject(blocklyDiv.current, {
            toolbox: {
                kind: 'categoryToolbox',
                contents: [
                    {
                        kind: 'category',
                        name: 'MOTION',
                        colour: '#4C97FF',
                        contents: [
                            { kind: 'block', type: 'esp32_motor', inputs: { SPEED: { shadow: { type: 'ten_number_100', fields: { NUM: 100 } } } } },
                            { kind: 'block', type: 'esp32_output', inputs: { SPEED: { shadow: { type: 'ten_number_100', fields: { NUM: 100 } } } } },
                            { kind: 'block', type: 'esp32_servo', inputs: { ANGLE: { shadow: { type: 'math_number', fields: { NUM: 90 } } } } },
                            { kind: 'block', type: 'esp32_servo_center' },
                            { kind: 'block', type: 'esp32_servo_sweep', inputs: { START: { shadow: { type: 'math_number', fields: { NUM: 0 } } }, END: { shadow: { type: 'math_number', fields: { NUM: 180 } } } } },
                            { kind: 'block', type: 'esp32_servo_step', inputs: { DELTA: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                            { kind: 'block', type: 'esp32_servo_360', inputs: { SPEED: { shadow: { type: 'ten_number_100', fields: { NUM: 50 } } } } },
                            { kind: 'block', type: 'esp32_stepper', inputs: { STEPS: { shadow: { type: 'math_number', fields: { NUM: 200 } } } } },
                            { kind: 'block', type: 'esp32_stepper_degrees', inputs: { DEGREES: { shadow: { type: 'math_number', fields: { NUM: 360 } } } } },
                            { kind: 'block', type: 'esp32_stepper_stop' },
                            { kind: 'block', type: 'esp32_digital_write' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'LOOPS',
                        colour: '#59C059',
                        contents: [
                            { kind: 'block', type: 'controls_repeat_ext', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                            { kind: 'block', type: 'controls_whileUntil' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'CONTROL',
                        colour: '#4C97FF',
                        contents: [
                            { kind: 'block', type: 'controls_if' },
                            { kind: 'block', type: 'logic_compare' },
                            { kind: 'block', type: 'ten_number_100', fields: { NUM: 50 } },
                            { kind: 'block', type: 'logic_operation' },
                            { kind: 'block', type: 'logic_negate' },
                            { kind: 'block', type: 'logic_boolean' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'TIME',
                        colour: '#FFAB19',
                        contents: [
                            { kind: 'block', type: 'wait_seconds', inputs: { SECONDS: { shadow: { type: 'math_number', fields: { NUM: 1 } } } } },
                            { kind: 'block', type: 'wait_ms', inputs: { MS: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
                            { kind: 'block', type: 'esp32_get_uptime' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'SENSORS',
                        colour: '#4CBFE6',
                        contents: [
                            { kind: 'block', type: 'esp32_sensor_read' },
                            { kind: 'block', type: 'esp32_ultrasonic_read' },
                            { kind: 'block', type: 'esp32_i2c_read' },
                            { kind: 'block', type: 'esp32_i2c_write', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
                            { kind: 'block', type: 'esp32_i2c_scan' },
                            { kind: 'block', type: 'esp32_i2c_mpu6050' },
                            { kind: 'block', type: 'esp32_i2c_temp' },
                            {
                                kind: 'block',
                                type: 'esp32_broadcast',
                                inputs: {
                                    VAL: { shadow: { type: 'ten_number_100', fields: { NUM: 0 } } }
                                }
                            },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'EYES',
                        colour: '#33CABD',
                        contents: [
                             { kind: 'block', type: 'esp32_eyes_blink' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'EMOJI',
                        colour: '#D65CD6',
                        contents: [
                             { kind: 'block', type: 'esp32_oled_emoji' },
                        ],
                    },
                     {
                        kind: 'category',
                        name: 'DISPLAY',
                        colour: '#475569',
                        contents: [
                             { kind: 'block', type: 'esp32_oled_sensor_full' },
                             { kind: 'block', type: 'esp32_oled_sensor_view' },
                             { kind: 'block', type: 'esp32_oled_print', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello' } } }, LINE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
                             { kind: 'block', type: 'esp32_oled_clear' },
                             { kind: 'block', type: 'esp32_get_battery' },
                             { kind: 'block', type: 'esp32_get_voltage' },
                             { kind: 'block', type: 'esp32_get_current' },
                             { kind: 'block', type: 'esp32_get_power' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'MATH',
                        colour: '#59C059',
                        contents: [
                            { kind: 'block', type: 'math_number' },
                            { kind: 'block', type: 'math_arithmetic' },
                            { kind: 'block', type: 'math_single' },
                            { kind: 'block', type: 'math_trig' },
                            { kind: 'block', type: 'math_constant' },
                            { kind: 'block', type: 'math_round' },
                            { kind: 'block', type: 'math_modulo' },
                            { kind: 'block', type: 'math_random_int', inputs: { FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, TO: { shadow: { type: 'math_number', fields: { NUM: 100 } } } } },
                            { kind: 'block', type: 'math_random_float' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'VARIABLES',
                        colour: '#FF6680',
                        custom: 'VARIABLE'
                    },
                ],
            },
            theme: Blockly.Theme.defineTheme('ten_blocks', {
                'base': Blockly.Themes.Classic,
                'blockStyles': {
                    'motion_blocks': { 'colourPrimary': '#4C97FF', 'colourSecondary': '#3373CC', 'colourTertiary': '#3373CC' },
                    'event_blocks': { 'colourPrimary': '#FFD500', 'colourSecondary': '#CCAA00', 'colourTertiary': '#CCAA00' },
                    'control_blocks': { 'colourPrimary': '#FFAB19', 'colourSecondary': '#CF8B17', 'colourTertiary': '#CF8B17' },
                    'sensor_blocks': { 'colourPrimary': '#4CBFE6', 'colourSecondary': '#2E8EB8', 'colourTertiary': '#2E8EB8' },
                    'sound_blocks': { 'colourPrimary': '#D65CD6', 'colourSecondary': '#BD42BD', 'colourTertiary': '#BD42BD' },
                    'math_blocks': { 'colourPrimary': '#59C059', 'colourSecondary': '#389438', 'colourTertiary': '#389438' },
                    'variable_blocks': { 'colourPrimary': '#FF6680', 'colourSecondary': '#FF3355', 'colourTertiary': '#FF3355' },
                },
                'categoryStyles': {
                    'motion_category': { 'colour': '#4C97FF' },
                    'events_category': { 'colour': '#FFD500' },
                    'control_category': { 'colour': '#FFAB19' },
                    'sensors_category': { 'colour': '#4CBFE6' },
                    'sound_category': { 'colour': '#D65CD6' },
                    'math_category': { 'colour': '#59C059' },
                    'variable_category': { 'colour': '#FF6680' },
                },
                'componentStyles': {
                    'workspaceBackgroundColour': '#ffffff',
                    'toolboxBackgroundColour': '#f0f0f0',
                    'toolboxForegroundColour': '#333',
                    'flyoutBackgroundColour': '#ffffff',
                    'flyoutForegroundColour': '#666',
                    'flyoutOpacity': 0.9,
                    'scrollbarColour': '#ccc',
                    'insertionMarkerColour': '#000',
                    'insertionMarkerOpacity': 0.3,
                },
                'fontStyle': {
                    'family': 'Outfit, sans-serif',
                    'weight': 'bold',
                    'size': 12
                }
            }),
            grid: { spacing: 25, length: 3, colour: '#eee', snap: true },
            trashcan: true,
            zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
            move: { scrollbars: true, drag: true, wheel: true }
        });

        // Reposition Trashcan - Move it above the zoom buttons
        setTimeout(() => {
            if (workspace.current) {
                // In modern Blockly, we can try to nudge the component via its internal spacing
                const trashcan = workspace.current.getComponentManager()?.getComponent('trashcan');
                if (trashcan) {
                    // Nudge it up (default is 20)
                    trashcan.verticalSpacing_ = 110;
                    trashcan.position();
                } else if (workspace.current.trashcan) {
                    // Fallback for older versions or different configurations
                    workspace.current.trashcan.verticalSpacing_ = 110;
                    workspace.current.trashcan.position();
                }
            }
        }, 300);

        if (project?.blocks) {
            try {
                Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(project.blocks), workspace.current);
            } catch (e) {
                console.error('Error loading blocks', e);
            }
        } else {
            // Default workspace: a single Sketch block
            const defaultXml = '<xml><block type="robot_sketch" x="50" y="50"></block></xml>';
            Blockly.Xml.domToWorkspace(Blockly.utils.xml.textToDom(defaultXml), workspace.current);
        }

        const generateCode = () => {
            if (!workspace.current) return;

            // 1. Initialize generator
            pythonGenerator.init(workspace.current);
            
            const allTopBlocks = workspace.current.getTopBlocks(true);
            const sketchBlock = allTopBlocks.find(b => b.type === 'robot_sketch');
            
            let codeArr = [];
            if (sketchBlock) {
                // Generate code for everything connected after the sketch block
                const nextBlock = sketchBlock.getNextBlock();
                if (nextBlock) {
                    let line = pythonGenerator.blockToCode(nextBlock);
                    if (Array.isArray(line)) line = line[0];
                    if (line) codeArr.push(line);
                }
            }
            let rawBody = codeArr.join('\n');
            
            // 3. Extract definitions collected during blockToCode calls
            const definitionsArr = Object.values(pythonGenerator.definitions_ || {});
            const definitions = definitionsArr.join('\n');
            
            // 4. Reset definitions to avoid duplication if generator is used elsewhere
            pythonGenerator.definitions_ = Object.create(null);
            
            // 5. Build final code structure
            const needsOLED = rawBody.includes('ten.display.') || rawBody.includes('eyes_v2');
            
            let code = `import machine, time, ten, gc\n\n`;
            if (definitions) {
                code += `# --- HARDWARE ---\n${definitions}\n\n`;
            }
            
            code += `def run():\n`;
            code += `    gc.collect() # Initial cleanup\n`;
            code += `    try:\n`;
            if (needsOLED) {
                code += `        ten.display.init()\n`;
            }

            // Detect if the user is using their own logic flow (If, Repeat, While)
            const allBlocks = workspace.current.getAllBlocks(false);
            const flowControlTypes = ['controls_repeat_ext', 'controls_whileUntil', 'robot_forever'];
            const hasFlowControl = allBlocks.some(b => flowControlTypes.includes(b.type));

            if (hasFlowControl) {
                // LEVEL 2: Real Flow (Student is in control)
                if (rawBody.trim()) {
                    code += pythonGenerator.prefixLines(rawBody, '        ');
                } else {
                    code += `        pass\n`;
                }
            } else {
                // LEVEL 1: Drag & Play (Auto-loop for beginners)
                code += `        while ten.is_running():\n`;
                if (rawBody.trim()) {
                    code += pythonGenerator.prefixLines(rawBody, '            ');
                } else {
                    code += `            pass\n`;
                }
                code += `            ten.delay(10)\n`;
            }
            
            code += `    except Exception as e:\n`;
            code += `        print(f"RUNTIME ERROR: {e}")\n`;
            code += `    finally:\n`;
            code += `        gc.collect()\n\n`;
            
            code += `if __name__ == "__main__":\n`;
            code += `    run()\n`;

            setPythonCode(code);
        };

        // Initial generation
        generateCode();

        workspace.current.addChangeListener(generateCode);

        return () => {
            if (workspace.current) {
                workspace.current.dispose();
            }
        };
    }, [project]);

    return { blocklyDiv, pythonCode, workspace };
};
