import React, { useState } from 'react';
import logoDark from '../../assets/logo-dark.png';
import logoLight from '../../assets/logo-light.png';
import { Wifi, WifiOff, Bluetooth, Usb, Globe, Menu, X, Bot, Blocks, Battery, Zap, AlertTriangle } from 'lucide-react';
import { connectionManager } from '../../utils/ConnectionManager';
import ThemeToggle from '../common/ThemeToggle';
import { motion as Motion } from 'framer-motion';
import { useTheme } from '../../app/providers/ThemeProvider';
import { toast } from '../../hooks/useToast';

const Header = ({ isConnected, setIsConnected, view, setView, uploadProgress, onOpenIde, telemetry }) => {
    const { theme } = useTheme();
    const [isConnecting, setIsConnecting] = useState(false);
    const [connType, setConnType] = useState('serial');
    const [showSettings, setShowSettings] = useState(false);
    const [wifiHost, setWifiHost] = useState('192.168.4.1');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showBattTooltip, setShowBattTooltip] = useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            if (isConnected) {
                await connectionManager.disconnect();
                setIsConnected(false);
                toast.info('Disconnected from DevKit');
            } else {
                await connectionManager.connect(connType, { host: wifiHost });
                setIsConnected(true);
                toast.success(`Connected via ${connType.toUpperCase()}`);
            }
            setIsMenuOpen(false);
        } catch (error) {
            console.error('[Connection Error]', error);
            toast.error(`Connection Error: ${error.message}`);
        } finally {
            setIsConnecting(false);
        }
    };

    const isAiView = view === 'ai';

    // Battery Telemetry Calculation
    const battVolts = telemetry?.v || 0;
    const battPct = telemetry?.pct !== undefined ? telemetry.pct : (telemetry?.b !== undefined ? telemetry.b : 0);
    const battMa = telemetry?.ma || 0;
    const battPower = telemetry?.p || 0;
    const isLowBatt = isConnected && battVolts > 4.5 && battVolts < 6.8;

    const getBattColor = () => {
        if (!isConnected) return 'var(--text-muted)';
        if (battPct > 50) return '#10b981'; // vibrant green
        if (battPct >= 20) return '#f59e0b'; // amber
        return '#ef4444'; // critical red
    };

    const battColor = getBattColor();

    return (
        <header className="glass" style={{
            margin: 'clamp(10px, 2vw, 20px)',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 'clamp(10px, 2vw, 20px)',
            zIndex: 100,
            overflow: 'visible'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => setView('store')}>
                <img 
                    src={theme === 'light' ? logoLight : logoDark} 
                    alt="TEN ROBOTICS" 
                    style={{ 
                        height: '40px', 
                        width: 'auto',
                        imageRendering: 'pixelated'
                    }} 
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="show-mobile-only">
                    <ThemeToggle />
                </div>
                {/* Mobile Menu Toggle */}
                <button
                    className="btn btn-secondary show-mobile-only"
                    style={{ padding: '8px', minWidth: '44px' }}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            <div className="hide-mobile" style={{ gap: '15px', alignItems: 'center', display: 'flex' }}>

                {/* Live Battery Telemetry Widget */}
                {isConnected && (
                    <div 
                        style={{ position: 'relative' }}
                        onMouseEnter={() => setShowBattTooltip(true)}
                        onMouseLeave={() => setShowBattTooltip(false)}
                    >
                        <Motion.div 
                            animate={isLowBatt ? { scale: [1, 1.05, 1] } : {}}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${isLowBatt ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                                padding: '6px 12px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                backdropFilter: 'blur(8px)'
                            }}
                        >
                            {/* Graphic Battery Cell */}
                            <div style={{
                                width: '24px',
                                height: '12px',
                                border: `1.5px solid ${battColor}`,
                                borderRadius: '3px',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '1px'
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${Math.max(4, Math.min(100, battPct))}%`,
                                    background: battColor,
                                    borderRadius: '1.5px',
                                    transition: 'width 0.4s ease, background-color 0.4s ease'
                                }} />
                                {/* Battery Terminal */}
                                <div style={{
                                    position: 'absolute',
                                    right: '-3.5px',
                                    top: '2.5px',
                                    width: '2px',
                                    height: '5px',
                                    background: battColor,
                                    borderRadius: '0 1px 1px 0'
                                }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: battColor }}>
                                        {battPct}%
                                    </span>
                                    {isLowBatt && <AlertTriangle size={12} color="#ef4444" />}
                                </div>
                                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                    {battVolts > 0 ? `${battVolts.toFixed(1)}V` : '2S Pack'}
                                </span>
                            </div>
                        </Motion.div>

                        {/* Interactive Battery Popover Tooltip */}
                        {showBattTooltip && (
                            <Motion.div 
                                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                style={{
                                    position: 'absolute',
                                    top: '110%',
                                    right: 0,
                                    width: '210px',
                                    background: 'var(--surface, #1e293b)',
                                    color: 'var(--text, #fff)',
                                    border: '1px solid rgba(255, 255, 255, 0.15)',
                                    borderRadius: '10px',
                                    padding: '12px',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
                                    zIndex: 200,
                                    fontSize: '0.75rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '6px',
                                    pointerEvents: 'none'
                                }}
                            >
                                <div style={{ fontWeight: '800', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px', color: battColor, display: 'flex', justifyContent: 'space-between' }}>
                                    <span>2S Li-ion Battery</span>
                                    <span>{battPct}%</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Pack Voltage:</span>
                                    <span style={{ fontWeight: '700' }}>{battVolts.toFixed(2)} V</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Current Draw:</span>
                                    <span style={{ fontWeight: '700' }}>{battMa ? `${battMa.toFixed(0)} mA` : 'N/A'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Power:</span>
                                    <span style={{ fontWeight: '700' }}>{battPower ? `${battPower.toFixed(2)} W` : '0.0 W'}</span>
                                </div>
                                {isLowBatt && (
                                    <div style={{ color: '#ef4444', fontWeight: '800', marginTop: '4px', fontSize: '0.7rem' }}>
                                        ⚠️ Low Battery: Please recharge!
                                    </div>
                                )}
                            </Motion.div>
                        )}
                    </div>
                )}

                {uploadProgress > 0 && (
                    <div style={{ position: 'relative', width: '100px', height: '10px', background: 'var(--surface-light)', borderRadius: '5px', overflow: 'hidden' }}>
                        <Motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress}%` }}
                            style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--secondary))' }}
                        />
                        <span style={{ position: 'absolute', top: '-5px', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', fontWeight: '800', mixBlendMode: 'difference', color: 'white' }}>
                            {uploadProgress}%
                        </span>
                    </div>
                )}

                <button
                    className={`btn ${view === 'ide' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={onOpenIde}
                    style={{
                        gap: '10px',
                        padding: '8px 16px',
                        boxShadow: view === 'ide' ? '0 0 20px rgba(var(--primary-rgb), 0.4)' : 'none'
                    }}
                >
                    <Blocks size={18} /> Block Code
                </button>
                <button
                    className={`btn ${isAiView ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setView(isAiView ? 'store' : 'ai')}
                    style={{
                        gap: '10px',
                        padding: '8px 16px',
                        boxShadow: isAiView ? '0 0 20px rgba(var(--primary-rgb), 0.4)' : 'none'
                    }}
                >
                    <Bot size={18} /> {isAiView ? 'Exit Assistant' : 'AI Assistant'}
                </button>
                <ThemeToggle />
                {!isConnected && (
                    <div className="glass" style={{ padding: '4px', display: 'flex', gap: '4px', borderRadius: '10px', background: 'var(--surface)' }}>
                        <button
                            className={`btn ${connType === 'serial' ? 'btn-primary' : ''}`}
                            style={{ padding: '8px', background: connType === 'serial' ? '' : 'transparent', minWidth: '40px' }}
                            onClick={() => setConnType('serial')}
                            title="Serial (USB)"
                        >
                            <Usb size={18} />
                        </button>
                        <button
                            className={`btn ${connType === 'bluetooth' ? 'btn-primary' : ''}`}
                            style={{ padding: '8px', background: connType === 'bluetooth' ? '' : 'transparent', minWidth: '40px' }}
                            onClick={() => setConnType('bluetooth')}
                            title="Bluetooth"
                        >
                            <Bluetooth size={18} />
                        </button>
                        <button
                            className={`btn ${connType === 'wifi' ? 'btn-primary' : ''}`}
                            style={{ padding: '8px', background: connType === 'wifi' ? '' : 'transparent', minWidth: '40px' }}
                            onClick={() => {
                                setConnType('wifi');
                                setShowSettings(!showSettings);
                            }}
                            title="WiFi (WebSockets / WebREPL)"
                        >
                            <Globe size={18} />
                        </button>
                    </div>
                )}

                {showSettings && connType === 'wifi' && !isConnected && (
                    <input
                        type="text"
                        value={wifiHost}
                        onChange={(e) => setWifiHost(e.target.value)}
                        placeholder="ESP32 IP"
                        className="glass"
                        style={{ padding: '8px 12px', border: 'none', color: 'white', width: '110px', borderRadius: '8px', fontSize: '0.8rem' }}
                    />
                )}

                <button
                    className={`btn ${isConnected ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleConnect}
                    disabled={isConnecting}
                >
                    {isConnecting ? (
                        'Connecting...'
                    ) : isConnected ? (
                        <><Wifi size={18} color="var(--success)" /> Connected</>
                    ) : (
                        <><Wifi size={18} /> Connect</>
                    )}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="glass fade-in" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '10px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    zIndex: 101,
                    background: 'var(--surface)'
                }}>
                    {isConnected && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px 14px',
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: '8px'
                        }}>
                            <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>DevKit Battery:</span>
                            <span style={{ fontWeight: '800', color: battColor }}>{battPct}% ({battVolts.toFixed(1)}V)</span>
                        </div>
                    )}

                    {!isConnected && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Connection Type:</p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button className={`btn ${connType === 'serial' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setConnType('serial')}>
                                    <Usb size={18} /> Serial
                                </button>
                                <button className={`btn ${connType === 'bluetooth' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setConnType('bluetooth')}>
                                    <Bluetooth size={18} /> BT
                                </button>
                                <button className={`btn ${connType === 'wifi' ? 'btn-primary' : 'btn-secondary'}`} style={{ flex: 1 }} onClick={() => setConnType('wifi')}>
                                    <Globe size={18} /> WiFi
                                </button>
                            </div>
                            {connType === 'wifi' && (
                                <input
                                    type="text"
                                    value={wifiHost}
                                    onChange={(e) => setWifiHost(e.target.value)}
                                    placeholder="ESP32 IP (e.g. 192.168.4.1)"
                                    className="glass"
                                    style={{ padding: '12px', border: 'none', color: 'white', width: '100%', borderRadius: '8px' }}
                                />
                            )}
                        </div>
                    )}
                    <button
                        className={`btn ${view === 'ide' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ width: '100%', gap: '10px' }}
                        onClick={() => {
                            onOpenIde();
                            setIsMenuOpen(false);
                        }}
                    >
                        <Blocks size={18} /> Block Code
                    </button>
                    <button
                        className={`btn ${isAiView ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ width: '100%', gap: '10px' }}
                        onClick={() => {
                            setView(isAiView ? 'store' : 'ai');
                            setIsMenuOpen(false);
                        }}
                    >
                        <Bot size={18} /> {isAiView ? 'Exit Assistant' : 'AI Assistant'}
                    </button>
                    <button
                        className={`btn ${isConnected ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ width: '100%' }}
                        onClick={handleConnect}
                        disabled={isConnecting}
                    >
                        {isConnecting ? 'Connecting...' : isConnected ? 'Disconnect' : 'Connect'}
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
