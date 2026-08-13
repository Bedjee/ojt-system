import { useState, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem('theme');
        console.log('📦 Initial theme from localStorage:', stored);
        if (stored) return stored;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log('🌓 System preference (dark):', prefersDark);
        return prefersDark ? 'dark' : 'light';
    });

    useEffect(() => {
        console.log('🔄 Theme changed to:', theme);
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            console.log('🌙 Added "dark" class to <html>');
        } else {
            root.classList.remove('dark');
            console.log('☀️ Removed "dark" class from <html>');
        }
        console.log('📋 Current classes on <html>:', root.className);
        localStorage.setItem('theme', theme);
        console.log('💾 Saved theme to localStorage:', theme);
    }, [theme]);

    const toggleTheme = () => {
        console.log('🔄 Toggle button clicked');
        setTheme(prev => {
            const newTheme = prev === 'dark' ? 'light' : 'dark';
            console.log('🔄 Setting theme to:', newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
