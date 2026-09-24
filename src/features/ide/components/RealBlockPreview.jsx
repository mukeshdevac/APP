import React, { useEffect, useRef, useMemo } from 'react';
import * as Blockly from 'blockly';
import { defineCustomBlocks } from '../services/customBlocks';
import { toast } from '../../../hooks/useToast';

let cachedPreviewTheme = null;
export function getPreviewTheme() {
    if (!cachedPreviewTheme) {
        try {
            cachedPreviewTheme = Blockly.Theme.defineTheme('ten_blocks_preview', {
                base: Blockly.Themes.Classic,
                blockStyles: {
                    motion_blocks: { colourPrimary: '#4C97FF', colourSecondary: '#3373CC', colourTertiary: '#3373CC' },
                    event_blocks: { colourPrimary: '#FFD500', colourSecondary: '#CCAA00', colourTertiary: '#CCAA00' },
                    control_blocks: { colourPrimary: '#FFAB19', colourSecondary: '#CF8B17', colourTertiary: '#CF8B17' },
                    sensor_blocks: { colourPrimary: '#4CBFE6', colourSecondary: '#2E8EB8', colourTertiary: '#2E8EB8' },
                    sound_blocks: { colourPrimary: '#D65CD6', colourSecondary: '#BD42BD', colourTertiary: '#BD42BD' },
                    math_blocks: { colourPrimary: '#59C059', colourSecondary: '#389438', colourTertiary: '#389438' },
                    text_blocks: { colourPrimary: '#9333EA', colourSecondary: '#7E22CE', colourTertiary: '#7E22CE' },
                    list_blocks: { colourPrimary: '#EA580C', colourSecondary: '#C2410C', colourTertiary: '#C2410C' },
                    variable_blocks: { colourPrimary: '#FF6680', colourSecondary: '#FF3355', colourTertiary: '#FF3355' },
                    procedure_blocks: { colourPrimary: '#A855F7', colourSecondary: '#9333EA', colourTertiary: '#9333EA' },
                },
                categoryStyles: {
                    motion_category: { colour: '#4C97FF' },
                    events_category: { colour: '#FFD500' },
                    control_category: { colour: '#FFAB19' },
                    sensors_category: { colour: '#4CBFE6' },
                    sound_category: { colour: '#D65CD6' },
                    math_category: { colour: '#59C059' },
                    text_category: { colour: '#9333EA' },
                    lists_category: { colour: '#EA580C' },
                    variable_category: { colour: '#FF6680' },
                    procedure_category: { colour: '#A855F7' },
                },
                componentStyles: {
                    workspaceBackgroundColour: 'transparent',
                },
                fontStyle: {
                    family: 'Outfit, Inter, sans-serif',
                    weight: '600',
                    size: 12
                }
            });
        } catch (e) {
            cachedPreviewTheme = 'Classic';
        }
    }
    return cachedPreviewTheme;
}

/**
 * Maps block titles, keywords, or level definitions to exact Blockly XML.
 */
