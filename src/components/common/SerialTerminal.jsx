import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Terminal as TerminalIcon, Trash2, Activity, Zap, Battery } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useAppStore from '../../store/appStore';

/** Move outside component — stable pure function, no need to re-create on every render */
const stripAnsi = (str) =>
    str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

const SerialTerminal = React.memo(({ logs, onClear, isEmbedded = false }) => {
    const terminalRef = useRef(null);
    const telemetry = useAppStore(s => s.telemetry);

    // Auto-scroll
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [logs]);

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
                    <button onClick={onClear} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '5px' }}>
                        <Trash2 size={16} />
                    </button>
                </div>
            )}

            {/* Live Power & Battery Telemetry HUD */}
            {hasTelemetry && (
                <div style={{
                    padding: '8px 15px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 'bold' }}>
                        <Battery size={14} />
                        <span>{battVolts.toFixed(2)}V ({battPct}%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#38bdf8' }}>
                            <Zap size={12} /> {battMa.toFixed(1)} mA
                        </span>
                        <span>{battPower.toFixed(2)} W</span>
                    </div>
                </div>
            )}

            {/* Custom Sensor Visualization Bar */}
            <AnimatePresence>
                {sensorValue !== null && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ padding: '10px 15px', background: 'rgba(var(--primary-rgb), 0.1)', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px', overflow: 'hidden' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Activity size={14} /> LIVE SENSOR DATA
                            </span>
                            <span>{sensorValue.toFixed(1)}%</span>
                        </div>
                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${sensorValue}%` }}
                                transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
                                style={{
                                    height: '100%',
                                    background: 'linear-gradient(90deg, var(--primary), #00F0FF)',
                                    borderRadius: '6px'
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                ref={terminalRef}
                style={{
                    flex: 1,
                    padding: '10px 15px',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    background: 'var(--terminal-bg)',
                    color: 'var(--terminal-text)',
                    border: 'none',
                    lineHeight: '1.4',
                    overscrollBehavior: 'contain'
                }}
            >
                {logs.length === 0 ? <span style={{ color: 'rgba(255,255,255,0.5)' }}>Waiting for serial data...</span> : stripAnsi(logs.join(''))}
            </div>

            {isEmbedded && (
                <div style={{ padding: '8px 15px', display: 'flex', justifyContent: 'flex-end', background: 'rgba(0,0,0,0.1)' }}>
                    <button onClick={onClear} className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.7rem', gap: '4px' }}>
                        <Trash2 size={12} /> Clear Logs
                    </button>
                </div>
            )}
        </div>
    );
});

SerialTerminal.displayName = 'SerialTerminal';

export default SerialTerminal;
