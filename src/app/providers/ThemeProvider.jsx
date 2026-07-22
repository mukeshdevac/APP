import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEMES = ['dark', 'light', 'neon', 'retro'];

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme');
        return (saved && THEMES.includes(saved)) ? saved : 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        THEMES.forEach(t => root.classList.remove(`${t}-theme`));
        root.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => {
            const nextIndex = (THEMES.indexOf(prev) + 1) % THEMES.length;
            return THEMES[nextIndex];
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
