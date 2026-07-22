import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Zap, Monitor } from 'lucide-react';
import { useTheme } from '../../app/providers/ThemeProvider';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const getIcon = () => {
        switch (theme) {
            case 'light': return <Sun size={20} style={{ color: '#f59e0b' }} />;
            case 'neon': return <Zap size={20} style={{ color: '#00f2ff' }} />;
            case 'retro': return <Monitor size={20} style={{ color: '#ffb000' }} />;
            default: return <Moon size={20} style={{ color: 'var(--primary)' }} />;
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-secondary"
            style={{
                width: '40px',
                height: '40px',
                padding: '0',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
                background: 'var(--surface-light)',
                border: '1px solid var(--border)',
                transition: 'all 0.3s ease'
            }}
            aria-label="Toggle Theme"
            title={`Switch Theme (Current: ${theme})`}
        >
            <AnimatePresence mode="wait">
                <Motion.div
                    key={theme}
                    initial={{ y: 20, opacity: 0, scale: 0.5, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, scale: 0.5, rotate: 90 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    style={{ position: 'absolute' }}
                >
                    {getIcon()}
                </Motion.div>
            </AnimatePresence>
        </button>
    );
};

export default ThemeToggle;
