import React, { useEffect, useState } from 'react';
import './i18n';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDB } from './database';
import { ThemeProvider } from './context/ThemeContext';
import { ThemedNavigation } from './components/ThemedNavigation';
import i18n from './i18n'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
enableScreens();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    async function prepare() {
      try {
        await initDB();
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setTheme(savedTheme);
        }
        const savedLang = await AsyncStorage.getItem('userLanguage');
        if (savedLang === 'ru' || savedLang === 'en') {
          await i18n.changeLanguage(savedLang); // устанавливаем язык
        }
        // Небольшая задержка
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme={theme}>
        <ThemedNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
    
  );
}