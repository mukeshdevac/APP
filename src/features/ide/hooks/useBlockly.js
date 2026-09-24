import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';
import { pythonGenerator } from 'blockly/python';
import { defineCustomBlocks } from '../services/customBlocks';
import { registerCustomCategory } from '../services/categoryIcons';
import '../styles/BlocklyTheme.css';

export const useBlockly = (project) => {
    const blocklyDiv = useRef(null);
    const workspace = useRef(null);
    const [pythonCode, setPythonCode] = useState('');

    useEffect(() => {
        if (!blocklyDiv.current) return;

        registerCustomCategory();
        defineCustomBlocks();

        workspace.current = Blockly.inject(blocklyDiv.current, {
            toolbox: {
                kind: 'categoryToolbox',
                contents: [
                    {
                        kind: 'category',
                        name: 'DIGITAL',
                        colour: '#0284C7',
                        contents: [
                            { kind: 'block', type: 'esp32_digital_write' },
                            { kind: 'block', type: 'esp32_digital_read' },
                            { kind: 'block', type: 'esp32_digital_toggle' },
                            { kind: 'block', type: 'esp32_led_builtin' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'ANALOG',
                        colour: '#0D9488',
                        contents: [
                            { kind: 'block', type: 'esp32_analog_read' },
                            { kind: 'block', type: 'esp32_analog_read_voltage' },
                            { kind: 'block', type: 'esp32_pwm_write', inputs: { DUTY: { shadow: { type: 'math_number', fields: { NUM: 512 } } } } },
                            { kind: 'block', type: 'esp32_pwm_freq', inputs: { FREQ: { shadow: { type: 'math_number', fields: { NUM: 1000 } } } } },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'I2C',
                        colour: '#06B6D4',
                        contents: [
                            { kind: 'block', type: 'esp32_i2c_scan' },
                            { kind: 'block', type: 'esp32_i2c_read' },
                            { kind: 'block', type: 'esp32_i2c_write', inputs: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
                            { kind: 'block', type: 'esp32_i2c_mpu6050' },
                            { kind: 'block', type: 'esp32_i2c_temp' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'SERIAL',
                        colour: '#8B5CF6',
                        contents: [
                            {
                                kind: 'block',
                                type: 'esp32_serial_print',
                                inputs: {
                                    TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello TEN DevKit' } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'esp32_serial_print_var',
                                inputs: {
                                    VAL: { shadow: { type: 'math_number', fields: { NUM: 0 } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'esp32_broadcast',
                                inputs: {
                                    VAL: { shadow: { type: 'ten_number_100', fields: { NUM: 50 } } }
                                }
                            }
                        ]
                    },
                    {
                        kind: 'category',
                        name: 'MOTION',
                        colour: '#4C97FF',
                        contents: [
                            { kind: 'block', type: 'esp32_motor', inputs: { SPEED: { shadow: { type: 'ten_number_100', fields: { NUM: 80 } } } } },
                            { kind: 'block', type: 'esp32_dual_motor', inputs: { LEFT_SPEED: { shadow: { type: 'ten_number_100', fields: { NUM: 80 } } }, RIGHT_SPEED: { shadow: { type: 'ten_number_100', fields: { NUM: 80 } } } } },
                            { kind: 'block', type: 'esp32_stop_all_motors' },
                            { kind: 'block', type: 'esp32_output', inputs: { SPEED: { shadow: { type: 'ten_number_100', fields: { NUM: 100 } } } } },
                            { kind: 'block', type: 'esp32_servo', inputs: { ANGLE: { shadow: { type: 'math_number', fields: { NUM: 90 } } } } },
                            { kind: 'block', type: 'esp32_servo_center' },
                            { kind: 'block', type: 'esp32_servo_sweep', inputs: { START: { shadow: { type: 'math_number', fields: { NUM: 0 } } }, END: { shadow: { type: 'math_number', fields: { NUM: 180 } } } } },
                            { kind: 'block', type: 'esp32_servo_step', inputs: { DELTA: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                            { kind: 'block', type: 'esp32_servo_360', inputs: { SPEED: { shadow: { type: 'ten_number_100', fields: { NUM: 50 } } } } },
                            { kind: 'block', type: 'esp32_stepper', inputs: { STEPS: { shadow: { type: 'math_number', fields: { NUM: 200 } } } } },
                            { kind: 'block', type: 'esp32_stepper_degrees', inputs: { DEGREES: { shadow: { type: 'math_number', fields: { NUM: 360 } } } } },
                            { kind: 'block', type: 'esp32_stepper_stop' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'SENSORS',
                        colour: '#3B82F6',
                        contents: [
                            { kind: 'block', type: 'esp32_sensor_read' },
                            { kind: 'block', type: 'esp32_ultrasonic_read' },
                            { kind: 'block', type: 'esp32_get_battery' },
                            { kind: 'block', type: 'esp32_get_voltage' },
                            { kind: 'block', type: 'esp32_get_current' },
                            { kind: 'block', type: 'esp32_get_power' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'DISPLAY',
                        colour: '#475569',
                        contents: [
                            { kind: 'block', type: 'esp32_oled_print', inputs: { TEXT: { shadow: { type: 'text', fields: { TEXT: 'Hello' } } }, LINE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } },
                            { kind: 'block', type: 'esp32_oled_clear' },
                            { kind: 'block', type: 'esp32_oled_sensor_view' },
                            { kind: 'block', type: 'esp32_oled_sensor_full' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'EYES & EMOJI',
                        colour: '#D65CD6',
                        contents: [
                             { kind: 'block', type: 'esp32_spidermaf_eyes' },
                             { kind: 'block', type: 'esp32_spidermaf_custom' },
                             { kind: 'block', type: 'esp32_eyes_expression' },
                             { kind: 'block', type: 'esp32_eyes_animate' },
                             { kind: 'block', type: 'esp32_eyes_custom' },
                             { kind: 'block', type: 'esp32_oled_emoji' },
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
                        name: 'LOOPS',
                        colour: '#59C059',
                        contents: [
                            { kind: 'block', type: 'controls_repeat_ext', inputs: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 10 } } } } },
                            { kind: 'block', type: 'controls_whileUntil' },
                            {
                                kind: 'block',
                                type: 'controls_for',
                                inputs: {
                                    FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                                    TO: { shadow: { type: 'math_number', fields: { NUM: 10 } } },
                                    BY: { shadow: { type: 'math_number', fields: { NUM: 1 } } }
                                }
                            },
                            { kind: 'block', type: 'controls_forEach' },
                            { kind: 'block', type: 'controls_flow_statements' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'CONTROL',
                        colour: '#4C97FF',
                        contents: [
                            { kind: 'block', type: 'controls_if' },
                            { kind: 'block', type: 'controls_ifelse' },
                            { kind: 'block', type: 'logic_compare' },
                            { kind: 'block', type: 'ten_number_100', fields: { NUM: 50 } },
                            { kind: 'block', type: 'logic_operation' },
                            { kind: 'block', type: 'logic_negate' },
                            { kind: 'block', type: 'logic_boolean' },
                            { kind: 'block', type: 'logic_null' },
                            { kind: 'block', type: 'logic_ternary' },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'MATH',
                        colour: '#59C059',
                        contents: [
                            { kind: 'block', type: 'math_number' },
                            {
                                kind: 'block',
                                type: 'math_arithmetic',
                                inputs: {
                                    A: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                                    B: { shadow: { type: 'math_number', fields: { NUM: 1 } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'math_single',
                                inputs: {
                                    NUM: { shadow: { type: 'math_number', fields: { NUM: 9 } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'math_trig',
                                inputs: {
                                    NUM: { shadow: { type: 'math_number', fields: { NUM: 45 } } }
                                }
                            },
                            { kind: 'block', type: 'math_constant' },
                            {
                                kind: 'block',
                                type: 'math_number_property',
                                inputs: {
                                    NUMBER_TO_CHECK: { shadow: { type: 'math_number', fields: { NUM: 0 } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'math_round',
                                inputs: {
                                    NUM: { shadow: { type: 'math_number', fields: { NUM: 3.1 } } }
                                }
                            },
                            { kind: 'block', type: 'math_on_list' },
                            {
                                kind: 'block',
                                type: 'math_modulo',
                                inputs: {
                                    DIVIDEND: { shadow: { type: 'math_number', fields: { NUM: 64 } } },
                                    DIVISOR: { shadow: { type: 'math_number', fields: { NUM: 10 } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'math_constrain',
                                inputs: {
                                    VALUE: { shadow: { type: 'math_number', fields: { NUM: 50 } } },
                                    LOW: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                                    HIGH: { shadow: { type: 'math_number', fields: { NUM: 100 } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'esp32_map',
                                inputs: {
                                    VAL: { shadow: { type: 'math_number', fields: { NUM: 512 } } },
                                    FROM_LOW: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
                                    FROM_HIGH: { shadow: { type: 'math_number', fields: { NUM: 1023 } } },
                                    TO_LOW: { shadow: { type: 'math_number', fields: { NUM: 0 } } },
                                    TO_HIGH: { shadow: { type: 'math_number', fields: { NUM: 180 } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'math_random_int',
                                inputs: {
                                    FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                                    TO: { shadow: { type: 'math_number', fields: { NUM: 100 } } }
                                }
                            },
                            { kind: 'block', type: 'math_random_float' },
                            {
                                kind: 'block',
                                type: 'math_atan2',
                                inputs: {
                                    X: { shadow: { type: 'math_number', fields: { NUM: 1 } } },
                                    Y: { shadow: { type: 'math_number', fields: { NUM: 1 } } }
                                }
                            },
                        ],
                    },
                    {
                        kind: 'category',
                        name: 'TEXT',
                        colour: '#9333EA',
                        contents: [
                            { kind: 'block', type: 'text' },
                            { kind: 'block', type: 'text_join' },
                            {
                                kind: 'block',
                                type: 'text_append',
                                inputs: {
                                    TEXT: { shadow: { type: 'text', fields: { TEXT: '' } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'text_length',
                                inputs: {
                                    VALUE: { shadow: { type: 'text', fields: { TEXT: 'abc' } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'text_isEmpty',
                                inputs: {
                                    VALUE: { shadow: { type: 'text', fields: { TEXT: '' } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'text_indexOf',
                                inputs: {
                                    VALUE: { block: { type: 'variables_get' } },
                                    FIND: { shadow: { type: 'text', fields: { TEXT: 'abc' } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'text_charAt',
                                inputs: {
                                    VALUE: { block: { type: 'variables_get' } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'text_getSubstring',
                                inputs: {
                                    STRING: { block: { type: 'variables_get' } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'text_changeCase',
                                inputs: {
                                    TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'text_trim',
                                inputs: {
                                    TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } }
                                }
                            },
                            {
                                kind: 'block',
                                type: 'text_print',
                                inputs: {
                                    TEXT: { shadow: { type: 'text', fields: { TEXT: 'abc' } } }
                                }
                            },
                        ]
                    },
                    {
                        kind: 'category',
                        name: 'LISTS',
                        colour: '#EA580C',
                        contents: [
                            { kind: 'block', type: 'lists_create_with' },
                            { kind: 'block', type: 'lists_create_empty' },
                            {
                                kind: 'block',
                                type: 'lists_repeat',
                                inputs: {
                                    NUM: { shadow: { type: 'math_number', fields: { NUM: 5 } } }
                                }
                            },
                            { kind: 'block', type: 'lists_length' },
                            { kind: 'block', type: 'lists_isEmpty' },
                            { kind: 'block', type: 'lists_indexOf' },
                            { kind: 'block', type: 'lists_getIndex' },
                            { kind: 'block', type: 'lists_setIndex' },
                            { kind: 'block', type: 'lists_getSublist' },
                            {
                                kind: 'block',
                                type: 'lists_split',
                                inputs: {
                                    DELIM: { shadow: { type: 'text', fields: { TEXT: ',' } } }
                                }
                            },
                            { kind: 'block', type: 'lists_sort' },
                            { kind: 'block', type: 'lists_reverse' },
                        ]
                    },
                    {
                        kind: 'category',
                        name: 'VARIABLES',
                        colour: '#FF6680',
                        custom: 'VARIABLE'
                    },
                    {
                        kind: 'category',
                        name: 'FUNCTIONS',
                        colour: '#A855F7',
                        custom: 'PROCEDURE'
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
                    'text_blocks': { 'colourPrimary': '#9333EA', 'colourSecondary': '#7E22CE', 'colourTertiary': '#7E22CE' },
                    'list_blocks': { 'colourPrimary': '#EA580C', 'colourSecondary': '#C2410C', 'colourTertiary': '#C2410C' },
                    'variable_blocks': { 'colourPrimary': '#FF6680', 'colourSecondary': '#FF3355', 'colourTertiary': '#FF3355' },
                    'procedure_blocks': { 'colourPrimary': '#A855F7', 'colourSecondary': '#9333EA', 'colourTertiary': '#9333EA' },
                },
                'categoryStyles': {
                    'motion_category': { 'colour': '#4C97FF' },
                    'events_category': { 'colour': '#FFD500' },
                    'control_category': { 'colour': '#FFAB19' },
                    'sensors_category': { 'colour': '#4CBFE6' },
                    'sound_category': { 'colour': '#D65CD6' },
                    'math_category': { 'colour': '#59C059' },
                    'text_category': { 'colour': '#9333EA' },
                    'lists_category': { 'colour': '#EA580C' },
                    'variable_category': { 'colour': '#FF6680' },
                    'procedure_category': { 'colour': '#A855F7' },
                },
                'componentStyles': {
                    'workspaceBackgroundColour': '#FFFFFF',
                    'toolboxBackgroundColour': '#FAF7F2',
                    'toolboxForegroundColour': '#18181B',
                    'flyoutBackgroundColour': '#FFFFFF',
                    'flyoutForegroundColour': '#18181B',
                    'flyoutOpacity': 0.98,
                    'scrollbarColour': '#D1D5DB',
                    'insertionMarkerColour': '#0284C7',
                    'insertionMarkerOpacity': 0.35,
                },
                'fontStyle': {
                    'family': 'Outfit, Inter, sans-serif',
                    'weight': '600',
                    'size': 12
                }
            }),
            grid: { spacing: 25, length: 3, colour: '#CBD5E1', snap: true },
            trashcan: true,
            zoom: { controls: true, wheel: true, startScale: 1.0, maxScale: 3, minScale: 0.3, scaleSpeed: 1.2 },
            move: { scrollbars: true, drag: true, wheel: true }
        });

        // Ensure toolbox dimensions and flyout positions are aligned with the 205px custom width
        let resizeObserver = null;
        if (typeof ResizeObserver !== 'undefined' && blocklyDiv.current) {
            resizeObserver = new ResizeObserver(() => {
                if (workspace.current) {
                    Blockly.svgResize(workspace.current);
                }
            });
            resizeObserver.observe(blocklyDiv.current);
        }

        const handleResize = () => {
            if (workspace.current) {
                Blockly.svgResize(workspace.current);
            }
        };
        window.addEventListener('resize', handleResize);

        setTimeout(() => {
            if (workspace.current) {
                Blockly.svgResize(workspace.current);
                const tb = workspace.current.getToolbox();
                if (tb) tb.position();
            }
        }, 50);

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

            // 1. Initialize generator with standard 4-space indentation
            pythonGenerator.INDENT = '    ';
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
            const needsOLED = rawBody.includes('ten.display.') || rawBody.includes('eyes_v2') || rawBody.includes('robot_eyes') || (definitions && definitions.includes('_RobotEyes')) || (definitions && definitions.includes('_EMOJI_BITMAPS'));
            
            let code = `import machine, time, ten, gc, math, random, framebuf\n\n`;
            if (definitions) {
                code += `# --- HARDWARE ---\n${definitions}\n\n`;
            }
            
            code += `def run():\n`;
            code += `    gc.collect() # Initial cleanup\n`;
            code += `    try:\n`;
            if (needsOLED) {
                code += `        ten.display.init()\n`;
            }

            // Detect if the user is using their own logic flow (If, Repeat, While, For)
            const allBlocks = workspace.current.getAllBlocks(false);
            const flowControlTypes = ['controls_repeat_ext', 'controls_whileUntil', 'controls_for', 'controls_forEach', 'robot_forever'];
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
            window.removeEventListener('resize', handleResize);
            if (resizeObserver) resizeObserver.disconnect();
            if (workspace.current) {
                workspace.current.dispose();
            }
        };
    }, [project]);

    return { blocklyDiv, pythonCode, workspace };
};
