import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { UserSettings } from '@/types';
import { StorageService } from '@/services/storageService';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  notification: string;
}

export interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F8F9FA',
  primary: '#1531d1',        // Classic gold
  secondary: '#FFA500',      // Orange-gold
  accent: '#B8860B',         // Dark gold
  text: '#1A1A1A',          // Near black for readability
  textSecondary: '#4A4A4A',  // Dark gray
  border: '#E5E5E5',        // Light gray border
  card: '#FFFFFF',
  notification: '#DC3545'    // Red for errors
};

const darkColors: ThemeColors = {
  background: '#000000',     // Deep black
  surface: '#1A1A1A',       // Very dark gray
  primary: '#1531d1',        // Classic gold
  secondary: '#FFA500',      // Orange-gold  
  accent: '#F4D03F',         // Light gold
  text: '#FFFFFF',          // Pure white text
  textSecondary: '#B8B8B8',  // Light gray
  border: '#333333',        // Dark gray border
  card: '#1A1A1A',          // Very dark gray
  notification: '#FF6B6B'    // Light red for errors
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>({
    fontSize: 16,
    themeMode: 'auto',
    autoSync: true
  });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    updateTheme();
  }, [settings.themeMode]);

  const loadSettings = async () => {
    const savedSettings = await StorageService.getSettings();
    setSettings(savedSettings);
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await StorageService.saveSettings(updatedSettings);
  };

  const updateTheme = () => {
    if (settings.themeMode === 'dark') {
      setIsDark(true);
    } else if (settings.themeMode === 'light') {
      setIsDark(false);
    } else {
      // Auto mode - check time
      const hour = new Date().getHours();
      setIsDark(hour < 6 || hour >= 18); // Dark from 6 PM to 6 AM
    }
  };

  const toggleTheme = () => {
    const newMode = settings.themeMode === 'dark' ? 'light' : 
                   settings.themeMode === 'light' ? 'auto' : 'dark';
    updateSettings({ themeMode: newMode });
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{
      isDark,
      colors,
      settings,
      updateSettings,
      toggleTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}