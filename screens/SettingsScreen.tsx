import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { Languages, Moon, ChevronRight, Info, ShieldCheck } from 'lucide-react-native';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('theme').then(val => setIsDarkMode(val === 'dark'));
  }, []);

  const toggleTheme = async (value: boolean) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem('theme', value ? 'dark' : 'light');
  };

  const currentLang = i18n.language;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>{t('settings')}</Text>

        {/* Секция: Интерфейс */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Внешний вид</Text> 
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#F0F0F0' }]}>
                  <Moon size={20} color="#1A1A1A" />
                </View>
                <Text style={styles.rowText}>{t('darkTheme')}</Text>
              </View>
              <Switch 
                value={isDarkMode} 
                onValueChange={toggleTheme}
                trackColor={{ false: '#D1D1D6', true: '#00b574' }}
              />
            </View>
          </View>
        </View>

        {/* Секция: Язык */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Приложение</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: '#E8F5E9' }]}>
                  <Languages size={20} color="#00b574" />
                </View>
                <Text style={styles.rowText}>{t('lang')}</Text>
              </View>
              <View style={styles.langButtons}>
                <TouchableOpacity 
                  onPress={() => i18n.changeLanguage('ru')}
                  style={[styles.langBadge, currentLang === 'ru' && styles.activeBadge]}
                >
                  <Text style={[styles.langBadgeText, currentLang === 'ru' && styles.activeBadgeText]}>RU</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => i18n.changeLanguage('en')}
                  style={[styles.langBadge, currentLang === 'en' && styles.activeBadge]}
                >
                  <Text style={[styles.langBadgeText, currentLang === 'en' && styles.activeBadgeText]}>EN</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.divider} />

           
          </View>
        </View>

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { fontSize: 32, fontWeight: '800', padding: 20, color: '#1A1A1A' },
  section: { marginBottom: 24 },
  sectionLabel: { marginHorizontal: 20, marginBottom: 8, fontSize: 13, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { backgroundColor: '#FFF', marginHorizontal: 16, borderRadius: 16, paddingVertical: 4, elevation: 1, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 2 } },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, paddingHorizontal: 16 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowText: { fontSize: 16, fontWeight: '500', color: '#1A1A1A' },
  divider: { height: 1, backgroundColor: '#F2F2F2', marginLeft: 64 },
  langButtons: { flexDirection: 'row', gap: 8 },
  langBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F2F2F2' },
  activeBadge: { backgroundColor: '#00b574' },
  langBadgeText: { fontWeight: '600', color: '#666' },
  activeBadgeText: { color: '#FFF' },
  versionText: { color: '#CCC', fontSize: 14 },
});