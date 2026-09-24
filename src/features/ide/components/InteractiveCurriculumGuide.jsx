import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
    BookOpen, CheckCircle, ChevronLeft, ChevronRight, ChevronDown, X, Play, 
    Sparkles, Lightbulb, Activity, Target, Zap, RotateCw, Compass, 
    RotateCcw, Sliders, AlertTriangle, Bot, Radio, Search, Cpu, Database, 
    Layers, HelpCircle, ArrowRight, ExternalLink, Terminal, Fan, Battery, 
    Tv, Globe, Award, Check, MessageSquare
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import * as Blockly from 'blockly';
import { CURRICULUM_MODULES } from '../data/curriculumData';
import { 
    SUPPORTED_LANGUAGES, 
    UI_TRANSLATIONS, 
    getLocalizedModule 
} from '../data/curriculumTranslations';
import { defineCustomBlocks } from '../services/customBlocks';
import { RealBlockPreview } from './RealBlockPreview';
import { toast } from '../../../hooks/useToast';

const ICON_MAP = {
    Terminal, Lightbulb, Activity, Target, Zap, RotateCw, Compass, RotateCcw, 
    Sliders, Fan, AlertTriangle, Battery, Tv, Bot, Radio, Search, Cpu, Database, Sparkles
};

const TIER_COLORS = {
    'Beginner': { text: '#059669', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)' },
    'Intermediate': { text: '#0284C7', bg: 'rgba(2, 132, 199, 0.1)', border: 'rgba(2, 132, 199, 0.25)' },
    'Advanced': { text: '#7C3AED', bg: 'rgba(124, 58, 237, 0.1)', border: 'rgba(124, 58, 237, 0.25)' },
    'Master': { text: '#DC2626', bg: 'rgba(220, 38, 38, 0.1)', border: 'rgba(220, 38, 38, 0.25)' }
};

