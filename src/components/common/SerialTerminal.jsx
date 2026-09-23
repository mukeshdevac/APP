import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Terminal as TerminalIcon, Trash2, Activity, Zap, Battery, ArrowDownCircle, Send, CornerDownLeft, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../store/appStore';
import { connectionManager } from '../../utils/ConnectionManager';
import { toast } from '../../hooks/useToast';

/** Move outside component — stable pure function, no need to re-create on every render */
const stripAnsi = (str) =>
    str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

const SerialTerminal = React.memo(({ logs, onClear, isEmbedded = false }) => {
    const terminalRef = useRef(null);
    const telemetry = useAppStore(s => s.telemetry);
    const [autoScroll, setAutoScroll] = useState(true);
    const [replInput, setReplInput] = useState('');
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [copied, setCopied] = useState(false);
    const replInputRef = useRef(null);

    const handleCopyLogs = () => {
        if (logs && logs.length > 0) {
            const clean = stripAnsi(logs.join(''));
            navigator.clipboard.writeText(clean);
            setCopied(true);
            toast.success("Serial logs copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } else {
            toast.error("No serial logs to copy!");
        }
    };

    // Auto-scroll when enabled
    useEffect(() => {
        if (autoScroll && terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs, autoScroll]);

    // Send command to REPL
    const handleSendRepl = async (commandToSend) => {
        const cmd = commandToSend !== undefined ? commandToSend : replInput;
        if (cmd === null || cmd === undefined) return;

        if (!connectionManager.isConnected) {
            toast.error('Connect ESP32 device first to send REPL commands!');
            return;
        }

        try {
            // Echo command to serial log for user visibility if it's text
            if (cmd && cmd !== '\x03' && cmd !== '\x04' && connectionManager.onData) {
                connectionManager.onData(`>>> ${cmd}\n`);
            } else if (cmd === '\x03' && connectionManager.onData) {
                connectionManager.onData(`^C\nKeyboardInterrupt\n`);
            } else if (cmd === '\x04' && connectionManager.onData) {
                connectionManager.onData(`^D\nSoft rebooting...\n`);
            }

            // Transmit to board
            await connectionManager.write(cmd + '\r\n');

            if (commandToSend === undefined && cmd.trim()) {
                setHistory(prev => [cmd, ...prev.filter(c => c !== cmd)].slice(0, 50));
                setHistoryIndex(-1);
                setReplInput('');
            }
        } catch (err) {
            toast.error(`REPL Send Failed: ${err.message}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendRepl();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length > 0) {
                const nextIndex = Math.min(historyIndex + 1, history.length - 1);
                setHistoryIndex(nextIndex);
                setReplInput(history[nextIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                const nextIndex = historyIndex - 1;
                setHistoryIndex(nextIndex);
                setReplInput(history[nextIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setReplInput('');
            }
        }
    };

    // Parse logs for sensor data
    const sensorValue = useMemo(() => {
        if (!logs || logs.length === 0) return null;

        // Check the last 10 log entries to find the most recent SENSOR tag
        const recentLogs = logs.slice(-10).join('');
        const lines = stripAnsi(recentLogs).split('\n');

        for (let i = lines.length - 1; i >= 0; i--) {
            const match = lines[i].match(/SENSOR:\s*([\d.]+)/i);
            if (match) {
                let val = parseFloat(match[1]);
                if (val > 100) val = 100;
                if (val < 0) val = 0;
                return val;
            }
        }
        return null;
    }, [logs]);

    const battVolts = telemetry?.v || 0;
    const battPct = telemetry?.pct !== undefined ? telemetry.pct : (telemetry?.b !== undefined ? telemetry.b : 0);
    const battMa = telemetry?.ma || 0;
    const battPower = telemetry?.p || 0;
    const hasTelemetry = battVolts > 0 || battPct > 0 || battMa !== 0;

    return (
        <div className={isEmbedded ? "" : "glass"} style={{
            height: isEmbedded ? '100%' : 'clamp(150px, 20vh, 200px)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: isEmbedded ? '0' : '20px',
            border: isEmbedded ? 'none' : '1px solid var(--border)'
        }}>
            {!isEmbedded && (
                <div style={{ padding: '8px 15px', background: 'var(--terminal-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
                        <TerminalIcon size={14} color="var(--primary)" />
                        <span style={{ fontWeight: '600', color: 'var(--terminal-text)' }}>Serial Monitor</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={() => setAutoScroll(!autoScroll)}
                            title={autoScroll ? "Pause Autoscroll" : "Enable Autoscroll"}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                border: autoScroll ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.2)',
                                background: autoScroll ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                                color: autoScroll ? '#34D399' : 'rgba(255,255,255,0.6)',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            <ArrowDownCircle size={12} color={autoScroll ? '#34D399' : 'rgba(255,255,255,0.6)'} />
                            <span>Autoscroll {autoScroll ? 'ON' : 'OFF'}</span>
                        </button>
                        <button onClick={onClear} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '5px' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Logs Area */}
            <div
                ref={terminalRef}
                style={{
                    flex: 1,
                    padding: '12px 18px',
                    fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', Menlo, Consolas, monospace",
                    fontSize: '0.82rem',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    background: 'var(--terminal-bg, #0B1120)',
                    color: 'var(--terminal-text, #F8FAFC)',
                    border: 'none',
                    lineHeight: '1.5',
                    overscrollBehavior: 'contain'
                }}
            >
                {logs.length === 0 ? <span style={{ color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>Waiting for serial data...</span> : stripAnsi(logs.join(''))}
            </div>

            {/* REPL Interactive Command Bar - Clean White Theme */}
            <div style={{
                background: '#FFFFFF',
                borderTop: '1px solid #E2E8F0',
                padding: '8px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flex: 1,
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '5px 10px'
                }}>
                    <span style={{ color: '#0284C7', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        &gt;&gt;&gt;
                    </span>
                    <input
                        ref={replInputRef}
                        type="text"
                        value={replInput}
                        onChange={(e) => setReplInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type MicroPython command... (Enter to send, ↑↓ history)"
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            color: '#0F172A',
                            fontFamily: "'SF Mono', Menlo, Consolas, monospace",
                            fontSize: '0.8rem'
                        }}
                    />
                    <button
                        onClick={() => handleSendRepl()}
                        title="Send to REPL (Enter)"
                        style={{
                            background: '#0284C7',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.72rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            boxShadow: '0 1px 2px rgba(2, 132, 199, 0.2)',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <CornerDownLeft size={12} />
                        <span>Send</span>
                    </button>
                </div>

                {/* Quick REPL Control Keys */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button
                        onClick={() => handleSendRepl('\x03')}
                        title="Send KeyboardInterrupt (Ctrl+C)"
                        style={{
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: '1px solid #FECACA',
                            borderRadius: '6px',
                            padding: '5px 9px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        Ctrl+C
                    </button>
                    <button
                        onClick={() => handleSendRepl('\x04')}
                        title="Soft Reboot (Ctrl+D)"
                        style={{
                            background: '#E0F2FE',
                            color: '#0284C7',
                            border: '1px solid #BAE6FD',
                            borderRadius: '6px',
                            padding: '5px 9px',
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            fontFamily: 'monospace',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        Ctrl+D
                    </button>
                </div>

                {/* Autoscroll & Clear Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                        onClick={() => setAutoScroll(!autoScroll)}
                        title={autoScroll ? "Pause Autoscroll" : "Enable Autoscroll"}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: autoScroll ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                            background: autoScroll ? '#ECFDF5' : '#F8FAFC',
                            color: autoScroll ? '#059669' : '#64748B',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <ArrowDownCircle size={12} color={autoScroll ? '#059669' : '#64748B'} />
                        <span>Autoscroll {autoScroll ? 'ON' : 'OFF'}</span>
                    </button>
                    <button
                        onClick={handleCopyLogs}
                        title="Copy All Serial Output"
                        style={{
                            background: copied ? '#ECFDF5' : '#F8FAFC',
                            color: copied ? '#059669' : '#64748B',
                            border: copied ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        {copied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                        onClick={onClear}
                        title="Clear Logs"
                        style={{
                            background: '#F8FAFC',
                            color: '#64748B',
                            border: '1px solid #E2E8F0',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Trash2 size={12} />
                        <span>Clear</span>
                    </button>
                </div>
            </div>
        </div>
    );
});

SerialTerminal.displayName = 'SerialTerminal';

export default SerialTerminal;
