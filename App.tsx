import React, { useEffect, useState } from 'react';
import './i18n';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initCacheDB } from './database';
import { ThemeProvider } from './context/ThemeContext';
import { ThemedNavigation } from './components/ThemedNavigation';
import i18n from './i18n';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import * as Notifications from 'expo-notifications';
import { NetworkStatusBar } from './components/NetworkStatusBar';
import { AuthProvider } from './context/AuthContext';

enableScreens();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const scheduleNotificationsFromSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('notificationsEnabled');
      const timeStr = await AsyncStorage.getItem('notificationTime');
      if (enabled === 'true' && timeStr) {
        const time = new Date(timeStr);
        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Re:Store',
            body: 'Пора проверить новые объявления!',
          },
          trigger: {
            hour: time.getHours(),
            minute: time.getMinutes(),
            repeats: true,
          } as any,
        });
      }
    } catch (error) {
      console.warn('Failed to schedule notifications:', error);
    }
  };

  useEffect(() => {
    async function prepare() {
      try {
        await initCacheDB();
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'dark' || savedTheme === 'light') {
          setTheme(savedTheme);
        }

        const savedLang = await AsyncStorage.getItem('userLanguage');
        if (savedLang === 'ru' || savedLang === 'en') {
          await i18n.changeLanguage(savedLang);
        }

        await Notifications.setNotificationChannelAsync('default', {
          name: 'Default',
          importance: Notifications.AndroidImportance.HIGH,
        });

        await scheduleNotificationsFromSettings();

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

  useEffect(() => {
    if (isReady) {
      const requestPermissions = async () => {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          console.log('Уведомления не разрешены');
        }
      };
      requestPermissions();
    }
  }, [isReady]);

  if (!isReady) return null;

  return (
    <SafeAreaProvider>
      <NetworkStatusBar />
      <ThemeProvider initialTheme={theme}>
        <AuthProvider>
          <ThemedNavigation />
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}