export function getBlockXml(level, blockText) {
    if (level && level.blockXml) {
        return level.blockXml;
    }
    const text = (blockText || (level && level.newBlock) || '').toLowerCase();

    // 1. While Loop - EXACT REAL BLOCK matching user workspace
    if (text.includes('while')) {
        return '<xml><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value></block></xml>';
    }

    // 2. Repeat Loop
    if (text.includes('repeat')) {
        return '<xml><block type="controls_repeat_ext"><value name="TIMES"><shadow type="math_number"><field name="NUM">5</field></shadow></value></block></xml>';
    }

    // 3. For Loop
    if (text.includes('for')) {
        return '<xml><block type="controls_for"><field name="VAR">packet_id</field><value name="FROM"><shadow type="math_number"><field name="NUM">1</field></shadow></value><value name="TO"><shadow type="math_number"><field name="NUM">5</field></shadow></value><value name="BY"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></xml>';
    }

    // 4. Serial Print
    if (text.includes('serial print') || text.includes('serial')) {
        return '<xml><block type="esp32_serial_print"><value name="TEXT"><shadow type="text"><field name="TEXT">Hello World!</field></shadow></value></block></xml>';
    }

    // 5. Wait / Delay
    if (text.includes('wait') || text.includes('delay')) {
        return '<xml><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></xml>';
    }

    // 6. Digital Write
    if (text.includes('digital write')) {
        return '<xml><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">1</field></block></xml>';
    }

    // 7. Built-in LED
    if (text.includes('builtin') || text.includes('built-in') || text.includes('system led') || text.includes('led')) {
        return '<xml><block type="esp32_led_builtin"><field name="STATE">1</field></block></xml>';
    }

    // 8. Digital Read / Button
    if (text.includes('digital read') || text.includes('button')) {
        return '<xml><block type="esp32_digital_read"><field name="PIN">14</field></block></xml>';
    }

    // 9. PWM Dimmer
    if (text.includes('pwm') || text.includes('dimmer')) {
        return '<xml><block type="esp32_pwm_write"><field name="PIN">4</field><value name="DUTY"><shadow type="math_number"><field name="NUM">512</field></shadow></value></block></xml>';
    }

    // 10. Dual Motor
    if (text.includes('dual motor')) {
        return '<xml><block type="esp32_dual_motor"><value name="LEFT_SPEED"><shadow type="ten_number_100"><field name="NUM">80</field></shadow></value><value name="RIGHT_SPEED"><shadow type="ten_number_100"><field name="NUM">80</field></shadow></value></block></xml>';
    }

    // 11. Motor
    if (text.includes('motor')) {
        return '<xml><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">FORWARD</field><value name="SPEED"><shadow type="ten_number_100"><field name="NUM">80</field></shadow></value></block></xml>';
    }

    // 12. Servo sweep
    if (text.includes('servo sweep')) {
        return '<xml><block type="esp32_servo_sweep"><field name="PIN">1</field><value name="START"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="END"><shadow type="math_number"><field name="NUM">180</field></shadow></value><value name="STEP"><shadow type="math_number"><field name="NUM">10</field></shadow></value></block></xml>';
    }

    // 13. Servo 360
    if (text.includes('servo 360')) {
        return '<xml><block type="esp32_servo_360"><field name="PIN">1</field><value name="SPEED"><shadow type="ten_number_100"><field name="NUM">50</field></shadow></value></block></xml>';
    }

    // 14. Servo Center
    if (text.includes('servo center')) {
        return '<xml><block type="esp32_servo_center"><field name="PIN">1</field></block></xml>';
    }

    // 15. Servo Angle
    if (text.includes('servo')) {
        return '<xml><block type="esp32_servo"><field name="PIN">1</field><value name="ANGLE"><shadow type="math_number"><field name="NUM">90</field></shadow></value></block></xml>';
    }

    // 16. Stepper
    if (text.includes('stepper')) {
        return '<xml><block type="esp32_stepper"><field name="IN1">13</field><field name="IN2">12</field><field name="IN3">14</field><field name="IN4">27</field><value name="STEPS"><shadow type="math_number"><field name="NUM">200</field></shadow></value></block></xml>';
    }

    // 17. Ultrasonic
    if (text.includes('ultrasonic')) {
        return '<xml><block type="esp32_ultrasonic_read"><field name="TRIG">5</field><field name="ECHO">18</field></block></xml>';
    }

    // 18. Battery
    if (text.includes('battery')) {
        return '<xml><block type="esp32_get_battery"></block></xml>';
    }

    // 19. OLED / Display
    if (text.includes('oled') || text.includes('display')) {
        return '<xml><block type="esp32_oled_print"><field name="LINE">0</field><value name="TEXT"><shadow type="text"><field name="TEXT">Hello</field></shadow></value></block></xml>';
    }

    // 20. Robot Eyes
    if (text.includes('eye')) {
        return '<xml><block type="esp32_eyes_expression"><field name="EXPRESSION">HAPPY</field></block></xml>';
    }

    // 21. Emoji
    if (text.includes('emoji')) {
        return '<xml><block type="esp32_oled_emoji"><field name="EMOJI">HEART</field></block></xml>';
    }

    // 22. Sensor / Analog
    if (text.includes('analog') || text.includes('sensor')) {
        return '<xml><block type="esp32_analog_read"><field name="PIN">34</field></block></xml>';
    }

    // 23. Wireless / ESP-NOW
    if (text.includes('broadcast') || text.includes('wireless') || text.includes('now')) {
        return '<xml><block type="esp32_broadcast"><value name="VAL"><shadow type="ten_number_100"><field name="NUM">50</field></shadow></value></block></xml>';
    }

    // 24. I2C Scan
    if (text.includes('i2c')) {
        return '<xml><block type="esp32_i2c_scan"></block></xml>';
    }

    // 25. MPU6050
    if (text.includes('mpu')) {
        return '<xml><block type="esp32_i2c_mpu6050"></block></xml>';
    }

    // 26. Lists / Data
    if (text.includes('data') || text.includes('list') || text.includes('array')) {
        return '<xml><block type="lists_create_with"></block></xml>';
    }

    // 27. Control / If
    if (text.includes('if') || text.includes('control')) {
        return '<xml><block type="controls_if"></block></xml>';
    }

    // Fallback: Parse level.xml to extract first non-sketch block
    if (level && level.xml) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(level.xml, 'text/xml');
            const blocks = Array.from(doc.querySelectorAll('block'));
            const targetBlock = blocks.find(b => b.getAttribute('type') !== 'robot_sketch');
            if (targetBlock) {
                const cloned = targetBlock.cloneNode(true);
                const nextTag = cloned.querySelector(':scope > next');
                if (nextTag) nextTag.remove();
                const statementTag = cloned.querySelector(':scope > statement');
                if (statementTag) statementTag.remove();
                const serializer = new XMLSerializer();
                return `<xml>${serializer.serializeToString(cloned)}</xml>`;
            }
        } catch (e) {
            console.warn('[RealBlockPreview] Could not extract block from level xml:', e);
        }
    }

    return null;
}

