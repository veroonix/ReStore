import React, { useMemo } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Languages, Moon, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { getSharedStyles } from '../styles/sharedStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const currentLang = i18n.language;

  const shared = useMemo(() => getSharedStyles(theme), [theme]);

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
      </ScrollView>
    </View>
  );
}