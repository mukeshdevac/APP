import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { 
    BookOpen, CheckCircle, ChevronLeft, ChevronRight, ChevronDown, X, Play, 
    Sparkles, ArrowRight, Zap, Award, HelpCircle, Layers, Check,
    Terminal, RefreshCw, Star, Globe, Bot, Trophy, RotateCcw, Lock
} from 'lucide-react';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { 
    SUPPORTED_LANGUAGES, 
    UI_TRANSLATIONS, 
    getLocalizedModuleContent 
} from '../data/curriculumTranslations';
import RealBlockPreview from './RealBlockPreview';
import RobotExecutionPipeline from './RobotExecutionPipeline';
import MiniBlocklySnapPlayground from './MiniBlocklySnapPlayground';
import { 
    RobotMascotIllustration, 
    PuzzleSnapIllustration, 
    StepFlowIllustration, 
    BlockToCodeBridgeIllustration 
} from './illustrations/CurriculumIllustrations';
import { toast } from '../../../hooks/useToast';

/**
 * TEN Robotics - Block Code Academy LMS
 * Module 1: Introduction to Block Code & How It Helps Write Real Python & AI Code
 * Features:
 * - Child-friendly self navigation
 * - Split-screen responsive
 * - Real-world kid analogies & AI trends
 * - Authentic Blockly SVG block rendering via RealBlockPreview
 * - Inside-the-robot hardware execution animation
 * - Native Indian languages dropdown (Hindi, Tamil, Telugu, etc.)
 */