/**
 * Universal Reusable 100% Genuine Blockly SVG Block Preview Component.
 * Can be used in:
 * - Curriculum guides
 * - In the middle of text explanations (set inline={true})
 * - AI mentor chat messages & tutorials
 */
export default function RealBlockPreview({ 
    blockText, 
    blockXml: explicitBlockXml, 
    level, 
    xml, 
    scale = 0.8,
    inline = false,
    onLoadXml 
}) {
    const containerRef = useRef(null);
    const workspaceRef = useRef(null);
    const blockXml = useMemo(
        () => explicitBlockXml || getBlockXml(level, blockText), 
        [explicitBlockXml, level, blockText]
    );

    const handleClick = () => {
        if (onLoadXml && xml) {
            onLoadXml(xml);
            toast.success("Loaded block into Blockly workspace!");
        } else if (onLoadXml && blockXml) {
            onLoadXml(blockXml);
            toast.success("Loaded block into Blockly workspace!");
        }
    };

    useEffect(() => {
        const hostEl = containerRef.current;
        if (!hostEl || !blockXml) return;

        defineCustomBlocks();
        const previewTheme = getPreviewTheme();

        // Clear any previous child
        hostEl.innerHTML = '';

        let ws = null;
        let resizeTimer = null;

        try {
            ws = Blockly.inject(hostEl, {
                readOnly: true,
                scrollbars: false,
                trashcan: false,
                sounds: false,
                media: 'https://unpkg.com/blockly/media/',
                theme: previewTheme,
                renderer: 'geras',
                zoom: {
                    controls: false,
                    wheel: false,
                    startScale: scale,
                    maxScale: scale,
                    minScale: scale
                }
            });
            workspaceRef.current = ws;

            const fullXml = blockXml.startsWith('<xml') ? blockXml : `<xml>${blockXml}</xml>`;
            const dom = Blockly.utils.xml.textToDom(fullXml);
            Blockly.Xml.domToWorkspace(dom, ws);

            const topBlocks = ws.getTopBlocks();
            if (topBlocks.length > 0) {
                const block = topBlocks[0];
                const xy = block.getRelativeToSurfaceXY();
                block.moveBy(4 - xy.x, 4 - xy.y);

                const updateSize = () => {
                    if (!hostEl || !ws) return;
                    const hw = block.getHeightWidth();
                    const w = Math.max(60, Math.ceil(hw.width * scale) + 10);
                    const h = Math.max(30, Math.ceil(hw.height * scale) + 10);
                    hostEl.style.width = `${w}px`;
                    hostEl.style.height = `${h}px`;
                    Blockly.svgResize(ws);
                };

                updateSize();
                resizeTimer = setTimeout(updateSize, 60);
            }
        } catch (err) {
            console.error('[RealBlockPreview] Failed to render authentic block preview:', err);
        }

        return () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            if (ws) {
                try {
                    ws.dispose();
                } catch (e) {}
            }
            workspaceRef.current = null;
        };
    }, [blockXml, scale]);

    if (!blockXml) {
        return (
            <span style={{
                fontSize: '0.82rem',
                fontWeight: '700',
                color: '#6366F1',
                padding: '2px 6px',
                background: '#EEF2FF',
                borderRadius: '4px'
            }}>
                {blockText}
            </span>
        );
    }

    return (
        <div
            onClick={handleClick}
            title={onLoadXml ? "Click to place this block into Blockly workspace" : undefined}
            style={{
                position: 'relative',
                display: inline ? 'inline-flex' : 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                verticalAlign: 'middle',
                margin: inline ? '0 4px' : '0',
                cursor: onLoadXml ? 'pointer' : 'default',
                borderRadius: '10px',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '4px 8px',
                transition: 'all 0.18s ease',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.06)',
                userSelect: 'none'
            }}
            onMouseEnter={(e) => {
                if (onLoadXml) {
                    e.currentTarget.style.transform = 'translateY(-1px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.22)';
                    e.currentTarget.style.borderColor = '#C4B5FD';
                }
            }}
            onMouseLeave={(e) => {
                if (onLoadXml) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.06)';
                    e.currentTarget.style.borderColor = '#E2E8F0';
                }
            }}
        >
            <div
                ref={containerRef}
                className="real-blockly-preview-host"
                style={{
                    position: 'relative',
                    overflow: 'visible',
                    pointerEvents: 'none'
                }}
            />
        </div>
    );
}
export { RealBlockPreview };