export default function InteractiveCurriculumGuide({ 
    activeModuleId, 
    onSelectModule, 
    onLoadXml, 
    onClose 
}) {
    const [selectedLang, setSelectedLang] = useState('hi'); // Default to Hinglish
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'levels', 'pinout'
    const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
    const [quizAnswer, setQuizAnswer] = useState(null);
    const [quizChecked, setQuizChecked] = useState(false);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [pickerSearch, setPickerSearch] = useState('');

    const pickerRef = useRef(null);

    // Current raw module
    const rawModule = useMemo(() => {
        return CURRICULUM_MODULES.find(m => m.id === activeModuleId || m.exampleId === activeModuleId) || CURRICULUM_MODULES[0];
    }, [activeModuleId]);

    // Localized conversational module
    const currentModule = useMemo(() => {
        return getLocalizedModule(rawModule, selectedLang);
    }, [rawModule, selectedLang]);

    const ui = useMemo(() => {
        return UI_TRANSLATIONS[selectedLang] || UI_TRANSLATIONS['en'];
    }, [selectedLang]);

    const currentIndex = useMemo(() => {
        return CURRICULUM_MODULES.findIndex(m => m.id === rawModule.id);
    }, [rawModule]);

    const filteredModules = useMemo(() => {
        if (!pickerSearch.trim()) return CURRICULUM_MODULES;
        const q = pickerSearch.toLowerCase();
        return CURRICULUM_MODULES.filter(m => 
            m.title.toLowerCase().includes(q) || 
            m.tier.toLowerCase().includes(q) ||
            m.id.toLowerCase().includes(q)
        );
    }, [pickerSearch]);

    const IconComponent = ICON_MAP[currentModule.icon] || BookOpen;
    const tierMeta = TIER_COLORS[currentModule.tier] || TIER_COLORS['Beginner'];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setIsPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNext = () => {
        if (currentIndex < CURRICULUM_MODULES.length - 1) {
            onSelectModule(CURRICULUM_MODULES[currentIndex + 1].id);
            setSelectedLevelIdx(0);
            setQuizAnswer(null);
            setQuizChecked(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            onSelectModule(CURRICULUM_MODULES[currentIndex - 1].id);
            setSelectedLevelIdx(0);
            setQuizAnswer(null);
            setQuizChecked(false);
        }
    };

    const handleLoadLevel = (level) => {
        if (level.xml && onLoadXml) {
            onLoadXml(level.xml);
            toast.success(ui.loadedToast);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            background: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            boxShadow: '0 20px 48px -8px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Top Navigation Header */}
            <div style={{
                padding: '16px 20px 14px',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
                borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                flexShrink: 0
            }}>
                {/* Header row 1: Mentor Badge + Module Info + Window Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Glowing Ambient Avatar */}
                        <div style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            background: `linear-gradient(135deg, ${currentModule.color}, #0284C7)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            boxShadow: `0 4px 14px ${currentModule.color}40, inset 0 1px 1px rgba(255, 255, 255, 0.45)`,
                            flexShrink: 0
                        }}>
                            <IconComponent size={22} />
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.72rem',
                                    fontWeight: '800',
                                    color: '#0284C7',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase'
                                }}>
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: '#10B981',
                                        boxShadow: '0 0 6px #10B981'
                                    }} />
                                    {ui.mentorName}
                                </span>
                                <span style={{
                                    fontSize: '0.67rem',
                                    fontWeight: '700',
                                    color: tierMeta.text,
                                    background: tierMeta.bg,
                                    border: `1px solid ${tierMeta.border}`,
                                    padding: '1px 7px',
                                    borderRadius: '999px'
                                }}>
                                    {currentModule.tier}
                                </span>
                            </div>
                            <div style={{
                                fontSize: '1.08rem',
                                fontWeight: '800',
                                color: '#0F172A',
                                letterSpacing: '-0.02em',
                                lineHeight: 1.25,
                                marginTop: '2px'
                            }}>
                                {currentModule.title}
                            </div>
                        </div>
                    </div>

                    {/* Window Controls: Unified Apple Navigation Pill + Close */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#F1F5F9',
                            border: '1px solid #E2E8F0',
                            borderRadius: '999px',
                            padding: '2px 4px'
                        }}>
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                title={ui.prevModule}
                                style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                                    opacity: currentIndex === 0 ? 0.3 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#475569',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <ChevronLeft size={15} />
                            </button>
                            <span style={{
                                fontSize: '0.74rem',
                                fontWeight: '700',
                                color: '#64748B',
                                padding: '0 6px',
                                userSelect: 'none'
                            }}>
                                {currentIndex + 1} / {CURRICULUM_MODULES.length}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex === CURRICULUM_MODULES.length - 1}
                                title={ui.nextModule}
                                style={{
                                    width: '26px',
                                    height: '26px',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: currentIndex === CURRICULUM_MODULES.length - 1 ? 'not-allowed' : 'pointer',
                                    opacity: currentIndex === CURRICULUM_MODULES.length - 1 ? 0.3 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#475569',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            title="Close Learning Companion"
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
                                transition: 'all 0.15s ease',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#FEE2E2';
                                e.currentTarget.style.color = '#EF4444';
                                e.currentTarget.style.borderColor = '#FCA5A5';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#FFFFFF';
                                e.currentTarget.style.color = '#64748B';
                                e.currentTarget.style.borderColor = '#E2E8F0';
                            }}
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>

                {/* Header row 2: Multilingual Language Switcher (Segmented Glass Pills) */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    padding: '3px 4px',
                    background: '#F1F5F9',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingLeft: '8px', flexShrink: 0 }}>
                        <Globe size={13} color="#0284C7" />
                        <span style={{ fontSize: '0.71rem', fontWeight: '700', color: '#64748B' }}>
                            Language:
                        </span>
                    </div>

                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '3px', 
                        flex: 1, 
                        justifyContent: 'flex-end',
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch'
                    }}>
                        {SUPPORTED_LANGUAGES.map(lang => {
                            const isSelected = selectedLang === lang.id;
                            return (
                                <button
                                    key={lang.id}
                                    onClick={() => setSelectedLang(lang.id)}
                                    title={`Switch explanation to ${lang.label} (${lang.tag})`}
                                    style={{
                                        border: 'none',
                                        padding: '4px 9px',
                                        borderRadius: '7px',
                                        background: isSelected ? '#FFFFFF' : 'transparent',
                                        color: isSelected ? '#0F172A' : '#64748B',
                                        boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.02)' : 'none',
                                        fontSize: '0.72rem',
                                        fontWeight: isSelected ? '800' : '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        flexShrink: 0,
                                        whiteSpace: 'nowrap',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <span>{lang.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Header row 3: State-of-the-Art Custom Module Selector Trigger */}
                <div style={{ position: 'relative' }} ref={pickerRef}>
                    <div
                        onClick={() => setIsPickerOpen(!isPickerOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '9px 14px',
                            background: '#FFFFFF',
                            border: `1px solid ${isPickerOpen ? '#0284C7' : '#CBD5E1'}`,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            boxShadow: isPickerOpen ? '0 0 0 3px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                            <span style={{
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                background: 'linear-gradient(135deg, #0284C7, #0369A1)',
                                color: '#FFFFFF',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                flexShrink: 0
                            }}>
                                #{String(currentIndex + 1).padStart(2, '0')}
                            </span>
                            <span style={{
                                fontSize: '0.84rem',
                                fontWeight: '700',
                                color: '#0F172A',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {rawModule.title}
                            </span>
                            <span style={{
                                fontSize: '0.66rem',
                                fontWeight: '700',
                                color: tierMeta.text,
                                background: tierMeta.bg,
                                border: `1px solid ${tierMeta.border}`,
                                padding: '1px 6px',
                                borderRadius: '5px',
                                flexShrink: 0
                            }}>
                                {rawModule.tier}
                            </span>
                        </div>
                        <ChevronDown 
                            size={16} 
                            color="#64748B" 
                            style={{ 
                                transform: isPickerOpen ? 'rotate(180deg)' : 'none', 
                                transition: 'transform 0.2s ease',
                                flexShrink: 0,
                                marginLeft: '8px'
                            }} 
                        />
                    </div>

                    {/* Module Picker Popover Menu */}
                    <AnimatePresence>
                        {isPickerOpen && (
                            <Motion.div
                                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 6px)',
                                    left: 0,
                                    right: 0,
                                    zIndex: 60,
                                    background: '#FFFFFF',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '14px',
                                    boxShadow: '0 16px 40px -8px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.04)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {/* Search input inside picker */}
                                <div style={{
                                    padding: '8px 12px',
                                    borderBottom: '1px solid #E2E8F0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: '#F8FAFC'
                                }}>
                                    <Search size={14} color="#94A3B8" />
                                    <input
                                        type="text"
                                        placeholder="Search curriculum module..."
                                        value={pickerSearch}
                                        onChange={(e) => setPickerSearch(e.target.value)}
                                        autoFocus
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            outline: 'none',
                                            fontSize: '0.78rem',
                                            color: '#0F172A',
                                            width: '100%'
                                        }}
                                    />
                                    {pickerSearch && (
                                        <button
                                            onClick={() => setPickerSearch('')}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#94A3B8',
                                                cursor: 'pointer',
                                                padding: '2px',
                                                display: 'flex'
                                            }}
                                        >
                                            <X size={13} />
                                        </button>
                                    )}
                                </div>

                                {/* List of modules */}
                                <div style={{
                                    maxHeight: '280px',
                                    overflowY: 'auto',
                                    padding: '6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px'
                                }}>
                                    {filteredModules.map((m, idx) => {
                                        const isSelected = m.id === rawModule.id;
                                        const modTierMeta = TIER_COLORS[m.tier] || TIER_COLORS['Beginner'];
                                        const ModIcon = ICON_MAP[m.icon] || BookOpen;

                                        return (
                                            <div
                                                key={m.id}
                                                onClick={() => {
                                                    onSelectModule(m.id);
                                                    setSelectedLevelIdx(0);
                                                    setQuizAnswer(null);
                                                    setQuizChecked(false);
                                                    setIsPickerOpen(false);
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '8px 10px',
                                                    borderRadius: '8px',
                                                    background: isSelected ? '#F0F9FF' : 'transparent',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.1s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isSelected) e.currentTarget.style.background = '#F8FAFC';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        width: '24px',
                                                        height: '24px',
                                                        borderRadius: '6px',
                                                        background: m.color || '#0284C7',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#FFFFFF',
                                                        flexShrink: 0
                                                    }}>
                                                        <ModIcon size={13} />
                                                    </div>
                                                    <span style={{
                                                        fontSize: '0.8rem',
                                                        fontWeight: isSelected ? '800' : '600',
                                                        color: isSelected ? '#0284C7' : '#0F172A',
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}>
                                                        {idx + 1}. {m.title}
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                                    <span style={{
                                                        fontSize: '0.64rem',
                                                        fontWeight: '700',
                                                        color: modTierMeta.text,
                                                        background: modTierMeta.bg,
                                                        padding: '1px 6px',
                                                        borderRadius: '4px'
                                                    }}>
                                                        {m.tier}
                                                    </span>
                                                    {isSelected && <Check size={14} color="#0284C7" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Header row 4: Apple / Linear Segmented Tabs Control */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: '#F1F5F9',
                    borderRadius: '12px',
                    padding: '4px',
                    border: '1px solid #E2E8F0'
                }}>
                    {[
                        { id: 'overview', label: ui.overviewTab, icon: BookOpen },
                        { id: 'levels', label: ui.levelsTab, icon: Layers },
                        { id: 'pinout', label: ui.pinsTab, icon: Cpu }
                    ].map(tab => {
                        const isActive = activeTab === tab.id;
                        const TabIcon = tab.icon;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '8px 10px',
                                    border: 'none',
                                    borderRadius: '9px',
                                    background: isActive ? '#FFFFFF' : 'transparent',
                                    color: isActive ? '#0284C7' : '#64748B',
                                    fontSize: '0.78rem',
                                    fontWeight: isActive ? '800' : '600',
                                    cursor: 'pointer',
                                    boxShadow: isActive ? '0 2px 8px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)' : 'none',
                                    transition: 'all 0.15s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                <TabIcon size={14} color={isActive ? '#0284C7' : '#64748B'} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Scrollable Main Learning Container */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 26px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                fontSize: '0.92rem',
                color: '#334155',
                lineHeight: 1.8
            }}>
                {/* 1. OVERVIEW & INTUITION TAB */}
                {activeTab === 'overview' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        {/* Conversational Mentor Speech Bubble */}
                        <div style={{
                            padding: '18px 20px',
                            background: 'linear-gradient(135deg, rgba(240, 253, 244, 0.95) 0%, rgba(220, 252, 231, 0.65) 100%)',
                            border: '1px solid rgba(187, 247, 208, 0.9)',
                            borderRadius: '16px',
                            display: 'flex',
                            gap: '14px',
                            alignItems: 'flex-start',
                            boxShadow: '0 4px 16px -2px rgba(22, 101, 52, 0.06)'
                        }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '12px',
                                background: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.4rem',
                                boxShadow: '0 2px 8px rgba(22, 101, 52, 0.12)',
                                flexShrink: 0
                            }}>
                                🤖
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{
                                    fontSize: '0.74rem',
                                    fontWeight: '800',
                                    color: '#15803D',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em'
                                }}>
                                    {ui.mentorName} • {ui.mentorSubtitle}
                                </span>
                                <span style={{
                                    fontSize: '0.94rem',
                                    fontWeight: '600',
                                    color: '#14532D',
                                    lineHeight: 1.65
                                }}>
                                    {currentModule.summary}
                                </span>
                            </div>
                        </div>

                        {/* Card: Core Concept Intuition */}
                        <div style={{
                            padding: '20px 22px',
                            background: '#FFFFFF',
                            border: '1px solid rgba(226, 232, 240, 0.9)',
                            borderRadius: '16px',
                            boxShadow: '0 3px 12px -2px rgba(15, 23, 42, 0.04)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#B45309'
                                }}>
                                    <Sparkles size={15} />
                                </div>
                                <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0F172A' }}>
                                    {ui.whatIsIt}
                                </span>
                            </div>
                            <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                                {currentModule.overview.what}
                            </p>
                        </div>

                        {/* Card: How Hardware Works Under the Hood */}
                        <div style={{
                            padding: '20px 22px',
                            background: '#F8FAFC',
                            border: '1px solid rgba(226, 232, 240, 0.9)',
                            borderRadius: '16px',
                            boxShadow: '0 3px 12px -2px rgba(15, 23, 42, 0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #E0F2FE, #BAE6FD)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#0369A1'
                                }}>
                                    <Cpu size={15} />
                                </div>
                                <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0F172A' }}>
                                    {ui.howItWorks}
                                </span>
                            </div>
                            <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                                {currentModule.overview.howItWorks}
                            </p>
                        </div>

                        {/* Card: Real-World Engineering */}
                        <div style={{
                            padding: '20px 22px',
                            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                            border: '1px solid #FDE68A',
                            borderRadius: '16px',
                            boxShadow: '0 3px 12px -2px rgba(146, 64, 14, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                <div style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#15803D'
                                }}>
                                    <Globe size={15} />
                                </div>
                                <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#92400E' }}>
                                    {ui.realWorld}
                                </span>
                            </div>
                            <p style={{ margin: 0, color: '#78350F', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                                {currentModule.overview.realWorld}
                            </p>
                        </div>

                        {/* Card: Guru Pro-Tip (If available) */}
                        {currentModule.guruTip && (
                            <div style={{
                                padding: '20px 22px',
                                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                                border: '1px solid #BFDBFE',
                                borderRadius: '16px',
                                boxShadow: '0 3px 12px -2px rgba(30, 64, 175, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #EDE9FE, #DDD6FE)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#6D28D9'
                                    }}>
                                        <Zap size={15} />
                                    </div>
                                    <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#1E40AF' }}>
                                        {ui.guruTip}
                                    </span>
                                </div>
                                <p style={{ margin: 0, color: '#1E3A8A', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                                    {currentModule.guruTip}
                                </p>
                            </div>
                        )}

                        {/* Interactive Brain Check Quiz (If available) */}
                        {currentModule.quiz && (
                            <div style={{
                                padding: '20px 22px',
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                borderRadius: '16px',
                                boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                                    <div style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '8px',
                                        background: 'linear-gradient(135deg, #FFE4E6, #FECDD3)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#E11D48'
                                    }}>
                                        <HelpCircle size={15} />
                                    </div>
                                    <span style={{ fontSize: '0.98rem', fontWeight: '800', color: '#0F172A' }}>
                                        {ui.quickQuiz}
                                    </span>
                                </div>

                                <span style={{ fontSize: '0.94rem', fontWeight: '700', color: '#1E293B', lineHeight: 1.6 }}>
                                    {currentModule.quiz.question}
                                </span>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {currentModule.quiz.options.map((opt, optIdx) => {
                                        const isSelected = quizAnswer === optIdx;
                                        const isCorrect = optIdx === currentModule.quiz.correctIndex;
                                        let btnBg = '#F8FAFC';
                                        let btnBorder = '#E2E8F0';
                                        let btnColor = '#334155';

                                        if (quizChecked) {
                                            if (isCorrect) {
                                                btnBg = '#DCFCE7';
                                                btnBorder = '#86EFAC';
                                                btnColor = '#166534';
                                            } else if (isSelected && !isCorrect) {
                                                btnBg = '#FEE2E2';
                                                btnBorder = '#FCA5A5';
                                                btnColor = '#991B1B';
                                            }
                                        } else if (isSelected) {
                                            btnBg = '#E0F2FE';
                                            btnBorder = '#7DD3FC';
                                            btnColor = '#0369A1';
                                        }

                                        return (
                                            <button
                                                key={optIdx}
                                                onClick={() => {
                                                    setQuizAnswer(optIdx);
                                                    setQuizChecked(true);
                                                }}
                                                style={{
                                                    padding: '11px 16px',
                                                    borderRadius: '10px',
                                                    background: btnBg,
                                                    border: `1px solid ${btnBorder}`,
                                                    color: btnColor,
                                                    fontSize: '0.88rem',
                                                    fontWeight: '600',
                                                    lineHeight: 1.5,
                                                    textAlign: 'left',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                <span>{opt}</span>
                                                {quizChecked && isCorrect && <Check size={16} color="#166534" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {quizChecked && (
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        background: quizAnswer === currentModule.quiz.correctIndex ? '#DCFCE7' : '#FEE2E2',
                                        color: quizAnswer === currentModule.quiz.correctIndex ? '#166534' : '#991B1B',
                                        fontSize: '0.88rem',
                                        fontWeight: '600',
                                        lineHeight: 1.6
                                    }}>
                                        {quizAnswer === currentModule.quiz.correctIndex ? ui.correctFeedback : ui.wrongFeedback}
                                        {currentModule.quiz.explanation && (
                                            <div style={{ marginTop: '6px', fontWeight: '500', opacity: 0.95 }}>
                                                💡 {currentModule.quiz.explanation}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Key Terminology Cards */}
                        {rawModule.terminology && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <BookOpen size={16} color="#0284C7" />
                                    <span style={{ fontSize: '0.96rem', fontWeight: '800', color: '#0F172A' }}>
                                        Technical Glossary & Terms
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {rawModule.terminology.map((t, idx) => (
                                        <div key={idx} style={{
                                            padding: '14px 18px',
                                            background: '#FFFFFF',
                                            border: '1px solid #E2E8F0',
                                            borderLeft: '4px solid #0284C7',
                                            borderRadius: '10px',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                            lineHeight: 1.7
                                        }}>
                                            <span style={{ fontWeight: '800', color: '#0284C7', fontSize: '0.9rem' }}>
                                                {t.term}:
                                            </span>{' '}
                                            <span style={{ color: '#475569', fontSize: '0.88rem' }}>
                                                {t.def}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Call to action at bottom of Overview to jump to Levels */}
                        <div style={{
                            padding: '18px 22px',
                            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
                            border: '1px solid #BAE6FD',
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '8px',
                            boxShadow: '0 4px 16px -2px rgba(2, 132, 199, 0.08)'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0369A1' }}>
                                    Ready to build & test?
                                </div>
                                <div style={{ fontSize: '0.84rem', color: '#0C4A6E', marginTop: '2px' }}>
                                    Explore what you will learn at each level and make code changes!
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTab('levels')}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '7px',
                                    background: 'linear-gradient(135deg, #0284C7, #0369A1)',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '9px 18px',
                                    fontSize: '0.84rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                                    whiteSpace: 'nowrap',
                                    transition: 'all 0.15s ease'
                                }}
                            >
                                <span>{ui.levelsTab}</span>
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. WHAT YOU'LL LEARN AT EACH LEVEL & CHALLENGES TAB */}
                {activeTab === 'levels' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>
                                    {ui.levelsTab}
                                </div>
                                <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px', lineHeight: 1.5 }}>
                                    Linear progression: see what you learn at each level, make code changes, and test!
                                </div>
                            </div>
                        </div>

                        {/* Level Cards */}
                        {currentModule.levels.map((lvl, idx) => (
                            <div key={idx} style={{
                                padding: '20px 24px',
                                background: '#FFFFFF',
                                border: '1px solid #CBD5E1',
                                borderRadius: '16px',
                                boxShadow: '0 4px 16px -2px rgba(15, 23, 42, 0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px'
                            }}>
                                {/* Level Header Row */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            fontSize: '0.76rem',
                                            fontWeight: '800',
                                            background: 'linear-gradient(135deg, #0284C7, #0369A1)',
                                            color: '#FFFFFF',
                                            padding: '4px 11px',
                                            borderRadius: '7px',
                                            letterSpacing: '0.4px',
                                            textTransform: 'uppercase',
                                            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                                        }}>
                                            {ui.levelLabel} {lvl.level}
                                        </span>
                                        <span style={{ fontSize: '1.02rem', fontWeight: '800', color: '#0F172A' }}>
                                            {lvl.name}
                                        </span>
                                    </div>

                                    {/* Real Visual Blockly Block Introduced */}
                                    {lvl.newBlock && (
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-end',
                                            gap: '6px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                <span style={{
                                                    fontSize: '0.68rem',
                                                    fontWeight: '800',
                                                    color: '#64748B',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.04em'
                                                }}>
                                                    {ui.newBlockIntroduced}
                                                </span>
                                                <span style={{
                                                    fontSize: '0.62rem',
                                                    fontWeight: '800',
                                                    color: '#7C3AED',
                                                    background: '#F5F3FF',
                                                    border: '1px solid #DDD6FE',
                                                    padding: '1px 6px',
                                                    borderRadius: '4px'
                                                }}>
                                                    BLOCKLY
                                                </span>
                                            </div>
                                            <RealBlockPreview 
                                                blockText={lvl.newBlock}
                                                level={lvl}
                                                xml={lvl.xml}
                                                onLoadXml={onLoadXml}
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* 1. What You Will Learn in this Level */}
                                {lvl.whatYouLearn && (
                                    <div style={{
                                        padding: '14px 18px',
                                        background: 'rgba(240, 249, 255, 0.9)',
                                        border: '1px solid rgba(186, 230, 253, 0.9)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '3px'
                                    }}>
                                        <span style={{
                                            fontSize: '0.74rem',
                                            fontWeight: '800',
                                            color: '#0369A1',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.04em'
                                        }}>
                                            {ui.whatYouLearn}
                                        </span>
                                        <span style={{ color: '#075985', fontSize: '0.9rem', fontWeight: '600', lineHeight: 1.7 }}>
                                            {lvl.whatYouLearn}
                                        </span>
                                    </div>
                                )}

                                {/* 2. Concept & Electronics Details */}
                                <p style={{ margin: 0, color: '#334155', fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                                    {lvl.desc}
                                </p>

                                {/* 3. Level Changes & Challenge Mission */}
                                <div style={{
                                    padding: '14px 18px',
                                    background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                                    border: '1px solid #FDE68A',
                                    borderRadius: '12px',
                                    color: '#92400E',
                                    fontSize: '0.89rem',
                                    lineHeight: 1.7,
                                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.06)'
                                }}>
                                    <div style={{ fontWeight: '800', marginBottom: '4px', color: '#78350F', fontSize: '0.82rem' }}>
                                        {ui.levelMission}
                                    </div>
                                    <span>{lvl.challenge}</span>
                                </div>

                                {/* 4. Load Level Blocks into Workspace Button */}
                                <button
                                    onClick={() => handleLoadLevel(lvl)}
                                    style={{
                                        alignSelf: 'flex-start',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '10px',
                                        padding: '10px 20px',
                                        fontSize: '0.84rem',
                                        fontWeight: '700',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                                        marginTop: '4px',
                                        transition: 'all 0.15s ease'
                                    }}
                                >
                                    <Play size={14} fill="#FFFFFF" />
                                    <span>{ui.loadLevelBlocks} ({ui.levelLabel} {lvl.level})</span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. HARDWARE & PINOUT TAB */}
                {activeTab === 'pinout' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>
                            {ui.pinsTab}
                        </div>
                        <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem', lineHeight: 1.7 }}>
                            The microcontroller pins connected to this module on the Ten Robotics ESP32 PCB:
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {rawModule.pinout.map((p, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '14px 18px',
                                    background: '#F8FAFC',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '12px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{
                                            fontFamily: 'monospace',
                                            fontWeight: '800',
                                            fontSize: '0.84rem',
                                            background: '#E2E8F0',
                                            color: '#1E293B',
                                            padding: '4px 9px',
                                            borderRadius: '6px'
                                        }}>
                                            {p.pin}
                                        </span>
                                        <span style={{ fontWeight: '700', color: '#0F172A', fontSize: '0.92rem' }}>
                                            {p.label}
                                        </span>
                                    </div>
                                    <span style={{ color: '#64748B', fontSize: '0.86rem' }}>
                                        {p.desc}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Sticky Action Footer */}
            <div style={{
                padding: '14px 24px',
                background: '#F8FAFC',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0
            }}>
                <button
                    onClick={() => {
                        const firstLvl = currentModule.levels[0];
                        if (firstLvl) handleLoadLevel(firstLvl);
                    }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '9px',
                        padding: '9px 16px',
                        color: '#0F172A',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s ease'
                    }}
                >
                    <Sparkles size={14} color="#0284C7" />
                    <span>Reset Starter Blocks</span>
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === CURRICULUM_MODULES.length - 1}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #0284C7, #0369A1)',
                        border: 'none',
                        borderRadius: '9px',
                        padding: '9px 20px',
                        color: '#FFFFFF',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        cursor: currentIndex === CURRICULUM_MODULES.length - 1 ? 'default' : 'pointer',
                        opacity: currentIndex === CURRICULUM_MODULES.length - 1 ? 0.4 : 1,
                        boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)',
                        transition: 'all 0.15s ease'
                    }}
                >
                    <span>{ui.nextModule}</span>
                    <ArrowRight size={15} />
                </button>
            </div>
        </div>
    );
}

export { InteractiveCurriculumGuide };
