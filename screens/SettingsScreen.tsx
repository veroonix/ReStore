import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Languages, Moon, ArrowLeft, Bell } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { getSharedStyles } from '../styles/sharedStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const currentLang = i18n.language;

  const shared = useMemo(() => getSharedStyles(theme), [theme]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Загрузка настроек уведомлений при монтировании
  useEffect(() => {
    const loadNotificationSettings = async () => {
      const enabled = await AsyncStorage.getItem('notificationsEnabled');
      const timeStr = await AsyncStorage.getItem('notificationTime');
      if (enabled !== null) setNotificationsEnabled(enabled === 'true');
      if (timeStr) setNotificationTime(new Date(timeStr));
    };
    loadNotificationSettings();
  }, []);

  // Планирование или отмена уведомления
  const scheduleNotification = async (enabled: boolean, time: Date) => {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (enabled) {
      await Notifications.scheduleNotificationAsync({
      content: {
        title: t('notificationTitle'),
        body: t('notificationBody'),
      },
      trigger: {
        hour: time.getHours(),
        minute: time.getMinutes(),
        repeats: true,
      } as any, 
    });
    }
  };

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(value));
    await scheduleNotification(value, notificationTime);
    if (value) {
      Alert.alert(t('success'), t('notificationsScheduled'));
    }
  };

  const onTimeChange = async (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setNotificationTime(selectedDate);
      await AsyncStorage.setItem('notificationTime', selectedDate.toISOString());
      if (notificationsEnabled) {
        await scheduleNotification(true, selectedDate);
        Alert.alert(t('success'), t('notificationTimeUpdated'));
      }
    }
  };

  const handleThemeToggle = (value: boolean) => {
    toggleTheme(value ? 'dark' : 'light');
  };

  const handleLanguageChange = async (lang: 'ru' | 'en') => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('userLanguage', lang);
  };

  return (
    <View style={[shared.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={shared.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backButton}>
          <ArrowLeft size={24} color={Colors[theme].text} />
        </TouchableOpacity>
        <Text style={shared.headerTitle}>{t('settings')}</Text>
      </View>

      <ScrollView
        style={shared.content}
        contentContainerStyle={{ paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Секция "Внешний вид" */}
        <View>
          <Text style={shared.sectionLabel}>{t('appearance')}</Text>
          <View style={shared.card}>
            <View style={shared.row}>
              <View style={shared.rowLeft}>
                <View style={shared.iconBox}>
                  <Moon size={20} color={Colors[theme].text} />
                </View>
                <Text style={shared.rowText}>{t('darkTheme')}</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={Colors[theme].switchTrack}
              />
            </View>
          </View>
        </View>

        {/* Секция "Приложение" */}
        <View style={{ marginTop: 24 }}>
          <Text style={shared.sectionLabel}>{t('appSettings')}</Text>
          <View style={shared.card}>
            <View style={shared.row}>
              <View style={shared.rowLeft}>
                <View style={shared.iconBox}>
                  <Languages size={20} color={Colors[theme].primary} />
                </View>
                <Text style={shared.rowText}>{t('lang')}</Text>
              </View>
              <View style={shared.langButtons}>
                <TouchableOpacity
                  onPress={() => handleLanguageChange('ru')}
                  style={[shared.langBadge, currentLang === 'ru' && shared.activeBadge]}
                >
                  <Text style={[shared.langBadgeText, currentLang === 'ru' && shared.activeBadgeText]}>RU</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleLanguageChange('en')}
                  style={[shared.langBadge, currentLang === 'en' && shared.activeBadge]}
                >
                  <Text style={[shared.langBadgeText, currentLang === 'en' && shared.activeBadgeText]}>EN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Секция "Уведомления" */}
        <View style={{ marginTop: 24 }}>
          <Text style={shared.sectionLabel}>{t('notifications')}</Text>
          <View style={shared.card}>
            <View style={shared.row}>
              <View style={shared.rowLeft}>
                <View style={shared.iconBox}>
                  <Bell size={20} color={Colors[theme].primary} />
                </View>
                <Text style={shared.rowText}>{t('dailyReminder')}</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={Colors[theme].switchTrack}
              />
            </View>
            {notificationsEnabled && (
              <TouchableOpacity
                style={[shared.row, { borderTopWidth: 1, borderTopColor: Colors[theme].border }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={shared.rowText}>{t('reminderTime')}</Text>
                <Text style={[shared.rowText, { color: Colors[theme].primary }]}>
                  {notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {showTimePicker && (
        <DateTimePicker
          value={notificationTime}
          mode="time"
          is24Hour={false}
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}