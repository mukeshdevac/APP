import React, { useState } from 'react';
import { Play, ArrowLeft, Bot, Sparkles, Terminal } from 'lucide-react';
import { connectionManager } from '../../../utils/ConnectionManager';
import { toast } from '../../../hooks/useToast';
import BlocklyEditor from './BlocklyEditor';
import AIAgent from '../../ai-agent/components/AIAgent';
import SerialTerminal from '../../../components/common/SerialTerminal';
import useAppStore from '../../../store/appStore';

import mascot from '../../../assets/mascot.png';

const EXAMPLE_PROGRAMS = [
    { name: "1. Blink LED", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">1</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">0</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></next></block></next></block></xml>' },
    { name: "2. Motor Run", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">FWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block></next></block></next></block></next></block></xml>' },
    { name: "3. Sensor to OLED", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_oled_clear"><next><block type="esp32_oled_print"><value name="TEXT"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value></block></next></block></next></block></next></block></xml>' },
    { name: "4. Broadcast Data", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_broadcast"><value name="VAL"><block type="esp32_sensor_read"><field name="PORT">2</field></block></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></xml>' },
    { name: "5. Servo Sweeper", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_servo"><field name="PIN">18</field><value name="ANGLE"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_servo"><field name="PIN">18</field><value name="ANGLE"><shadow type="math_number"><field name="NUM">180</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></next></block></next></block></xml>' },
    { name: "6. Smart Fan (Control)", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_if"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare"><field name="OP">GT</field><value name="A"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></value><statement name="DO0"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">FWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block></statement><statement name="ELSE"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.2</field></shadow></value></block></next></block></next></block></xml>' },
    { name: "7. Distance Warning", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_if"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_ultrasonic_read"><field name="TRIG">4</field><field name="ECHO">15</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">20</field></shadow></value></block></value><statement name="DO0"><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">1</field></block></statement><statement name="ELSE"><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">0</field></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.1</field></shadow></value></block></next></block></next></block></xml>' },
    { name: "8. Obstacle Avoidance", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_if"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_ultrasonic_read"><field name="TRIG">4</field><field name="ECHO">15</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></value><statement name="DO0"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="esp32_motor"><field name="MOTOR">2</field><field name="DIR">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value><next><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">BWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></next></block></next></block></statement><statement name="ELSE"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">FWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><next><block type="esp32_motor"><field name="MOTOR">2</field><field name="DIR">FWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value></block></next></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.1</field></shadow></value></block></next></block></next></block></xml>' },
    { name: "9. Full Screen Sensor", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="esp32_oled_sensor_full"><field name="PORT">1</field><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></next></block></statement></block></next></block></xml>' },
    { name: "10. Servo Center & Sweep", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_servo_center"><field name="PIN">1</field><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">500</field></shadow></value><next><block type="esp32_servo_sweep"><field name="PIN">1</field><field name="STEP">5</field><field name="DELAY">20</field><value name="START"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="END"><shadow type="math_number"><field name="NUM">180</field></shadow></value></block></next></block></next></block></next></block></xml>' },
    { name: "11. Stepper 1 Revolution", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_stepper_degrees"><field name="DIR">CW</field><field name="DELAY">10</field><value name="DEGREES"><shadow type="math_number"><field name="NUM">360</field></shadow></value><next><block type="esp32_stepper_stop"></block></next></block></next></block></xml>' },
    { name: "12. I2C Scan Devices", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_i2c_scan"><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></next></block></xml>' }
];

const IDE = ({ project, onBack, isConnected, setView, uploadProgress = 0, onUpload, logs, onClearLogs }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [sidebarTab, setSidebarTab] = useState('preview'); // 'preview' or 'monitor'
    const [sensorValue, setSensorValue] = useState(0);
    const [pythonCode, setPythonCode] = useState('');
    const editorRef = React.useRef(null);
    const lastSensorUpdate = React.useRef(0);

    const handleCodeChange = React.useCallback((code) => {
        setPythonCode(code);
    }, []);

    const setModuleBlocks = useAppStore(s => s.setModuleBlocks);
    const moduleBlocks = useAppStore(s => s.moduleBlocks);

    React.useEffect(() => {
        // Check if there are temporary module blocks to load
        if (moduleBlocks && editorRef.current) {
            console.log('[IDE] Loading temporary module blocks...');
            editorRef.current.loadXml(moduleBlocks);
            setModuleBlocks(null); // Clear after loading
        }
    }, [moduleBlocks, setModuleBlocks]);

    React.useEffect(() => {
        connectionManager.onSensorUpdate = (val) => {
            const now = Date.now();
            if (now - lastSensorUpdate.current > 100) { // Throttle to 10Hz
                setSensorValue(val);
                lastSensorUpdate.current = now;
            }
        };

        const handleGlobalTrigger = () => {
            handleUpload();
        };
        window.addEventListener('GLOBAL_UPLOAD_TRIGGER', handleGlobalTrigger);

        return () => {
            connectionManager.onSensorUpdate = null;
            window.removeEventListener('GLOBAL_UPLOAD_TRIGGER', handleGlobalTrigger);
        };
    }, []);

    const handleRun = async () => {
        if (!isConnected) { toast.error('Connect your ESP32 first!'); return; }
        await connectionManager.runCode();
    };

    const handleStop = async () => {
        if (!isConnected) { toast.error('Connect your ESP32 first!'); return; }
        await connectionManager.stopCode();
    };

    const handleUpload = async (codeOverride = null) => {
        const codeToUpload = codeOverride || pythonCode;

        if (!isConnected) {
            toast.error('Please connect your ESP32 first!');
            return;
        }

        if (onUpload) {
            onUpload(codeToUpload);
        } else {
            setIsUploading(true);
            try {
                await connectionManager.uploadCode(codeToUpload);
                toast.success('Code uploaded successfully!');
            } catch (error) {
                toast.error('Upload failed: ' + error.message);
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <div className="ten-blocks-theme" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            background: 'var(--background)',
            color: 'var(--text)',
            overflow: 'hidden'
        }}>
            {/* TEN BLOCKS Header */}
            <div className="ide-header">
                <div className="ide-header-left">
                    <div onClick={onBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ArrowLeft size={24} color="white" />
                        <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px' }}>TEN BLOCKS</h1>
                    </div>
                    
                    <div className="ide-header-badge">
                        {project?.title || 'Untitled Space Mission'}
                    </div>
                </div>

                <div className="ide-header-right">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', fontSize: '0.8rem' }}>
                        <span>Examples:</span>
                        <select
                            onChange={(e) => {
                                const xml = e.target.value;
                                if (xml && editorRef.current) {
                                    // Remove window.confirm as it can be blocked or cause issues in some environments
                                    editorRef.current.loadXml(xml);
                                    e.target.value = "";
                                }
                            }}
                            style={{
                                background: 'white',
                                color: '#333',
                                border: 'none',
                                borderRadius: '15px',
                                padding: '4px 12px',
                                outline: 'none',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            <option value="">Choose a program...</option>
                            {EXAMPLE_PROGRAMS.map((prog, i) => (
                                <option key={i} value={prog.xml}>{prog.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="ide-header-actions">
                        <button onClick={handleStop} style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                             <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '2px' }} /> STOP
                        </button>
                        <button onClick={handleRun} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Play size={14} fill="white" /> RUN
                        </button>
                        <button 
                            className="btn-primary" 
                            onClick={() => handleUpload()} 
                            disabled={isUploading || uploadProgress > 0 || !isConnected}
                            style={{ borderRadius: '8px', padding: '8px 16px', boxShadow: 'none' }}
                        >
                            {uploadProgress > 0 ? `UPLOADING ${uploadProgress}%` : (isUploading ? 'UPLOADING...' : 'SEND TO ROBOT')}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden', padding: '10px', gap: '10px' }}>
                {/* IDE Core Area */}
                <div className="ide-grid" style={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gridTemplateRows: '1fr 180px',
                    gap: '10px',
                    width: '100%'
                }}>
                    <style>{`
                        @media (min-width: 1024px) {
                            .ide-grid {
                                grid-template-columns: 1fr 340px !important;
                                grid-template-rows: 1fr !important;
                            }
                        }
                        
                        /* Custom Blockly Toolbox Styling */
                        .blocklyToolboxDiv {
                            background-color: #f0f0f0 !important;
                            border-right: 1px solid #ddd !important;
                            width: 80px !important;
                        }
                        .blocklyTreeRow {
                            height: 70px !important;
                            margin: 5px 0 !important;
                            display: flex !important;
                            flex-direction: column !important;
                            align-items: center !important;
                            justify-content: center !important;
                            text-align: center !important;
                            border: none !important;
                            cursor: pointer !important;
                        }
                        .blocklyTreeLabel {
                            font-size: 10px !important;
                            font-weight: 800 !important;
                            margin-top: 4px !important;
                            color: #333 !important;
                        }
                        .blocklyTreeIcon {
                            width: 24px !important;
                            height: 24px !important;
                            margin: 0 !important;
                        }

                    `}</style>

                    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '4px solid rgba(255,255,255,0.3)', background: 'white' }}>
                        <BlocklyEditor ref={editorRef} project={project} onCodeChange={handleCodeChange} />
                        
                        {/* Robot Mascot in Workspace */}
                        <div style={{
                            position: 'absolute',
                            bottom: '20px',
                            right: '280px', // Adjust to not overlap with preview
                            zIndex: 5,
                            pointerEvents: 'none',
                            opacity: 0.8
                        }}>
                             <img src={mascot} alt="Mascot" style={{ height: '100px', width: 'auto' }} />
                        </div>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        overflow: 'hidden', 
                        borderRadius: '12px', 
                        background: 'white',
                        border: '4px solid rgba(255,255,255,0.3)'
                    }}>
                        <div style={{
                            padding: '4px',
                            background: '#eee',
                            display: 'flex',
                            gap: '4px',
                            borderBottom: '1px solid #ddd'
                        }}>
                            <button
                                onClick={() => setSidebarTab('preview')}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: sidebarTab === 'preview' ? '#0088cc' : 'transparent',
                                    color: sidebarTab === 'preview' ? 'white' : '#666',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    cursor: 'pointer'
                                }}
                            >
                                SHOW CODE
                            </button>
                            <button
                                onClick={() => setSidebarTab('monitor')}
                                style={{
                                    flex: 1,
                                    padding: '8px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: sidebarTab === 'monitor' ? '#0088cc' : 'transparent',
                                    color: sidebarTab === 'monitor' ? 'white' : '#666',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    cursor: 'pointer'
                                }}
                            >
                                MONITOR
                            </button>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: '#f8f8f8' }}>
                            {sidebarTab === 'preview' ? (
                                <div style={{ flex: 1, padding: '1rem', margin: 0, color: '#333', fontSize: '0.85rem', overflowY: 'auto', fontFamily: 'monospace', lineHeight: '1.5' }}>
                                    {!pythonCode ? (
                                        <span style={{ color: '#999' }}># Start dragging blocks...</span>
                                    ) : (
                                        <div style={{ whiteSpace: 'pre', background: '#fff', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                                            {pythonCode}
                                        </div>
                                    )}
                                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                        <img src={mascot} alt="Mascot" style={{ height: '80px', width: 'auto' }} />
                                    </div>
                                </div>
                            ) : (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    {/* Telemetry Display */}
                                    <div style={{ padding: '15px', background: 'white', borderBottom: '1px solid #ddd' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: '#0088cc' }}>
                                            <span>ROBOT SENSORS</span>
                                            <span>{sensorValue}%</span>
                                        </div>
                                        <div style={{ height: '12px', background: '#eee', borderRadius: '6px', overflow: 'hidden' }}>
                                            <div style={{
                                                height: '100%',
                                                width: `${sensorValue}%`,
                                                background: '#2ecc71',
                                                transition: 'width 0.2s'
                                            }} />
                                        </div>
                                    </div>
                                    <SerialTerminal logs={logs} onClear={onClearLogs} isEmbedded={true} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IDE;
