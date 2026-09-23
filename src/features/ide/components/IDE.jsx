import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, ArrowLeft, Bot, Sparkles, Terminal, Zap, BookOpen, ChevronDown, Code2, Copy, Check, FileCode, X, FolderOpen, Save, Edit3, RotateCcw, Download, Battery } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { connectionManager } from '../../../utils/ConnectionManager';
import { toast } from '../../../hooks/useToast';
import BlocklyEditor from './BlocklyEditor';
import AIAgent from '../../ai-agent/components/AIAgent';
import SerialTerminal from '../../../components/common/SerialTerminal';
import useAppStore from '../../../store/appStore';

const EXAMPLE_PROGRAMS = [
    { id: '01', name: "Blink LED", category: "Basics", desc: "Toggle digital GPIO pin ON and OFF", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">1</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">0</field><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></next></block></next></block></xml>' },
    { id: '02', name: "Motor Run", category: "Motors", desc: "Drive motor forward then stop", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">FWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value><next><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block></next></block></next></block></next></block></xml>' },
    { id: '03', name: "Sensor to OLED", category: "Display", desc: "Read analog sensor and print to screen", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_oled_clear"><next><block type="esp32_oled_print"><value name="TEXT"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="LINE"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value></block></next></block></next></block></next></block></xml>' },
    { id: '04', name: "Broadcast Data", category: "Wireless", desc: "ESP-NOW telemetry broadcast", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_broadcast"><value name="VAL"><block type="esp32_sensor_read"><field name="PORT">2</field></block></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></xml>' },
    { id: '05', name: "Servo Sweeper", category: "Motors", desc: "Sweep servo arm from 0° to 180°", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_servo"><field name="PIN">18</field><value name="ANGLE"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value><next><block type="esp32_servo"><field name="PIN">18</field><value name="ANGLE"><shadow type="math_number"><field name="NUM">180</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></next></block></next></block></xml>' },
    { id: '06', name: "Smart Fan", category: "Control", desc: "Trigger motor when sensor threshold met", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_if"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare"><field name="OP">GT</field><value name="A"><block type="esp32_sensor_read"><field name="PORT">1</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></value><statement name="DO0"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">FWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">100</field></shadow></value></block></statement><statement name="ELSE"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.2</field></shadow></value></block></next></block></next></block></xml>' },
    { id: '07', name: "Distance Warning", category: "Sensors", desc: "Alert when ultrasonic distance is low", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_if"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_ultrasonic_read"><field name="TRIG">4</field><field name="ECHO">15</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">20</field></shadow></value></block></value><statement name="DO0"><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">1</field></block></statement><statement name="ELSE"><block type="esp32_digital_write"><field name="PIN">4</field><field name="STATE">0</field></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.1</field></shadow></value></block></next></block></next></block></xml>' },
    { id: '08', name: "Obstacle Avoidance", category: "Robotics", desc: "Autonomous reverse and turn on obstacle", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_if"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare"><field name="OP">LT</field><value name="A"><block type="esp32_ultrasonic_read"><field name="TRIG">4</field><field name="ECHO">15</field></block></value><value name="B"><shadow type="math_number"><field name="NUM">30</field></shadow></value></block></value><statement name="DO0"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="esp32_motor"><field name="MOTOR">2</field><field name="DIR">STOP</field><value name="SPEED"><shadow type="math_number"><field name="NUM">0</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.5</field></shadow></value><next><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">BWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">1</field></shadow></value></block></next></block></next></block></next></block></next></block></statement><statement name="ELSE"><block type="esp32_motor"><field name="MOTOR">1</field><field name="DIR">FWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value><next><block type="esp32_motor"><field name="MOTOR">2</field><field name="DIR">FWD</field><value name="SPEED"><shadow type="math_number"><field name="NUM">80</field></shadow></value></block></next></block></statement><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">0.1</field></shadow></value></block></next></block></next></block></xml>' },
    { id: '09', name: "Full Screen Sensor", category: "Display", desc: "Full OLED real-time sensor monitor", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="controls_whileUntil"><field name="MODE">WHILE</field><value name="BOOL"><block type="logic_boolean"><field name="BOOL">TRUE</field></block></value><statement name="DO"><block type="esp32_oled_sensor_full"><field name="PORT">1</field><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">50</field></shadow></value></block></next></block></statement></block></next></block></xml>' },
    { id: '10', name: "Servo Center & Sweep", category: "Motors", desc: "Calibrate center then sweep smoothly", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_servo_center"><field name="PIN">1</field><next><block type="wait_ms"><value name="MS"><shadow type="math_number"><field name="NUM">500</field></shadow></value><next><block type="esp32_servo_sweep"><field name="PIN">1</field><field name="STEP">5</field><field name="DELAY">20</field><value name="START"><shadow type="math_number"><field name="NUM">0</field></shadow></value><value name="END"><shadow type="math_number"><field name="NUM">180</field></shadow></value></block></next></block></next></block></next></block></xml>' },
    { id: '11', name: "Stepper 1 Revolution", category: "Motors", desc: "Rotate stepper 360° precisely", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_stepper_degrees"><field name="DIR">CW</field><field name="DELAY">10</field><value name="DEGREES"><shadow type="math_number"><field name="NUM">360</field></shadow></value><next><block type="esp32_stepper_stop"></block></next></block></next></block></xml>' },
    { id: '12', name: "I2C Scan Devices", category: "System", desc: "Discover connected I2C peripherals", xml: '<xml><block type="robot_sketch" x="50" y="50"><next><block type="esp32_i2c_scan"><next><block type="wait_seconds"><value name="SECONDS"><shadow type="math_number"><field name="NUM">2</field></shadow></value></block></next></block></next></block></xml>' }
];

const ExampleDropdown = ({ onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = (item) => {
        setSelectedId(item.id);
        onSelect(item.xml);
        toast.success(`Loaded example: ${item.name}`);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: isOpen ? '#F1F5F9' : '#FFFFFF',
                    color: '#1E293B',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.82rem',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                    transition: 'all 0.15s ease'
                }}
            >
                <BookOpen size={14} color="#0284C7" />
                <span>Examples</span>
                <span style={{
                    background: '#E0F2FE',
                    color: '#0369A1',
                    fontSize: '0.68rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    fontWeight: '700'
                }}>
                    {EXAMPLE_PROGRAMS.length}
                </span>
                <ChevronDown
                    size={14}
                    color="#64748B"
                    style={{
                        transform: isOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                />
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: 0,
                        width: '320px',
                        background: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 16px 36px -4px rgba(15, 23, 42, 0.14), 0 4px 12px -2px rgba(15, 23, 42, 0.05)',
                        zIndex: 1000,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <div style={{
                        padding: '10px 14px',
                        background: '#F8FAFC',
                        borderBottom: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                            Starter Examples
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                            Click to load
                        </span>
                    </div>

                    <div style={{ maxHeight: '340px', overflowY: 'auto', padding: '6px' }}>
                        {EXAMPLE_PROGRAMS.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '8px 10px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    background: selectedId === item.id ? '#F0F9FF' : 'transparent',
                                    transition: 'all 0.12s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (selectedId !== item.id) e.currentTarget.style.background = '#F8FAFC';
                                }}
                                onMouseLeave={(e) => {
                                    if (selectedId !== item.id) e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <div style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '6px',
                                    background: '#E0F2FE',
                                    color: '#0284C7',
                                    fontSize: '0.72rem',
                                    fontWeight: '700',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {item.id}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                                        <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {item.name}
                                        </span>
                                        <span style={{
                                            fontSize: '0.65rem',
                                            fontWeight: '600',
                                            color: '#0284C7',
                                            background: '#F0F9FF',
                                            padding: '1px 6px',
                                            borderRadius: '4px',
                                            border: '1px solid #BAE6FD',
                                            flexShrink: 0
                                        }}>
                                            {item.category}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                                        {item.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const IDE = ({ project, onBack, isConnected, setView, uploadProgress = 0, onUpload, logs, onClearLogs }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [sidebarTab, setSidebarTab] = useState('preview'); // 'preview' or 'monitor'
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [sensorValue, setSensorValue] = useState(0);
    const [pythonCode, setPythonCode] = useState('');
    const [copied, setCopied] = useState(false);
    const [copiedLogs, setCopiedLogs] = useState(false);
    const [isPythonEditing, setIsPythonEditing] = useState(false);
    const [isCustomPython, setIsCustomPython] = useState(false);
    const editorRef = React.useRef(null);
    const lastSensorUpdate = React.useRef(0);
    const blocksFileInputRef = useRef(null);
    const pythonFileInputRef = useRef(null);
    const lastGeneratedCode = useRef('');

    const toggleSidebar = React.useCallback((tab) => {
        setIsSidebarOpen(prev => {
            if (prev && sidebarTab === tab) {
                return false;
            }
            setSidebarTab(tab);
            return true;
        });
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 50);
    }, [sidebarTab]);

    const handleCopyCode = React.useCallback(() => {
        if (pythonCode) {
            navigator.clipboard.writeText(pythonCode);
            setCopied(true);
            toast.success("Python code copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    }, [pythonCode]);

    const handleCopyLogs = React.useCallback(() => {
        if (logs && logs.length > 0) {
            const raw = logs.join('');
            const clean = raw.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            navigator.clipboard.writeText(clean);
            setCopiedLogs(true);
            toast.success("Serial logs copied to clipboard!");
            setTimeout(() => setCopiedLogs(false), 2000);
        } else {
            toast.error("No serial logs to copy!");
        }
    }, [logs]);

    const handleCodeChange = React.useCallback((code) => {
        lastGeneratedCode.current = code;
        if (!isCustomPython) {
            setPythonCode(code);
        }
    }, [isCustomPython]);

    // Save Blocks to XML file
    const handleSaveBlocks = React.useCallback(() => {
        if (!editorRef.current) return;
        const xml = editorRef.current.getXml ? editorRef.current.getXml() : '';
        if (!xml || xml.trim() === '') {
            toast.error("No blocks in workspace to save!");
            return;
        }
        const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const filename = (project?.title ? project.title.toLowerCase().replace(/\s+/g, '_') : 'robot_sketch') + '.xml';
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(`Saved blocks as ${filename}`);
    }, [project]);

    // Open Blocks from XML file
    const handleOpenBlocksFile = React.useCallback((event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const xmlContent = e.target?.result;
            if (xmlContent && editorRef.current) {
                editorRef.current.loadXml(xmlContent);
                toast.success(`Opened blocks: ${file.name}`);
                setIsCustomPython(false);
            }
        };
        reader.onerror = () => {
            toast.error("Failed to read blocks file!");
        };
        reader.readAsText(file);
        event.target.value = '';
    }, []);

    // Save Python to .py file
    const handleSavePython = React.useCallback(() => {
        if (!pythonCode || !pythonCode.trim()) {
            toast.error("No Python code to save!");
            return;
        }
        const blob = new Blob([pythonCode], { type: 'text/x-python;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'main.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Saved Python code as main.py");
    }, [pythonCode]);

    // Open Python file
    const handleOpenPythonFile = React.useCallback((event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const code = e.target?.result;
            if (code !== undefined) {
                setPythonCode(code);
                setIsCustomPython(true);
                setIsPythonEditing(true);
                toast.success(`Loaded ${file.name} into Python editor`);
            }
        };
        reader.onerror = () => {
            toast.error("Failed to read Python file!");
        };
        reader.readAsText(file);
        event.target.value = '';
    }, []);

    // Re-sync Python from Blockly
    const handleSyncFromBlocks = React.useCallback(() => {
        if (lastGeneratedCode.current) {
            setPythonCode(lastGeneratedCode.current);
            setIsCustomPython(false);
            toast.success("Re-synced code from Blockly workspace!");
        }
    }, []);

    // Python Textarea Tab handler
    const handlePythonKeyDown = React.useCallback((e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const val = e.target.value;
            const newCode = val.substring(0, start) + '    ' + val.substring(end);
            setPythonCode(newCode);
            setIsCustomPython(true);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
    }, []);

    const setModuleBlocks = useAppStore(s => s.setModuleBlocks);
    const moduleBlocks = useAppStore(s => s.moduleBlocks);
    const telemetry = useAppStore(s => s.telemetry);

    React.useEffect(() => {
        // Check if there are temporary module blocks to load
        if (moduleBlocks && editorRef.current) {
            console.log('[IDE] Loading temporary module blocks...');
            editorRef.current.loadXml(moduleBlocks);
            setModuleBlocks(null); // Clear after loading
        }
    }, [moduleBlocks, setModuleBlocks]);

    React.useEffect(() => {
        // Trigger resize events so Blockly recalculates dimensions perfectly once DOM and page animations settle
        const timer1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        const timer2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 850);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

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
        setSidebarTab('monitor');
        setIsSidebarOpen(true);
        if (pythonCode && pythonCode.trim()) {
            setIsUploading(true);
            try {
                if (onUpload) {
                    await onUpload(pythonCode);
                } else {
                    await connectionManager.uploadCode(pythonCode);
                }
                await connectionManager.runCode();
            } catch (err) {
                toast.error('Run failed: ' + err.message);
            } finally {
                setIsUploading(false);
            }
        } else {
            await connectionManager.runCode();
        }
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

        setSidebarTab('monitor');
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
            height: '100%',
            maxHeight: '100%',
            width: '100%',
            flex: 1,
            minHeight: 0,
            background: '#F8FAFC',
            color: '#0F172A',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            {/* TEN BLOCKS Header */}
            <div className="ide-header" style={{ flexShrink: 0 }}>
                <div className="ide-header-left">
                    <div onClick={onBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            background: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#475569',
                            transition: 'all 0.15s ease'
                        }}>
                            <ArrowLeft size={18} />
                        </div>
                        <h1 style={{ color: '#0F172A', margin: 0, fontSize: '1.25rem', fontWeight: '800', letterSpacing: '0.5px' }}>
                            TEN BLOCKS
                        </h1>
                    </div>
                </div>

                <div className="ide-header-right">
                    <ExampleDropdown
                        onSelect={(xml) => {
                            if (editorRef.current) {
                                editorRef.current.loadXml(xml);
                            }
                        }}
                    />

                    {/* Open & Save Blocks */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                            type="file"
                            ref={blocksFileInputRef}
                            accept=".xml,.blocks"
                            style={{ display: 'none' }}
                            onChange={handleOpenBlocksFile}
                        />
                        <button
                            onClick={() => blocksFileInputRef.current?.click()}
                            title="Open saved blocks file (.xml)"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#FFFFFF',
                                color: '#1E293B',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <FolderOpen size={14} color="#D97706" />
                            <span>Open Blocks</span>
                        </button>
                        <button
                            onClick={handleSaveBlocks}
                            title="Save workspace blocks (.xml)"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#FFFFFF',
                                color: '#1E293B',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Save size={14} color="#059669" />
                            <span>Save Blocks</span>
                        </button>
                    </div>

                    {/* Window Toggle Buttons: Show Code & Serial Monitor */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                            onClick={() => toggleSidebar('preview')}
                            title={isSidebarOpen && sidebarTab === 'preview' ? "Hide Code Window" : "Show Code Window"}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: isSidebarOpen && sidebarTab === 'preview' ? '1px solid #BAE6FD' : '1px solid #E2E8F0',
                                background: isSidebarOpen && sidebarTab === 'preview' ? '#E0F2FE' : '#FFFFFF',
                                color: isSidebarOpen && sidebarTab === 'preview' ? '#0284C7' : '#475569',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Code2 size={14} color={isSidebarOpen && sidebarTab === 'preview' ? '#0284C7' : '#64748B'} />
                            <span>Show Code</span>
                        </button>
                        <button
                            onClick={() => toggleSidebar('monitor')}
                            title={isSidebarOpen && sidebarTab === 'monitor' ? "Hide Serial Monitor" : "Show Serial Monitor"}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: isSidebarOpen && sidebarTab === 'monitor' ? '1px solid #BAE6FD' : '1px solid #E2E8F0',
                                background: isSidebarOpen && sidebarTab === 'monitor' ? '#E0F2FE' : '#FFFFFF',
                                color: isSidebarOpen && sidebarTab === 'monitor' ? '#0284C7' : '#475569',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Terminal size={14} color={isSidebarOpen && sidebarTab === 'monitor' ? '#0284C7' : '#64748B'} />
                            <span>Serial Monitor</span>
                        </button>
                    </div>

                    <div className="ide-header-actions">
                        <button 
                            onClick={handleStop} 
                            style={{ 
                                background: '#FEE2E2', 
                                color: '#DC2626', 
                                border: '1px solid #FECACA', 
                                padding: '6px 14px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontWeight: '700', 
                                fontSize: '0.82rem',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <div style={{ width: '8px', height: '8px', background: '#DC2626', borderRadius: '2px' }} /> STOP
                        </button>
                        <button 
                            onClick={handleRun} 
                            style={{ 
                                background: '#ECFDF5', 
                                color: '#059669', 
                                border: '1px solid #A7F3D0', 
                                padding: '6px 14px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontWeight: '700', 
                                fontSize: '0.82rem',
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '6px',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Play size={13} fill="#059669" color="#059669" /> RUN
                        </button>
                        <button 
                            onClick={() => handleUpload()} 
                            disabled={isUploading || uploadProgress > 0 || !isConnected}
                            style={{ 
                                background: 'linear-gradient(135deg, #0284C7, #0369A1)', 
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px', 
                                padding: '6px 16px', 
                                fontWeight: '700',
                                fontSize: '0.82rem',
                                cursor: (!isConnected || isUploading || uploadProgress > 0) ? 'not-allowed' : 'pointer',
                                opacity: (!isConnected || isUploading || uploadProgress > 0) ? 0.6 : 1,
                                boxShadow: (!isConnected || isUploading || uploadProgress > 0) ? 'none' : '0 2px 6px rgba(2, 132, 199, 0.25)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Zap size={14} />
                            {uploadProgress > 0 ? `UPLOADING ${uploadProgress}%` : (isUploading ? 'UPLOADING...' : 'SEND TO ROBOT')}
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden', padding: '8px', minHeight: 0, height: '100%', boxSizing: 'border-box' }}>
                {/* Full Blockly Workspace Area */}
                <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)', background: 'white', width: '100%', height: '100%', minHeight: 0 }}>
                    <BlocklyEditor ref={editorRef} project={project} onCodeChange={handleCodeChange} />
                </div>

                {/* Apple Notebook Floating Window with AnimatePresence */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsSidebarOpen(false)}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'rgba(15, 23, 42, 0.4)',
                                backdropFilter: 'blur(8px)',
                                WebkitBackdropFilter: 'blur(8px)',
                                padding: '16px',
                                boxSizing: 'border-box',
                                overflow: 'hidden'
                            }}
                        >
                            <Motion.div
                                initial={{ opacity: 0, scale: 0.90, y: 35, rotateX: 6 }}
                                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 360,
                                    damping: 26,
                                    mass: 0.85
                                }}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    width: isMaximized ? 'calc(100% - 16px)' : 'min(860px, calc(100% - 24px))',
                                    height: isMaximized ? 'calc(100% - 16px)' : 'min(500px, calc(100% - 28px))',
                                    maxWidth: 'calc(100% - 16px)',
                                    maxHeight: 'calc(100% - 20px)',
                                    background: '#FFFFFF',
                                    borderRadius: '16px',
                                    boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    transition: 'width 0.2s ease, height 0.2s ease'
                                }}
                            >
                                {/* Apple macOS Window Titlebar */}
                                <div style={{
                                    height: '46px',
                                    background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
                                    borderBottom: '1px solid #E2E8F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0 16px',
                                    userSelect: 'none',
                                    flexShrink: 0
                                }}>
                                    {/* Indian Flag Colors Traffic Light Buttons */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px' }}>
                                        {/* Saffron / Kesari */}
                                        <div
                                            onClick={() => setIsSidebarOpen(false)}
                                            title="Close (Saffron)"
                                            style={{
                                                width: '13px',
                                                height: '13px',
                                                borderRadius: '50%',
                                                background: '#FF9933',
                                                border: '1px solid #E67E22',
                                                cursor: 'pointer',
                                                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
                                                transition: 'transform 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.18)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                        />
                                        {/* White with 24-Spoke Ashoka Chakra Navy Blue Wheel */}
                                        <div
                                            onClick={() => setIsSidebarOpen(false)}
                                            title="Minimize (Ashoka Chakra 24-Spoke Wheel)"
                                            style={{
                                                width: '13px',
                                                height: '13px',
                                                borderRadius: '50%',
                                                background: '#FFFFFF',
                                                cursor: 'pointer',
                                                boxShadow: '0 0 0 1px #000080, inset 0 0 1px rgba(0,0,128,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'transform 0.15s ease',
                                                overflow: 'hidden'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.18)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                        >
                                            <svg width="13" height="13" viewBox="0 0 24 24" style={{ display: 'block' }}>
                                                <circle cx="12" cy="12" r="10.5" fill="#FFFFFF" stroke="#000080" strokeWidth="1.6" />
                                                <circle cx="12" cy="12" r="2.4" fill="#000080" />
                                                {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => (
                                                    <line
                                                        key={deg}
                                                        x1="12"
                                                        y1="12"
                                                        x2={12 + 10.5 * Math.cos((deg * Math.PI) / 180)}
                                                        y2={12 + 10.5 * Math.sin((deg * Math.PI) / 180)}
                                                        stroke="#000080"
                                                        strokeWidth="1"
                                                    />
                                                ))}
                                                <circle cx="12" cy="12" r="4.2" fill="none" stroke="#000080" strokeWidth="0.8" />
                                            </svg>
                                        </div>
                                        {/* India Green */}
                                        <div
                                            onClick={() => setIsMaximized(!isMaximized)}
                                            title={isMaximized ? "Restore Size (Green)" : "Maximize Window (Green)"}
                                            style={{
                                                width: '13px',
                                                height: '13px',
                                                borderRadius: '50%',
                                                background: '#138808',
                                                border: '1px solid #0D5C06',
                                                cursor: 'pointer',
                                                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)',
                                                transition: 'transform 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.18)'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                                        />
                                    </div>

                                    {/* Center: Apple Pill Segmented Switcher */}
                                    <div style={{
                                        display: 'flex',
                                        background: '#E2E8F0',
                                        padding: '3px',
                                        borderRadius: '999px',
                                        gap: '2px'
                                    }}>
                                        <button
                                            onClick={() => setSidebarTab('preview')}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '5px 16px',
                                                borderRadius: '999px',
                                                border: 'none',
                                                background: sidebarTab === 'preview' ? '#FFFFFF' : 'transparent',
                                                color: sidebarTab === 'preview' ? '#0F172A' : '#64748B',
                                                boxShadow: sidebarTab === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                                fontSize: '0.78rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <Code2 size={14} color={sidebarTab === 'preview' ? '#0284C7' : '#64748B'} />
                                            <span>Python Notebook</span>
                                        </button>
                                        <button
                                            onClick={() => setSidebarTab('monitor')}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                padding: '5px 16px',
                                                borderRadius: '999px',
                                                border: 'none',
                                                background: sidebarTab === 'monitor' ? '#FFFFFF' : 'transparent',
                                                color: sidebarTab === 'monitor' ? '#0F172A' : '#64748B',
                                                boxShadow: sidebarTab === 'monitor' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                                fontSize: '0.78rem',
                                                fontWeight: '700',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                        >
                                            <Terminal size={14} color={sidebarTab === 'monitor' ? '#0284C7' : '#64748B'} />
                                            <span>Serial Monitor</span>
                                        </button>
                                    </div>

                                    {/* Right Actions */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px', justifyContent: 'flex-end' }}>
                                        {/* Battery Percentage Only - Kept strictly on Serial Monitor */}
                                        {sidebarTab === 'monitor' && (
                                            <div
                                                title={telemetry?.v ? `Battery: ${telemetry?.pct ?? 0}% (${telemetry.v.toFixed(2)}V)` : `Battery: ${telemetry?.pct ?? 0}%`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '4px 10px',
                                                    borderRadius: '999px',
                                                    background: '#FFFFFF',
                                                    border: '1px solid #E2E8F0',
                                                    fontSize: '0.74rem',
                                                    fontWeight: '700',
                                                    color: (telemetry?.pct ?? 0) > 20 ? '#059669' : '#DC2626',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                                                }}
                                            >
                                                <Battery size={14} color={(telemetry?.pct ?? 0) > 20 ? '#059669' : '#DC2626'} />
                                                <span>{(telemetry?.pct !== undefined && telemetry?.pct > 0) ? `${telemetry.pct}%` : (isConnected ? '100%' : '0%')}</span>
                                            </div>
                                        )}

                                        {/* Copy button - Kept strictly on Serial Monitor */}
                                        {sidebarTab === 'monitor' && (
                                            <button
                                                onClick={handleCopyLogs}
                                                title="Copy Serial Monitor Output"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    background: copiedLogs ? '#DCFCE7' : '#FFFFFF',
                                                    color: copiedLogs ? '#15803D' : '#475569',
                                                    border: '1px solid #E2E8F0',
                                                    borderRadius: '6px',
                                                    padding: '4px 10px',
                                                    fontSize: '0.74rem',
                                                    fontWeight: '600',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {copiedLogs ? <Check size={12} color="#15803D" /> : <Copy size={12} />}
                                                <span>{copiedLogs ? 'Copied' : 'Copy'}</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setIsSidebarOpen(false)}
                                            title="Close Notebook"
                                            style={{
                                                width: '26px',
                                                height: '26px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#64748B',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#E2E8F0'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                </div>

                                {/* Notebook Content */}
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                                    {sidebarTab === 'preview' ? (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0F172A', overflow: 'hidden', minHeight: 0 }}>
                                            {/* Subheader info bar */}
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '7px 16px',
                                                background: '#1E293B',
                                                borderBottom: '1px solid #334155',
                                                fontSize: '0.74rem',
                                                color: '#94A3B8',
                                                flexWrap: 'wrap',
                                                gap: '8px'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <FileCode size={13} color="#38BDF8" />
                                                    <span style={{ color: '#F1F5F9', fontFamily: 'monospace', fontWeight: '600' }}>
                                                        main.py
                                                    </span>
                                                    <span style={{
                                                        fontSize: '0.64rem',
                                                        fontWeight: '700',
                                                        color: '#38BDF8',
                                                        background: 'rgba(56, 189, 248, 0.12)',
                                                        padding: '1px 6px',
                                                        borderRadius: '4px',
                                                        border: '1px solid rgba(56, 189, 248, 0.25)'
                                                    }}>
                                                        MicroPython
                                                    </span>
                                                    {isCustomPython ? (
                                                        <span style={{
                                                            fontSize: '0.64rem',
                                                            fontWeight: '700',
                                                            color: '#F59E0B',
                                                            background: 'rgba(245, 158, 11, 0.15)',
                                                            padding: '1px 6px',
                                                            borderRadius: '4px',
                                                            border: '1px solid rgba(245, 158, 11, 0.3)'
                                                        }}>
                                                            ✏️ Custom (Edited)
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            fontSize: '0.64rem',
                                                            fontWeight: '700',
                                                            color: '#10B981',
                                                            background: 'rgba(16, 185, 129, 0.15)',
                                                            padding: '1px 6px',
                                                            borderRadius: '4px',
                                                            border: '1px solid rgba(16, 185, 129, 0.3)'
                                                        }}>
                                                            ⚡ Auto-Synced
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Python Editor Actions: Open, Save, Edit, Sync, Copy */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <input
                                                        type="file"
                                                        ref={pythonFileInputRef}
                                                        accept=".py,.txt"
                                                        style={{ display: 'none' }}
                                                        onChange={handleOpenPythonFile}
                                                    />
                                                    <button
                                                        onClick={() => pythonFileInputRef.current?.click()}
                                                        title="Open .py file"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            background: '#0F172A',
                                                            color: '#94A3B8',
                                                            border: '1px solid #334155',
                                                            borderRadius: '5px',
                                                            padding: '3px 8px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <FolderOpen size={12} color="#D97706" />
                                                        <span>Open</span>
                                                    </button>
                                                    <button
                                                        onClick={handleSavePython}
                                                        title="Save Python code as main.py"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            background: '#0F172A',
                                                            color: '#94A3B8',
                                                            border: '1px solid #334155',
                                                            borderRadius: '5px',
                                                            padding: '3px 8px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Download size={12} color="#059669" />
                                                        <span>Save</span>
                                                    </button>
                                                    <button
                                                        onClick={() => setIsPythonEditing(!isPythonEditing)}
                                                        title={isPythonEditing ? "Lock Editor (Read-Only)" : "Unlock for Direct Python Editing"}
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            background: isPythonEditing ? 'rgba(56, 189, 248, 0.2)' : '#0F172A',
                                                            color: isPythonEditing ? '#38BDF8' : '#94A3B8',
                                                            border: isPythonEditing ? '1px solid #38BDF8' : '1px solid #334155',
                                                            borderRadius: '5px',
                                                            padding: '3px 8px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        <Edit3 size={12} color={isPythonEditing ? '#38BDF8' : '#94A3B8'} />
                                                        <span>{isPythonEditing ? 'Editing' : 'Edit'}</span>
                                                    </button>
                                                    {isCustomPython && (
                                                        <button
                                                            onClick={handleSyncFromBlocks}
                                                            title="Discard manual edits and sync from Blockly"
                                                            style={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                background: '#0F172A',
                                                                color: '#F59E0B',
                                                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                                                borderRadius: '5px',
                                                                padding: '3px 8px',
                                                                fontSize: '0.7rem',
                                                                fontWeight: '600',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <RotateCcw size={12} />
                                                            <span>Sync Blocks</span>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={handleCopyCode}
                                                        title="Copy Python Code"
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px',
                                                            background: copied ? '#064E3B' : '#0F172A',
                                                            color: copied ? '#34D399' : '#94A3B8',
                                                            border: copied ? '1px solid #059669' : '1px solid #334155',
                                                            borderRadius: '5px',
                                                            padding: '3px 8px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {copied ? <Check size={12} /> : <Copy size={12} />}
                                                        <span>{copied ? 'Copied' : 'Copy'}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Code Editor Body with Line Numbers */}
                                            <div style={{
                                                flex: 1,
                                                overflowY: 'auto',
                                                padding: '12px 0',
                                                fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', Menlo, Consolas, monospace",
                                                fontSize: '0.84rem',
                                                lineHeight: '1.65',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                {!pythonCode ? (
                                                    <div style={{ padding: '40px 20px', color: '#64748B', fontStyle: 'italic', textAlign: 'center' }}>
                                                        # Drag blocks onto workspace or open a Python file to start coding...
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', minWidth: '100%', flex: 1 }}>
                                                        <div style={{
                                                            padding: '0 12px 0 16px',
                                                            color: '#475569',
                                                            textAlign: 'right',
                                                            userSelect: 'none',
                                                            fontSize: '0.76rem',
                                                            lineHeight: '1.65',
                                                            borderRight: '1px solid #1E293B',
                                                            minWidth: '38px',
                                                            flexShrink: 0
                                                        }}>
                                                            {pythonCode.split('\n').map((_, idx) => (
                                                                <div key={idx}>{idx + 1}</div>
                                                            ))}
                                                        </div>
                                                        {isPythonEditing ? (
                                                            <textarea
                                                                value={pythonCode}
                                                                onChange={(e) => {
                                                                    setPythonCode(e.target.value);
                                                                    setIsCustomPython(true);
                                                                }}
                                                                onKeyDown={handlePythonKeyDown}
                                                                spellCheck={false}
                                                                style={{
                                                                    flex: 1,
                                                                    margin: 0,
                                                                    padding: '0 18px',
                                                                    color: '#38BDF8',
                                                                    fontSize: '0.84rem',
                                                                    lineHeight: '1.65',
                                                                    fontFamily: 'inherit',
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    outline: 'none',
                                                                    resize: 'none',
                                                                    whiteSpace: 'pre',
                                                                    overflowX: 'auto',
                                                                    tabSize: 4
                                                                }}
                                                            />
                                                        ) : (
                                                            <pre style={{
                                                                margin: 0,
                                                                padding: '0 18px',
                                                                color: '#E2E8F0',
                                                                fontSize: '0.84rem',
                                                                lineHeight: '1.65',
                                                                fontFamily: 'inherit',
                                                                whiteSpace: 'pre',
                                                                overflowX: 'auto',
                                                                flex: 1
                                                            }}>
                                                                <code>{pythonCode}</code>
                                                            </pre>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#0F172A', overflow: 'hidden', minHeight: 0 }}>
                                            {/* Embedded Serial Terminal */}
                                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
                                                <SerialTerminal logs={logs} onClear={onClearLogs} isEmbedded={true} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Motion.div>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default IDE;
