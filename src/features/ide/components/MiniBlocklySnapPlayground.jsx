import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Blockly from 'blockly';
import { defineCustomBlocks } from '../services/customBlocks';
import { getPreviewTheme } from './RealBlockPreview';
import { Sparkles, RotateCcw, Check, MousePointer, Ban, ArrowRight, AlertTriangle } from 'lucide-react';
import { toast } from '../../../hooks/useToast';

/**
 * MiniBlocklySnapPlayground
 * Uses REAL Blockly blocks from the academy:
 * 1. esp32_serial_print ("Serial Print 'Hello Robot! 🤖'")
 * 2. wait_seconds ("Wait 1 seconds")
 * 3. esp32_digital_write ("Set Digital Pin 4 to HIGH")
 * 4. math_number ("100") -> A real value block that students try to connect, but CANNOT snap into vertical statement notches!
 * 
 * Teaches:
 * - Proper top-to-bottom execution order (Print ➔ Wait ➔ LED)
 * - That real value blocks (oval tabs) will not connect to vertical action notches
 */
export default function MiniBlocklySnapPlayground() {
    const containerRef = useRef(null);
    const workspaceRef = useRef(null);
    const printBlockRef = useRef(null);
    const waitBlockRef = useRef(null);
    const ledBlockRef = useRef(null);
    const numberBlockRef = useRef(null);

    // Connection & order states: 'none' | 'partial' | 'perfect' | 'out_of_order'
    const [orderStatus, setOrderStatus] = useState('none');
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showIncompatibleNotice, setShowIncompatibleNotice] = useState(false);

    // Initialize the 4 real blocks across the workspace
    const initBlocks = useCallback((ws) => {
        if (!ws) return;
        ws.clear();
        setOrderStatus('none');
        setShowIncompatibleNotice(false);

        // Real XML using authentic blocks from the IDE
        const xmlString = `
            <xml xmlns="https://developers.google.com/blockly/xml">
                <block type="esp32_serial_print" id="mini_block_print" x="20" y="20">
                    <value name="TEXT">
                        <shadow type="text">
                            <field name="TEXT">Hello Robot! 🤖</field>
                        </shadow>
                    </value>
                </block>
                
                <block type="wait_seconds" id="mini_block_wait" x="210" y="20">
                    <value name="SECONDS">
                        <shadow type="math_number">
                            <field name="NUM">1</field>
                        </shadow>
                    </value>
                </block>

                <block type="esp32_digital_write" id="mini_block_led" x="20" y="110">
                    <field name="PIN">4</field>
                    <field name="STATE">1</field>
                </block>

                <block type="math_number" id="mini_block_number" x="210" y="110">
                    <field name="NUM">100</field>
                </block>
            </xml>
        `;

        try {
            const dom = Blockly.utils.xml.textToDom(xmlString);
            Blockly.Xml.domToWorkspace(dom, ws);
            printBlockRef.current = ws.getBlockById('mini_block_print');
            waitBlockRef.current = ws.getBlockById('mini_block_wait');
            ledBlockRef.current = ws.getBlockById('mini_block_led');
            numberBlockRef.current = ws.getBlockById('mini_block_number');
        } catch (e) {
            console.error('[MiniBlocklySnapPlayground] Error loading XML:', e);
        }

        Blockly.svgResize(ws);
    }, []);

    useEffect(() => {
        const hostEl = containerRef.current;
        if (!hostEl) return;

        defineCustomBlocks();
        const theme = getPreviewTheme();

        const ws = Blockly.inject(hostEl, {
            readOnly: false,
            trashcan: false,
            sounds: true,
            comments: false,
            disable: false,
            grid: {
                spacing: 18,
                length: 3,
                colour: '#E2E8F0',
                snap: true
            },
            zoom: {
                controls: false,
                wheel: false,
                startScale: 0.8,
                maxScale: 1.1,
                minScale: 0.6
            },
            move: {
                scrollbars: false,
                drag: true,
                wheel: false
            },
            theme: theme
        });

        workspaceRef.current = ws;
        initBlocks(ws);

        // Resize observer
        let resizeObs = null;
        if (typeof ResizeObserver !== 'undefined') {
            resizeObs = new ResizeObserver(() => {
                if (workspaceRef.current) {
                    Blockly.svgResize(workspaceRef.current);
                }
            });
            resizeObs.observe(hostEl);
        }

        // Listener to detect physical block connections and order
        const changeListener = (event) => {
            if (
                event.type === Blockly.Events.BLOCK_MOVE || 
                event.type === Blockly.Events.BLOCK_CHANGE ||
                event.type === Blockly.Events.BLOCK_DRAG
            ) {
                setHasInteracted(true);

                // Detect when student drags the real number block
                if (event.type === Blockly.Events.BLOCK_DRAG && !event.isStart) {
                    if (event.blockId === 'mini_block_number') {
                        setShowIncompatibleNotice(true);
                    }
                }

                const bPrint = printBlockRef.current;
                const bWait = waitBlockRef.current;
                const bLed = ledBlockRef.current;

                if (bPrint && bWait && bLed) {
                    const isPrintThenWait = bPrint.getNextBlock() === bWait;
                    const isWaitThenLed = bWait.getNextBlock() === bLed;
                    const isAllThreeInOrder = isPrintThenWait && isWaitThenLed;

                    // Out of order checks
                    const isWaitThenPrint = bWait.getNextBlock() === bPrint;
                    const isLedThenPrint = bLed.getNextBlock() === bPrint;
                    const isLedThenWait = bLed.getNextBlock() === bWait;
                    const isPrintThenLed = bPrint.getNextBlock() === bLed;

                    if (isAllThreeInOrder) {
                        setOrderStatus('perfect');
                        setShowIncompatibleNotice(false);
                    } else if (isWaitThenPrint || isLedThenPrint || isLedThenWait || (isPrintThenLed && !isWaitThenLed)) {
                        setOrderStatus('out_of_order');
                    } else if (isPrintThenWait || isWaitThenLed) {
                        setOrderStatus('partial');
                    } else {
                        setOrderStatus('none');
                    }
                }
            }
        };

        ws.addChangeListener(changeListener);

        return () => {
            if (resizeObs) resizeObs.disconnect();
            ws.removeChangeListener(changeListener);
            ws.dispose();
            workspaceRef.current = null;
        };
    }, [initBlocks]);

    const handleReset = () => {
        if (workspaceRef.current) {
            initBlocks(workspaceRef.current);
            toast.info('Blocks reset! Try connecting in order: Serial Print ➔ Wait ➔ Set Pin 4!');
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: orderStatus === 'perfect' 
                ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' 
                : orderStatus === 'out_of_order'
                    ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
                    : orderStatus === 'partial'
                        ? 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)'
                        : '#F8FAFC',
            border: orderStatus === 'perfect' 
                ? '2px solid #10B981' 
                : orderStatus === 'out_of_order'
                    ? '2px solid #F97316'
                    : orderStatus === 'partial'
                        ? '2px solid #F59E0B'
                        : '1.5px solid #CBD5E1',
            borderRadius: '14px',
            padding: '12px',
            boxShadow: orderStatus === 'perfect' 
                ? '0 0 20px rgba(16, 185, 129, 0.25)' 
                : '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.3s ease'
        }}>
            {/* Top Prompt & Status Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '7px',
                        background: orderStatus === 'perfect' 
                            ? '#10B981' 
                            : orderStatus === 'out_of_order'
                                ? '#F97316'
                                : orderStatus === 'partial' 
                                    ? '#F59E0B' 
                                    : '#6366F1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                        {orderStatus === 'perfect' ? <Check size={15} /> : <MousePointer size={14} />}
                    </div>
                    <div>
                        <div style={{
                            fontSize: '0.82rem',
                            fontWeight: '800',
                            color: orderStatus === 'perfect' 
                                ? '#065F46' 
                                : orderStatus === 'out_of_order'
                                    ? '#9A3412'
                                    : '#0F172A'
                        }}>
                            {orderStatus === 'perfect' 
                                ? '🎉 PERFECT ORDER! Real Blocks Connected!' 
                                : orderStatus === 'out_of_order'
                                    ? '⚠️ Blocks Connected in Wrong Order!'
                                    : orderStatus === 'partial'
                                        ? '🟡 Good progress! Now connect the 3rd block in order!'
                                        : '👇 Live Mini Window: Drag & Connect in Order!'}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: orderStatus === 'perfect' ? '#047857' : '#64748B' }}>
                            {orderStatus === 'perfect'
                                ? 'Top-to-bottom sequence complete: Print ➔ Wait ➔ LED Pin 4!'
                                : orderStatus === 'out_of_order'
                                    ? 'Computers read top-to-bottom! Arrange: Print first, then Wait, then LED!'
                                    : 'Notice: Real blocks must connect in order. The Number block will NOT connect!'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleReset}
                    title="Reset Blocks to Try Again"
                    style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#475569',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease'
                    }}
                >
                    <RotateCcw size={12} />
                    <span>Reset</span>
                </button>
            </div>

            {/* Target Sequence and Rule Pills */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flexWrap: 'wrap',
                padding: '6px 8px',
                background: '#FFFFFF',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                fontSize: '0.69rem'
            }}>
                <span style={{ fontWeight: '800', color: '#4338CA' }}>Required Order:</span>
                <span style={{
                    padding: '2px 6px',
                    borderRadius: '5px',
                    background: '#E0F2FE',
                    color: '#075985',
                    fontWeight: '700'
                }}>
                    1️⃣ Serial Print
                </span>
                <ArrowRight size={11} color="#94A3B8" />
                <span style={{
                    padding: '2px 6px',
                    borderRadius: '5px',
                    background: '#FEF3C7',
                    color: '#92400E',
                    fontWeight: '700'
                }}>
                    2️⃣ Wait 1s
                </span>
                <ArrowRight size={11} color="#94A3B8" />
                <span style={{
                    padding: '2px 6px',
                    borderRadius: '5px',
                    background: '#DCFCE7',
                    color: '#166534',
                    fontWeight: '700'
                }}>
                    3️⃣ Set Pin 4 HIGH
                </span>
                <span style={{ marginLeft: 'auto', color: '#DC2626', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Ban size={11} /> ❌ Number (100) Won't Connect!
                </span>
            </div>

            {/* Real Interactive Blockly Canvas Container */}
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '220px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
                }}
            />

            {/* Dynamic Real-time Educational Feedback */}
            {orderStatus === 'perfect' ? (
                <div style={{
                    padding: '8px 12px',
                    background: '#DCFCE7',
                    border: '1px solid #86EFAC',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.74rem',
                    fontWeight: '700',
                    color: '#166534'
                }}>
                    <Sparkles size={15} color="#10B981" />
                    <span>Brilliant! 1) Serial Print ➔ 2) Wait 1s ➔ 3) Set Digital Pin 4 are snapped in exact execution order! Real code is ready! 🚀</span>
                </div>
            ) : orderStatus === 'out_of_order' ? (
                <div style={{
                    padding: '7px 10px',
                    background: '#FFEDD5',
                    border: '1px solid #FDBA74',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.73rem',
                    fontWeight: '600',
                    color: '#9A3412'
                }}>
                    <AlertTriangle size={14} color="#EA580C" />
                    <span>Order Alert! Remember that robots read strictly top-to-bottom. Put [Serial Print] on top, [Wait] in the middle, and [Set Digital Pin] at the bottom!</span>
                </div>
            ) : orderStatus === 'partial' ? (
                <div style={{
                    padding: '7px 10px',
                    background: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.73rem',
                    fontWeight: '600',
                    color: '#92400E'
                }}>
                    <Sparkles size={14} color="#D97706" />
                    <span>Good job! Now connect the 3rd block to complete the full sequence in order!</span>
                </div>
            ) : showIncompatibleNotice ? (
                <div style={{
                    padding: '7px 10px',
                    background: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.73rem',
                    fontWeight: '600',
                    color: '#991B1B'
                }}>
                    <Ban size={14} color="#DC2626" />
                    <span>🚫 Notice: The real Number block (100) has an oval tab, so it CANNOT connect to vertical statement notches! Value blocks only plug into value inputs!</span>
                </div>
            ) : hasInteracted ? (
                <div style={{
                    padding: '6px 10px',
                    background: '#EEF2FF',
                    border: '1px solid #C7D2FE',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.72rem',
                    color: '#3730A3',
                    fontWeight: '600'
                }}>
                    <AlertTriangle size={13} color="#4F46E5" />
                    <span>💡 Tip: Try dragging the Number block (100) to the stack — notice that it won't connect! Then arrange the 3 real statement blocks in order!</span>
                </div>
            ) : null}
        </div>
    );
}
