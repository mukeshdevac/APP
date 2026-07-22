import React, { useState, useRef, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Terminal, Cpu, Play, Square, Trash2, X, MessageSquare, Code } from 'lucide-react';
import { generateAiCode } from '../services/aiService';
import { connectionManager } from '../../../utils/ConnectionManager';
import { toast } from '../../../hooks/useToast';

const AIAgent = ({ onUpload, onClose, isEmbedded = false, isConnected = false, uploadProgress = 0 }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hello! I'm your TEN ROBOTICS AI. Describe what you want to build (e.g., 'Make a distance sensor radar') and I'll generate the code for you!" }
    ]);
    const [input, setInput] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isDevMode, setIsDevMode] = useState(false);
    const [editableCode, setEditableCode] = useState('');
    const [syntaxError, setSyntaxError] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }

        const handleGlobalTrigger = () => {
            if (editableCode || generatedCode) {
                onUpload(editableCode || generatedCode);
            }
        };
        window.addEventListener('GLOBAL_UPLOAD_TRIGGER', handleGlobalTrigger);

        return () => {
            window.removeEventListener('GLOBAL_UPLOAD_TRIGGER', handleGlobalTrigger);
        };
    }, [messages, isThinking, editableCode, generatedCode]);

    const validatePythonSyntax = (code) => {
        // Basic heuristic syntax validation
        try {
            // Check for basic indentation consistency
            const lines = code.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                // Mismatched brackets
                const openBrackets = (code.match(/[([{]/g) || []).length;
                const closeBrackets = (code.match(/[)\]}]/g) || []).length;
                if (openBrackets !== closeBrackets) {
                    return "Mismatched brackets: Check your parentheses, square brackets, and curly braces.";
                }

                // Check for colon at end of lines that expect it (def, if, while, for, class, try, except)
                const needsColon = /^(def|if|elif|else|while|for|class|try|except|finally)/;
                if (needsColon.test(lines[i].trim()) && !lines[i].trim().endsWith(':')) {
                    return `Line ${i + 1}: Missing colon after "${lines[i].trim().split(' ')[0]}" statement.`;
                }
            }
            return null;
        } catch {
            return "Syntax error detected.";
        }
    };

    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        setEditableCode(newCode);
        setSyntaxError(validatePythonSyntax(newCode));
    };

    const handleRun = async () => {
        if (!isConnected) { toast.error('Connect your ESP32 first!'); return; }
        await connectionManager.runCode();
    };

    const handleStop = async () => {
        if (!isConnected) { toast.error('Connect your ESP32 first!'); return; }
        await connectionManager.stopCode();
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsThinking(true);

        try {
            // Pass history to AI service
            const response = await generateAiCode(userMsg, messages);

            // Parser for structured response
            const talkMatch = response.match(/\[TALK\](.*?)\[\/TALK\]/s);
            const wiringMatch = response.match(/\[WIRING\](.*?)\[\/WIRING\]/s);
            const codeMatch = response.match(/\[CODE\](.*?)\[\/CODE\]/s);

            // Fallback for raw markdown code blocks
            const markdownCodeMatch = response.match(/```python\s*(.*?)\s*```/s) || response.match(/```\s*(.*?)\s*```/s);

            const talkText = talkMatch ? talkMatch[1].trim() : "";
            const wiringText = wiringMatch ? wiringMatch[1].trim() : "";
            const codeText = codeMatch ? codeMatch[1].trim() : (markdownCodeMatch ? markdownCodeMatch[1].trim() : "");

            // Combine talk and wiring for the chat bubble
            let displayMsg = talkText;
            if (wiringText) {
                displayMsg += `\n\n📌 **WIRING INSTRUCTIONS:**\n${wiringText}`;
            }

            // If no structure found, use whole response as text
            if (!talkText && !wiringText && !codeText) {
                displayMsg = response;
            }

            if (codeText) {
                setGeneratedCode(codeText);
                setEditableCode(codeText);
                setSyntaxError(null);
                setIsDevMode(false);
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                text: displayMsg || "I've processed your request. How else can I help?",
                hasCode: !!codeText
            }]);
        } catch (error) {
            console.error('[AI Assistant Error]', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: `I encountered an error: ${error.message}. Please check your Gemini API key and internet connection.`,
                hasCode: false
            }]);
        } finally {
            setIsThinking(false);
        }
    };

    const suggestions = [
        "Distance sensor radar",
        "Servo move on button press",
        "OLED custom greeting",
        "RGB rainbow cycle"
    ];

    return (
        <Motion.div
            initial={isEmbedded ? {} : { opacity: 0, scale: 0.8, y: 100, rotateX: -20 }}
            animate={isEmbedded ? {} : { opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={isEmbedded ? {} : { opacity: 0, scale: 0.8, y: 100, rotateX: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={isEmbedded ? "preserve-3d" : "glass preserve-3d"}
            style={{
                width: '100%',
                maxWidth: isEmbedded ? 'none' : '600px',
                height: isEmbedded ? '100%' : '450px',
                display: 'flex',
                flexDirection: 'column',
                background: isEmbedded ? 'transparent' : 'var(--glass)',
                backdropFilter: isEmbedded ? 'none' : 'blur(40px) saturate(200%)',
                zIndex: isEmbedded ? 1 : 2100,
                borderRadius: isEmbedded ? '0' : '32px',
                border: isEmbedded ? 'none' : '1px solid var(--border)',
                boxShadow: isEmbedded ? 'none' : '0 30px 100px rgba(0,0,0,0.6)',
                overflow: 'hidden',
                margin: isEmbedded ? '0' : '10px'
            }}
        >
            {/* Header */}
            <div style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.02)',
                transformStyle: 'preserve-3d'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', transform: 'translateZ(30px)' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))',
                        padding: '10px',
                        borderRadius: '12px',
                        display: 'flex',
                        boxShadow: '0 0 25px rgba(var(--primary-rgb), 0.4)'
                    }}>
                        <Bot size={22} color="white" />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '1.1rem', margin: 0, fontWeight: '800' }}>Project Assistant</h3>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 'bold' }}>
                            <div style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%', boxShadow: '0 0 10px currentColor' }} /> AI Online
                        </span>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="btn btn-secondary"
                    style={{ padding: '8px', minWidth: '40px', borderRadius: '10px', transform: 'translateZ(20px)' }}
                >
                    <X size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div
                ref={scrollRef}
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    scrollBehavior: 'smooth',
                    maskImage: 'linear-gradient(to bottom, transparent, black 5%, black 95%, transparent)'
                }}
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <Motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, scale: 0.9, rotateX: 10 }}
                            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                            style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '90%',
                                padding: '1rem 1.25rem',
                                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary), var(--accent))' : 'var(--surface-light)',
                                color: msg.role === 'user' ? 'white' : 'var(--text)',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                boxShadow: msg.role === 'user' ? '0 10px 25px rgba(var(--primary-rgb), 0.3)' : '0 4px 15px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <span style={{ display: 'block', transform: 'translateZ(10px)' }}>{msg.text}</span>
                        </Motion.div>
                    ))}
                    {isThinking && (
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'flex', gap: '6px', padding: '12px' }}
                        >
                            {[0, 1, 2].map(i => (
                                <Motion.div
                                    key={i}
                                    animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                                    style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', boxShadow: '0 0 10px var(--primary)' }}
                                />
                            ))}
                        </Motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Generated Code Preview Block (with DEV mode support) */}
            {generatedCode && (
                <Motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    className="glass depth-sm"
                    style={{
                        margin: '0 1.5rem 1.5rem',
                        padding: '1.25rem',
                        background: 'var(--code-bg)',
                        borderRadius: '20px',
                        border: syntaxError ? '1px solid var(--danger)' : (isDevMode ? '1px solid var(--accent)' : '1px solid var(--primary)'),
                        transformStyle: 'preserve-3d',
                        transition: 'border-color 0.3s ease'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', transform: 'translateZ(15px)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ padding: '6px', background: 'var(--surface-light)', borderRadius: '8px' }}>
                                <Code size={14} color="var(--primary)" />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text)', fontWeight: '700', letterSpacing: '0.5px' }}>
                                main.py {isDevMode && <span style={{ color: 'var(--accent)', marginLeft: '10px' }}>(EDITING)</span>}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsDevMode(!isDevMode)}
                                className="glass"
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '10px',
                                    background: isDevMode ? 'linear-gradient(135deg, var(--accent), #ff4d4d)' : 'var(--surface-light)',
                                    color: isDevMode ? 'white' : 'var(--text)',
                                    fontSize: '0.75rem',
                                    fontWeight: '800',
                                    boxShadow: isDevMode ? '0 0 20px rgba(var(--accent-rgb), 0.4)' : 'none',
                                    border: isDevMode ? 'none' : '1px solid var(--border)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <Code size={14} />
                                {isDevMode ? 'Editing...' : 'Edit Code'}
                            </Motion.button>

                            {/* Execution Controls */}
                            {isConnected && (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleStop}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            fontSize: '0.75rem',
                                            fontWeight: '800'
                                        }}
                                    >
                                        <Square size={14} fill="currentColor" /> Stop
                                    </button>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={handleRun}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            color: '#10b981',
                                            fontSize: '0.75rem',
                                            fontWeight: '800'
                                        }}
                                    >
                                        <Play size={14} fill="currentColor" /> Run
                                    </button>
                                </div>
                            )}

                            <button
                                className="btn btn-primary"
                                style={{
                                    padding: '6px 16px',
                                    fontSize: '0.8rem',
                                    minHeight: '36px',
                                    borderRadius: '10px',
                                    opacity: (syntaxError || !isConnected) ? 0.5 : 1,
                                    cursor: (syntaxError || !isConnected || uploadProgress > 0) ? 'not-allowed' : 'pointer',
                                    background: !isConnected ? 'var(--surface-light)' : undefined,
                                    color: !isConnected ? 'var(--text-muted)' : undefined,
                                    border: !isConnected ? '1px solid var(--border)' : undefined,
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}
                                disabled={!!syntaxError || !isConnected || uploadProgress > 0}
                                onClick={() => onUpload(editableCode)}
                            >
                                {uploadProgress > 0 && (
                                    <Motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'rgba(255,255,255,0.2)', zIndex: 0 }}
                                    />
                                )}
                                <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Play size={14} fill="currentColor" />
                                    {uploadProgress > 0 ? `Updating ${uploadProgress}%` : (isConnected ? 'Upload to ESP32' : 'Connect to Upload')}
                                </span>
                            </button>
                        </div>
                    </div>
                    {syntaxError && (
                        <div style={{
                            padding: '8px 12px',
                            background: 'rgba(var(--danger-rgb), 0.1)',
                            border: '1px solid var(--danger)',
                            borderRadius: '8px',
                            color: 'var(--danger)',
                            fontSize: '0.75rem',
                            marginBottom: '10px',
                            fontWeight: '600'
                        }}>
                            Error: {syntaxError}
                        </div>
                    )}
                    <div className="depth-sm" style={{
                        background: 'var(--code-bg)',
                        padding: '1rem',
                        borderRadius: '12px',
                        maxHeight: '200px',
                        overflow: 'auto',
                        border: '1px solid var(--border)',
                        overscrollBehavior: 'contain'
                    }}>
                        {isDevMode ? (
                            <textarea
                                value={editableCode}
                                onChange={handleCodeChange}
                                spellCheck="false"
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--code-text)',
                                    fontFamily: 'monospace',
                                    fontSize: '0.8rem',
                                    lineHeight: '1.5',
                                    resize: 'vertical',
                                    outline: 'none',
                                    padding: 0,
                                    overscrollBehavior: 'contain'
                                }}
                            />
                        ) : (
                            <pre style={{
                                margin: 0,
                                fontSize: '0.8rem',
                                color: 'var(--code-text)',
                                fontFamily: 'monospace',
                                lineHeight: '1.5',
                                pointerEvents: 'none',
                                userSelect: 'none',
                                opacity: 0.8
                            }}>
                                {editableCode || generatedCode}
                            </pre>
                        )}
                    </div>
                </Motion.div>
            )}

            {/* Interaction Footer */}
            <div style={{
                padding: '1.5rem 2rem 2rem',
                borderTop: '1px solid var(--border)',
                background: 'rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
            }}>
                {/* Suggestions */}
                {!generatedCode && (
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {suggestions.map((s, i) => (
                            <Motion.button
                                key={i}
                                whileHover={{ y: -2, scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="glass"
                                onClick={() => setInput(s)}
                                style={{
                                    padding: '8px 14px',
                                    fontSize: '0.75rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    border: '1px solid var(--border)',
                                    color: 'var(--text-muted)',
                                    fontWeight: '600'
                                }}
                            >
                                {s}
                            </Motion.button>
                        ))}
                    </div>
                )}

                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="What do you want to build?"
                        style={{
                            width: '100%',
                            background: 'var(--surface-light)',
                            border: '1px solid var(--border)',
                            borderRadius: '16px',
                            padding: '14px 50px 14px 18px',
                            color: 'var(--text)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all 0.3s ease',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    />
                    <Motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleSend}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'var(--primary)',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            boxShadow: '0 4px 15px rgba(var(--primary-rgb), 0.4)'
                        }}
                    >
                        <Send size={18} />
                    </Motion.button>
                </div>
            </div>

            <style>{`
                /* AIAgent Custom Scrollbar */
                .glass::-webkit-scrollbar {
                    width: 6px;
                }
                .glass::-webkit-scrollbar-track {
                    background: transparent;
                }
                .glass::-webkit-scrollbar-thumb {
                    background: rgba(var(--primary-rgb), 0.2);
                    border-radius: 10px;
                }
                .glass::-webkit-scrollbar-thumb:hover {
                    background: rgba(var(--primary-rgb), 0.4);
                }
            `}</style>
        </Motion.div>
    );
};

export default AIAgent;
