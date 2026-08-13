import { createContext, useContext } from 'react';

export const ThemeContext = createContext();

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        console.error('❌ useTheme was used outside of ThemeProvider');
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    console.log('✅ useTheme returned context:', context);
    return context;
}
