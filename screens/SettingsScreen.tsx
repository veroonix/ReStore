import React from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Languages, Moon } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { useStyles } from '../hooks/useStyles';
import { Colors } from '../constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { theme, isDark, toggleTheme } = useTheme();
  
  const styles = useStyles();
  const currentLang = i18n.language;

  const handleThemeToggle = (value: boolean) => {
    toggleTheme(value ? 'dark' : 'light');
  };

  const handleLanguageChange = async (lang: 'ru' | 'en') => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem('userLanguage', lang); // сохраняем выбор
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>{t('settings')}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('appearance')}</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Moon size={20} color={Colors[theme].text} />
                </View>
                <Text style={styles.rowText}>{t('darkTheme')}</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={Colors[theme].switchTrack}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('appSettings')}</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                  <Languages size={20} color={Colors[theme].primary} />
                </View>
                <Text style={styles.rowText}>{t('lang')}</Text>
              </View>
              <View style={styles.langButtons}>
                <TouchableOpacity
                  onPress={() => handleLanguageChange('ru')}
                  style={[styles.langBadge, currentLang === 'ru' && styles.activeBadge]}
                >
                  <Text style={[styles.langBadgeText, currentLang === 'ru' && styles.activeBadgeText]}>RU</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleLanguageChange('en')}
                  style={[styles.langBadge, currentLang === 'en' && styles.activeBadge]}
                >
                  <Text style={[styles.langBadgeText, currentLang === 'en' && styles.activeBadgeText]}>EN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}