export default function InteractiveCurriculumGuide({ 
    activeModuleId, 
    onSelectModule, 
    onLoadXml, 
    onClose 
}) {
    // Current module resolver (fallback to first module)
    const currentModule = useMemo(() => {
        return CURRICULUM_MODULES.find(m => m.id === activeModuleId) || CURRICULUM_MODULES[0];
    }, [activeModuleId]);

    // Language state
    const [selectedLang, setSelectedLang] = useState(() => {
        try {
            return localStorage.getItem('ten_lms_lang') || 'en';
        } catch {
            return 'en';
        }
    });
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef(null);

    // Save language change
    const handleSelectLanguage = (langId) => {
        setSelectedLang(langId);
        setIsLangDropdownOpen(false);
        try {
            localStorage.setItem('ten_lms_lang', langId);
        } catch (e) {
            console.error(e);
        }
    };

    // Close language dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) {
                setIsLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Localized strings
    const ui = useMemo(() => {
        return UI_TRANSLATIONS[selectedLang] || UI_TRANSLATIONS['en'];
    }, [selectedLang]);

    const localizedContent = useMemo(() => {
        return getLocalizedModuleContent(selectedLang);
    }, [selectedLang]);

    const activeLanguageMeta = useMemo(() => {
        return SUPPORTED_LANGUAGES.find(l => l.id === selectedLang) || SUPPORTED_LANGUAGES[0];
    }, [selectedLang]);

    // Steps & Navigation
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const steps = currentModule.steps || [];
    const currentStep = steps[currentStepIndex] || steps[0];

    // Localized step content override if available
    const localizedStep = localizedContent.steps && localizedContent.steps[currentStepIndex]
        ? localizedContent.steps[currentStepIndex]
        : null;

    const stepHeadline = localizedStep?.headline || currentStep.headline;
    const stepStory = localizedStep?.story || currentStep.story;
    const stepTip = localizedStep?.tip || currentStep.tip;

    // Interactive Widget States
    const [isBlockSnapped, setIsBlockSnapped] = useState(false);
    const [selectedPythonIndex, setSelectedPythonIndex] = useState(0);
    const [quizSelectedAnswer, setQuizSelectedAnswer] = useState(null);

    // Star Questions (Overall Understanding Challenge)
    const starQuestions = useMemo(() => {
        return localizedContent.starQuestions || currentModule.starQuestions || [];
    }, [localizedContent, currentModule]);

    const [starAnswers, setStarAnswers] = useState({});
    const [activeStarIndex, setActiveStarIndex] = useState(0);

    const earnedStarsCount = useMemo(() => {
        if (!starQuestions || starQuestions.length === 0) return 0;
        return starQuestions.reduce((count, q, idx) => {
            return count + (starAnswers[idx] === q.correctIndex ? 1 : 0);
        }, 0);
    }, [starQuestions, starAnswers]);

    const isAllStarsEarned = useMemo(() => {
        return starQuestions.length > 0 && earnedStarsCount === starQuestions.length;
    }, [starQuestions, earnedStarsCount]);

    const handleSelectStarAnswer = (qIndex, optionIndex) => {
        setStarAnswers(prev => ({
            ...prev,
            [qIndex]: optionIndex
        }));
        if (qIndex === 0) {
            setQuizSelectedAnswer(optionIndex);
        }
    };

    const handleResetStarChallenge = () => {
        setStarAnswers({});
        setActiveStarIndex(0);
        setQuizSelectedAnswer(null);
        toast.info('⭐ Star Challenge reset! Ready to collect all stars again?');
    };

    // Reset interactive states when step changes
    useEffect(() => {
        setIsBlockSnapped(false);
    }, [currentStepIndex]);

    const isLastStep = currentStepIndex === steps.length - 1;

    // Count answered questions (user must enter an answer for all 6)
    const answeredQuestionsCount = useMemo(() => {
        if (!starQuestions || starQuestions.length === 0) return 0;
        return starQuestions.reduce((count, _, idx) => {
            return count + (starAnswers[idx] !== undefined && starAnswers[idx] !== null ? 1 : 0);
        }, 0);
    }, [starQuestions, starAnswers]);

    const hasAnsweredAllQuestions = useMemo(() => {
        return starQuestions.length > 0 && answeredQuestionsCount >= starQuestions.length;
    }, [starQuestions, answeredQuestionsCount]);

    // Navigation handlers
    const handleNextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
        } else {
            // Checkpoint: Must enter all 6 questions before submitting Module 1
            if (!hasAnsweredAllQuestions) {
                const firstUnansweredIndex = starQuestions.findIndex((_, idx) => starAnswers[idx] === undefined || starAnswers[idx] === null);
                if (firstUnansweredIndex !== -1) {
                    setActiveStarIndex(firstUnansweredIndex);
                }
                toast.warning(`⭐ Please answer all ${starQuestions.length} Star Questions before submitting Module 1! (${answeredQuestionsCount}/${starQuestions.length} completed)`);
                return;
            }

            try {
                localStorage.setItem('ten_lms_module_1_completed', 'true');
            } catch (e) {
                console.error(e);
            }

            toast.success('🎉 Fantastic! You completed and submitted Module 1: Introduction to Block Code! 🏆');
        }
    };

    const handlePrevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(prev => prev - 1);
        }
    };

    const handleLoadStarterSketch = () => {
        if (currentModule.starterXml && onLoadXml) {
            onLoadXml(currentModule.starterXml);
            toast.success('🚀 First Sketch loaded into Workspace! Click RUN to test it!');
        }
    };

    // Real Blockly Blocks List for Step 4
    const pythonComparisons = [
        {
            blockName: "Serial Print 'Hello!'",
            blockKeyword: "serial print",
            category: "Communication",
            blockColor: "#0284C7",
            pythonCode: 'print("Hello!")',
            machineCode: 'UART0_TX -> 01001000...',
            analogy: "Like speaking through a microphone to your computer screen!",
            aiConnection: "ChatGPT uses print statements to output words to users."
        },
        {
            blockName: "Wait 1 Second",
            blockKeyword: "wait",
            category: "Timing & Delay",
            blockColor: "#F59E0B",
            pythonCode: "time.sleep(1.0)",
            machineCode: 'CPU_DELAY_MS(1000)',
            analogy: "Like counting 'one Mississippi' before taking the next step!",
            aiConnection: "Self-driving cars pause between camera sensor frames to process data."
        },
        {
            blockName: "Turn LED Pin 4 ON",
            blockKeyword: "digital write",
            category: "Hardware Power",
            blockColor: "#10B981",
            pythonCode: "digital_write(4, 1)",
            machineCode: 'GPIO_SET_3V3(PIN_4)',
            analogy: "Like flipping a wall light switch in your bedroom!",
            aiConnection: "Humanoid robots pulse motor pins to step forward or wave!"
        }
    ];

    const activeComparison = pythonComparisons[selectedPythonIndex] || pythonComparisons[0];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 20px 48px -8px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Top LMS Header Bar */}
            <div style={{
                padding: '12px 16px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
                gap: '8px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)',
                        flexShrink: 0
                    }}>
                        <Sparkles size={17} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                                fontSize: '0.64rem',
                                fontWeight: '800',
                                background: '#EDE9FE',
                                color: '#6D28D9',
                                padding: '1px 6px',
                                borderRadius: '999px',
                                letterSpacing: '0.3px',
                                whiteSpace: 'nowrap'
                            }}>
                                {currentModule.badge}
                            </span>
                            <span style={{ fontSize: '0.66rem', fontWeight: '700', color: '#64748B', whiteSpace: 'nowrap' }}>
                                {ui.module} 1
                            </span>
                        </div>
                        <h3 style={{
                            margin: '1px 0 0',
                            fontSize: '0.92rem',
                            fontWeight: '800',
                            color: '#0F172A',
                            lineHeight: 1.2,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {localizedContent.title || currentModule.title}
                        </h3>
                    </div>
                </div>

                {/* Right Header Actions: Indian Languages Dropdown & Close */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {/* Native Regional Indian Languages Dropdown */}
                    <div style={{ position: 'relative' }} ref={langDropdownRef}>
                        <button
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            title="Choose Indian Language"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: '#F1F5F9',
                                border: '1px solid #CBD5E1',
                                borderRadius: '8px',
                                padding: '5px 8px',
                                cursor: 'pointer',
                                fontSize: '0.74rem',
                                fontWeight: '700',
                                color: '#334155',
                                transition: 'all 0.15s ease'
                            }}
                        >
                            <Globe size={14} color="#6366F1" />
                            <span>{activeLanguageMeta.native}</span>
                            <ChevronDown
                                size={12}
                                color="#64748B"
                                style={{
                                    transform: isLangDropdownOpen ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.2s ease'
                                }}
                            />
                        </button>

                        <AnimatePresence>
                            {isLangDropdownOpen && (
                                <Motion.div
                                    initial={{ opacity: 0, y: -4, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                                    transition={{ duration: 0.14 }}
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 6px)',
                                        right: 0,
                                        width: '210px',
                                        background: '#FFFFFF',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0',
                                        boxShadow: '0 12px 28px rgba(15, 23, 42, 0.16)',
                                        zIndex: 1000,
                                        padding: '6px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '2px',
                                        maxHeight: '260px',
                                        overflowY: 'auto'
                                    }}
                                >
                                    <div style={{
                                        padding: '4px 8px',
                                        fontSize: '0.66rem',
                                        fontWeight: '800',
                                        color: '#94A3B8',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.4px'
                                    }}>
                                        Select Regional Language 🇮🇳
                                    </div>
                                    {SUPPORTED_LANGUAGES.map(lang => {
                                        const isSelected = selectedLang === lang.id;
                                        return (
                                            <button
                                                key={lang.id}
                                                onClick={() => handleSelectLanguage(lang.id)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '6px 8px',
                                                    borderRadius: '6px',
                                                    border: 'none',
                                                    background: isSelected ? '#EEF2FF' : 'transparent',
                                                    color: isSelected ? '#4F46E5' : '#334155',
                                                    fontSize: '0.76rem',
                                                    fontWeight: isSelected ? '800' : '600',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'background 0.12s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span>{lang.native}</span>
                                                    <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>({lang.label})</span>
                                                </div>
                                                {isSelected && <Check size={13} color="#4F46E5" />}
                                            </button>
                                        );
                                    })}
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        title="Close Academy Guide"
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: '1px solid #E2E8F0',
                            background: '#FFFFFF',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#64748B',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FEE2E2';
                            e.currentTarget.style.color = '#EF4444';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#FFFFFF';
                            e.currentTarget.style.color = '#64748B';
                        }}
                    >
                        <X size={14} />
                    </button>
                </div>
            </div>

            {/* Child-Friendly Step Progress Navigator */}
            <div style={{
                padding: '8px 16px',
                background: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                flexShrink: 0
            }}>
                <span style={{ fontSize: '0.74rem', fontWeight: '700', color: '#475569' }}>
                    {ui.stepOf(currentStepIndex + 1, steps.length)}
                </span>

                {/* Step indicator pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {steps.map((st, idx) => {
                        const isCurrent = idx === currentStepIndex;
                        const isDone = idx < currentStepIndex;
                        return (
                            <button
                                key={st.id}
                                onClick={() => setCurrentStepIndex(idx)}
                                title={st.title}
                                style={{
                                    width: isCurrent ? '24px' : '9px',
                                    height: '9px',
                                    borderRadius: '999px',
                                    border: 'none',
                                    background: isCurrent 
                                        ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' 
                                        : isDone ? '#10B981' : '#CBD5E1',
                                    cursor: 'pointer',
                                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                                    padding: 0
                                }}
                            />
                        );
                    })}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Stars Badge Tracker */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: earnedStarsCount > 0 ? '#FEF3C7' : '#F1F5F9',
                        border: earnedStarsCount > 0 ? '1px solid #FCD34D' : '1px solid #E2E8F0',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        fontSize: '0.71rem',
                        fontWeight: '800',
                        color: earnedStarsCount > 0 ? '#B45309' : '#64748B'
                    }}>
                        <Star size={11} fill={earnedStarsCount > 0 ? '#F59E0B' : 'none'} color={earnedStarsCount > 0 ? '#F59E0B' : '#94A3B8'} />
                        <span>{earnedStarsCount}/{starQuestions.length} Stars</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        color: '#6366F1'
                    }}>
                        <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}%</span>
                    </div>
                </div>
            </div>

            {/* Main Interactive Step Content Area */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <AnimatePresence mode="wait">
                    <Motion.div
                        key={`${currentStep.id}-${selectedLang}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                    >
                        {/* Step Headline Card */}
                        <div style={{
                            padding: '12px 14px',
                            background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
                            border: '1px solid #E0E7FF',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{ flexShrink: 0 }}>
                                {currentStep.illustrationType === 'robot' && (
                                    <RobotMascotIllustration size={80} isHappy={true} />
                                )}
                                {currentStep.illustrationType === 'puzzle' && (
                                    <PuzzleSnapIllustration size={105} />
                                )}
                                {currentStep.illustrationType === 'flow' && (
                                    <StepFlowIllustration size={105} />
                                )}
                                {currentStep.illustrationType === 'bridge' && (
                                    <BlockToCodeBridgeIllustration size={115} />
                                )}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    display: 'inline-block',
                                    fontSize: '0.66rem',
                                    fontWeight: '800',
                                    color: '#4F46E5',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.4px',
                                    marginBottom: '3px'
                                }}>
                                    {currentStep.badge}
                                </div>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '1.02rem',
                                    fontWeight: '800',
                                    color: '#1E1B4B',
                                    lineHeight: 1.25
                                }}>
                                    {stepHeadline}
                                </h2>
                            </div>
                        </div>

                        {/* Story Text Box (Friendly for Kids with Real World Analogies & AI context) */}
                        <div style={{
                            padding: '12px 14px',
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
                            borderRadius: '12px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}>
                            <p style={{
                                margin: 0,
                                fontSize: '0.86rem',
                                lineHeight: '1.55',
                                color: '#334155',
                                fontWeight: '500'
                            }}>
                                {stepStory}
                            </p>

                            {/* Real-World Analogy & AI Tip Note */}
                            <div style={{
                                marginTop: '10px',
                                padding: '8px 10px',
                                background: '#F0FDF4',
                                border: '1px solid #BBF7D0',
                                borderRadius: '9px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span style={{ fontSize: '1.05rem' }}>🤖</span>
                                <span style={{ fontSize: '0.76rem', color: '#166534', fontWeight: '600' }}>
                                    {stepTip}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Widget 1: Real Interactive Blockly Snap Window (Step 2) */}
                        {currentStep.interactiveType === 'snap_demo' && (
                            <MiniBlocklySnapPlayground />
                        )}

                        {/* Interactive Widget 2: Robot Mascot Execution Pipeline (Step 3) */}
                        {currentStep.interactiveType === 'step_flow' && (
                            <RobotExecutionPipeline isPlayingDefault={false} />
                        )}

                        {/* Interactive Widget 3: Real Blockly SVG Blocks -> Python Live Transformer (Step 4) */}
                        {currentStep.interactiveType === 'transformer' && (
                            <div style={{
                                padding: '12px',
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: '700', color: '#0F172A' }}>
                                    {ui.pickBlockPrompt}
                                </div>

                                {/* Block Selectors */}
                                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
                                    {pythonComparisons.map((item, idx) => {
                                        const isSel = idx === selectedPythonIndex;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedPythonIndex(idx)}
                                                style={{
                                                    padding: '5px 10px',
                                                    borderRadius: '8px',
                                                    border: isSel ? `2px solid ${item.blockColor}` : '1px solid #CBD5E1',
                                                    background: isSel ? item.blockColor : '#FFFFFF',
                                                    color: isSel ? '#FFFFFF' : '#475569',
                                                    fontSize: '0.74rem',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    whiteSpace: 'nowrap',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {item.blockName}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Transformation Card with Real Blockly SVG Preview */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '10px',
                                    padding: '12px',
                                    background: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '12px'
                                }}>
                                    {/* Left: Authentic Blockly SVG Block */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>
                                            {ui.whatYouSee}
                                        </div>
                                        <div style={{
                                            background: '#F8FAFC',
                                            borderRadius: '8px',
                                            padding: '8px',
                                            border: '1px solid #E2E8F0',
                                            minHeight: '64px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            overflow: 'hidden'
                                        }}>
                                            <RealBlockPreview
                                                blockText={activeComparison.blockKeyword}
                                                scale={0.76}
                                            />
                                        </div>
                                        <div style={{ fontSize: '0.68rem', color: '#64748B', fontStyle: 'italic' }}>
                                            💡 {activeComparison.analogy}
                                        </div>
                                    </div>

                                    {/* Right: Real Python Code */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <div style={{ fontSize: '0.66rem', fontWeight: '800', color: '#0284C7', textTransform: 'uppercase' }}>
                                            {ui.realPython}
                                        </div>
                                        <div style={{
                                            background: '#0F172A',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            fontFamily: 'monospace',
                                            color: '#38BDF8',
                                            fontSize: '0.78rem',
                                            fontWeight: '700',
                                            minHeight: '64px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            border: '1px solid #334155'
                                        }}>
                                            <div>{activeComparison.pythonCode}</div>
                                            <div style={{ fontSize: '0.64rem', color: '#94A3B8', marginTop: '4px' }}>
                                                # Machine: {activeComparison.machineCode}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '0.68rem', color: '#0284C7', fontWeight: '600' }}>
                                            🚀 {activeComparison.aiConnection}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Interactive Widget 4: First Mission Starter Sketch Load (Step 5) */}
                        {currentStep.interactiveType === 'launch' && (
                            <div style={{
                                padding: '14px',
                                background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
                                border: '1px solid #A7F3D0',
                                borderRadius: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: '10px'
                            }}>
                                <div style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '50%',
                                    background: '#10B981',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
                                }}>
                                    <Play size={20} fill="#FFFFFF" />
                                </div>

                                <div>
                                    <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: '800', color: '#065F46' }}>
                                        {ui.readyToCode}
                                    </h4>
                                    <p style={{ margin: '3px 0 0', fontSize: '0.76rem', color: '#047857' }}>
                                        {ui.loadDesc}
                                    </p>
                                </div>

                                <button
                                    onClick={handleLoadStarterSketch}
                                    style={{
                                        padding: '9px 20px',
                                        background: 'linear-gradient(135deg, #10B981, #059669)',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '999px',
                                        fontSize: '0.84rem',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                                        transition: 'all 0.18s ease'
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                                >
                                    <span>{ui.loadSketch}</span>
                                </button>
                            </div>
                        )}

                        {/* Overall Understanding Star Questions Challenge */}
                        {currentStepIndex === steps.length - 1 && (
                            <div style={{
                                marginTop: '4px',
                                padding: '14px',
                                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                                border: '1.5px solid #E0E7FF',
                                borderRadius: '14px',
                                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.06)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px'
                            }}>
                                {/* Challenge Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    borderBottom: '1px solid #EEF2F6',
                                    paddingBottom: '10px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 6px rgba(99, 102, 241, 0.3)',
                                            color: '#FFFFFF'
                                        }}>
                                            <Star size={18} fill="#FFD700" color="#FFD700" />
                                        </div>
                                        <div>
                                            <h3 style={{
                                                margin: 0,
                                                fontSize: '0.88rem',
                                                fontWeight: '800',
                                                color: '#1E1B4B',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                Overall Understanding Star Challenge
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: '700',
                                                    padding: '2px 6px',
                                                    borderRadius: '999px',
                                                    background: '#EEF2FF',
                                                    color: '#6366F1'
                                                }}>
                                                    {starQuestions.length} Questions
                                                </span>
                                            </h3>
                                            <p style={{ margin: 0, fontSize: '0.71rem', color: '#64748B', fontWeight: '500' }}>
                                                Answer all Star Questions to prove your full mastery of the Introduction!
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stars Counter Pill */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '5px 10px',
                                        borderRadius: '10px',
                                        background: isAllStarsEarned ? '#ECFDF5' : '#FFFBEB',
                                        border: isAllStarsEarned ? '1px solid #10B981' : '1px solid #FCD34D'
                                    }}>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {starQuestions.map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={13} 
                                                    fill={starAnswers[i] === starQuestions[i]?.correctIndex ? '#F59E0B' : '#E2E8F0'} 
                                                    color={starAnswers[i] === starQuestions[i]?.correctIndex ? '#D97706' : '#CBD5E1'} 
                                                />
                                            ))}
                                        </div>
                                        <span style={{
                                            fontSize: '0.73rem',
                                            fontWeight: '800',
                                            color: isAllStarsEarned ? '#065F46' : '#B45309'
                                        }}>
                                            {earnedStarsCount}/{starQuestions.length} Stars
                                        </span>
                                    </div>
                                </div>

                                {/* Question Selector Tabs */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    overflowX: 'auto',
                                    paddingBottom: '2px'
                                }}>
                                    {starQuestions.map((q, idx) => {
                                        const isSelected = activeStarIndex === idx;
                                        const isCorrect = starAnswers[idx] === q.correctIndex;
                                        const isAnswered = starAnswers[idx] !== undefined && starAnswers[idx] !== null;

                                        return (
                                            <button
                                                key={q.id || idx}
                                                onClick={() => setActiveStarIndex(idx)}
                                                style={{
                                                    flex: '1 0 auto',
                                                    minWidth: '54px',
                                                    minHeight: '36px',
                                                    padding: '5px 8px',
                                                    borderRadius: '8px',
                                                    border: isSelected 
                                                        ? '2px solid #6366F1' 
                                                        : isCorrect 
                                                            ? '1.5px solid #10B981' 
                                                            : '1px solid #E2E8F0',
                                                    background: isSelected 
                                                        ? '#EEF2FF' 
                                                        : isCorrect 
                                                            ? '#F0FDF4' 
                                                            : '#FFFFFF',
                                                    color: isSelected ? '#4338CA' : isCorrect ? '#166534' : '#64748B',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '4px',
                                                    fontSize: '0.73rem',
                                                    fontWeight: '700',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                <span>Q{idx + 1}</span>
                                                <Star 
                                                    size={11} 
                                                    fill={isCorrect ? '#F59E0B' : isAnswered ? '#EF4444' : 'none'} 
                                                    color={isCorrect ? '#D97706' : isAnswered ? '#DC2626' : '#94A3B8'} 
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Current Active Question Card */}
                                {starQuestions[activeStarIndex] && (
                                    <div style={{
                                        background: '#FFFFFF',
                                        border: '1px solid #E2E8F0',
                                        borderRadius: '12px',
                                        padding: '12px 14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                                    }}>
                                        {/* Question Tag */}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{
                                                fontSize: '0.68rem',
                                                fontWeight: '800',
                                                color: '#6366F1',
                                                background: '#EEF2FF',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Star Question {activeStarIndex + 1} of {starQuestions.length}
                                            </span>

                                            {starAnswers[activeStarIndex] === starQuestions[activeStarIndex].correctIndex && (
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: '700',
                                                    color: '#15803D',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}>
                                                    <CheckCircle size={13} color="#10B981" /> Star Unlocked!
                                                </span>
                                            )}
                                        </div>

                                        {/* Question Text */}
                                        <div style={{
                                            fontSize: '0.84rem',
                                            color: '#0F172A',
                                            fontWeight: '700',
                                            lineHeight: '1.45'
                                        }}>
                                            {starQuestions[activeStarIndex].question}
                                        </div>

                                        {/* Options */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                            {starQuestions[activeStarIndex].options.map((opt, optIdx) => {
                                                const isChosen = starAnswers[activeStarIndex] === optIdx;
                                                const isCorrectOption = optIdx === starQuestions[activeStarIndex].correctIndex;

                                                return (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleSelectStarAnswer(activeStarIndex, optIdx)}
                                                        style={{
                                                            textAlign: 'left',
                                                            padding: '9px 12px',
                                                            borderRadius: '9px',
                                                            border: isChosen
                                                                ? isCorrectOption ? '2px solid #10B981' : '2px solid #EF4444'
                                                                : '1px solid #CBD5E1',
                                                            background: isChosen
                                                                ? isCorrectOption ? '#ECFDF5' : '#FFF1F2'
                                                                : '#FFFFFF',
                                                            color: isChosen
                                                                ? isCorrectOption ? '#065F46' : '#9F1239'
                                                                : '#334155',
                                                            fontSize: '0.78rem',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'space-between',
                                                            gap: '8px',
                                                            minHeight: '44px',
                                                            transition: 'all 0.15s ease'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            if (!isChosen) {
                                                                e.currentTarget.style.borderColor = '#94A3B8';
                                                                e.currentTarget.style.background = '#F8FAFC';
                                                            }
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            if (!isChosen) {
                                                                e.currentTarget.style.borderColor = '#CBD5E1';
                                                                e.currentTarget.style.background = '#FFFFFF';
                                                            }
                                                        }}
                                                    >
                                                        <span style={{ flex: 1, lineHeight: '1.4' }}>{opt}</span>
                                                        {isChosen && (
                                                            <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>
                                                                {isCorrectOption ? '✅' : '❌'}
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Feedback */}
                                        {starAnswers[activeStarIndex] !== undefined && (
                                            <div style={{
                                                padding: '9px 12px',
                                                borderRadius: '8px',
                                                background: starAnswers[activeStarIndex] === starQuestions[activeStarIndex].correctIndex ? '#F0FDF4' : '#FEF2F2',
                                                border: starAnswers[activeStarIndex] === starQuestions[activeStarIndex].correctIndex ? '1px solid #BBF7D0' : '1px solid #FECACA',
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: '8px'
                                            }}>
                                                <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>
                                                    {starAnswers[activeStarIndex] === starQuestions[activeStarIndex].correctIndex ? '🌟' : '💡'}
                                                </span>
                                                <div style={{
                                                    fontSize: '0.74rem',
                                                    fontWeight: '600',
                                                    color: starAnswers[activeStarIndex] === starQuestions[activeStarIndex].correctIndex ? '#15803D' : '#B91C1C',
                                                    lineHeight: '1.45'
                                                }}>
                                                    {starAnswers[activeStarIndex] === starQuestions[activeStarIndex].correctIndex
                                                        ? starQuestions[activeStarIndex].feedback
                                                        : 'Almost there! Take another look at the story slides and try another option!'}
                                                </div>
                                            </div>
                                        )}

                                        {/* Question Step Controls */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginTop: '2px',
                                            paddingTop: '8px',
                                            borderTop: '1px solid #F1F5F9'
                                        }}>
                                            <button
                                                onClick={() => setActiveStarIndex(prev => Math.max(0, prev - 1))}
                                                disabled={activeStarIndex === 0}
                                                style={{
                                                    padding: '5px 10px',
                                                    borderRadius: '7px',
                                                    border: '1px solid #E2E8F0',
                                                    background: activeStarIndex === 0 ? '#F8FAFC' : '#FFFFFF',
                                                    color: activeStarIndex === 0 ? '#CBD5E1' : '#475569',
                                                    fontSize: '0.72rem',
                                                    fontWeight: '700',
                                                    cursor: activeStarIndex === 0 ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <ChevronLeft size={13} /> Prev Star
                                            </button>

                                            <div style={{ fontSize: '0.71rem', color: '#64748B', fontWeight: '600' }}>
                                                {activeStarIndex + 1} of {starQuestions.length}
                                            </div>

                                            <button
                                                onClick={() => setActiveStarIndex(prev => Math.min(starQuestions.length - 1, prev + 1))}
                                                disabled={activeStarIndex === starQuestions.length - 1}
                                                style={{
                                                    padding: '5px 10px',
                                                    borderRadius: '7px',
                                                    border: '1px solid #E2E8F0',
                                                    background: activeStarIndex === starQuestions.length - 1 ? '#F8FAFC' : '#FFFFFF',
                                                    color: activeStarIndex === starQuestions.length - 1 ? '#CBD5E1' : '#475569',
                                                    fontSize: '0.72rem',
                                                    fontWeight: '700',
                                                    cursor: activeStarIndex === starQuestions.length - 1 ? 'not-allowed' : 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                Next Star <ChevronRight size={13} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* All Stars Earned Grand Celebration Banner */}
                                {isAllStarsEarned && (
                                    <div style={{
                                        padding: '12px 14px',
                                        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                        border: '2px solid #F59E0B',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        gap: '6px',
                                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Trophy size={22} color="#D97706" />
                                            <span style={{ fontSize: '0.88rem', fontWeight: '900', color: '#78350F' }}>
                                                🏆 INTRODUCTION MASTER CODER UNLOCKED! 🏆
                                            </span>
                                            <Trophy size={22} color="#D97706" />
                                        </div>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: '#92400E',
                                            maxWidth: '460px',
                                            lineHeight: '1.4'
                                        }}>
                                            Outstanding job! You answered all {starQuestions.length} Star Questions correctly! You master puzzle blocks, real Python syntax, top-to-bottom robot flow, and ESP32 hardware electric pins! 🚀
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                            <button
                                                onClick={handleNextStep}
                                                style={{
                                                    marginTop: '3px',
                                                    padding: '7px 16px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: 'linear-gradient(135deg, #10B981, #059669)',
                                                    color: '#FFFFFF',
                                                    fontSize: '0.78rem',
                                                    fontWeight: '800',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
                                                    transition: 'all 0.15s ease'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                                            >
                                                <Check size={14} /> Submit & Finish Module 1 🎉
                                            </button>
                                            <button
                                                onClick={handleResetStarChallenge}
                                                style={{
                                                    marginTop: '3px',
                                                    padding: '6px 12px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #D97706',
                                                    background: '#FFFFFF',
                                                    color: '#B45309',
                                                    fontSize: '0.72rem',
                                                    fontWeight: '700',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                                }}
                                            >
                                                <RotateCcw size={11} /> Play Again
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Child-Friendly Navigation Bar */}
            <div style={{
                padding: '10px 16px',
                background: '#FFFFFF',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                flexShrink: 0
            }}>
                {/* Back Button */}
                <button
                    onClick={handlePrevStep}
                    disabled={currentStepIndex === 0}
                    style={{
                        padding: '7px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        background: currentStepIndex === 0 ? '#F1F5F9' : '#FFFFFF',
                        color: currentStepIndex === 0 ? '#94A3B8' : '#334155',
                        fontSize: '0.78rem',
                        fontWeight: '700',
                        cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.15s ease'
                    }}
                >
                    <ChevronLeft size={15} />
                    <span>{ui.back}</span>
                </button>

                {/* Step indicator text */}
                <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748B' }}>
                    {currentStepIndex + 1} / {steps.length}
                </span>

                {/* Next Step / Complete Button */}
                <button
                    onClick={handleNextStep}
                    disabled={isLastStep && !hasAnsweredAllQuestions}
                    title={
                        isLastStep && !hasAnsweredAllQuestions
                            ? `Please answer all ${starQuestions.length} Star Questions above before submitting Module 1 (${answeredQuestionsCount}/${starQuestions.length} answered)`
                            : isLastStep
                                ? "Click to submit and complete Module 1!"
                                : ui.next
                    }
                    style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: isLastStep
                            ? hasAnsweredAllQuestions
                                ? 'linear-gradient(135deg, #10B981, #059669)'
                                : '#94A3B8'
                            : 'linear-gradient(135deg, #6366F1, #4F46E5)',
                        color: '#FFFFFF',
                        fontSize: '0.8rem',
                        fontWeight: '800',
                        cursor: isLastStep && !hasAnsweredAllQuestions ? 'not-allowed' : 'pointer',
                        opacity: isLastStep && !hasAnsweredAllQuestions ? 0.75 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: isLastStep && !hasAnsweredAllQuestions
                            ? 'none'
                            : isLastStep
                                ? '0 2px 10px rgba(16, 185, 129, 0.4)'
                                : '0 2px 8px rgba(99, 102, 241, 0.25)',
                        transition: 'all 0.18s ease'
                    }}
                    onMouseEnter={(e) => { 
                        if (!isLastStep || hasAnsweredAllQuestions) {
                            e.currentTarget.style.transform = 'translateY(-1px)'; 
                        }
                    }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
                >
                    {isLastStep ? (
                        hasAnsweredAllQuestions ? (
                            <>
                                <span>{ui.finish}</span>
                                <Check size={15} />
                            </>
                        ) : (
                            <>
                                <Lock size={13} />
                                <span>Answer All 6 Questions ({answeredQuestionsCount}/{starQuestions.length})</span>
                            </>
                        )
                    ) : (
                        <>
                            <span>{ui.next}</span>
                            <ChevronRight size={15} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

export { InteractiveCurriculumGuide };
