import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { RootStackParamList } from '../types';
import { addAd, updateAd, getAdById } from '../database';

type AdFormRouteProp = RouteProp<RootStackParamList, 'AdForm'>;
type AdFormNavigationProp = StackNavigationProp<RootStackParamList, 'AdForm'>;

export default function AdFormScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<AdFormNavigationProp>();
  const route = useRoute<AdFormRouteProp>();
  const { theme } = useTheme();
  const adId = route.params?.adId;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  // Динамический заголовок в зависимости от режима (добавление/редактирование)
  useLayoutEffect(() => {
    navigation.setOptions({
      title: adId ? t('editAd') : t('addAd'),
    });
  }, [navigation, adId, t]);

  useEffect(() => {
    if (adId) {
      loadAd(adId);
    }
  }, [adId]);

  const loadAd = async (id: number) => {
    try {
      const ad = await getAdById(id);
      if (ad) {
        setTitle(ad.title);
        setDescription(ad.description || '');
        setPrice(ad.price || '');
      }
    } catch (error) {
      Alert.alert(t('error'), t('failedLoadAd'));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('error'), t('titleRequired'));
      return;
    }

    const adData = {
      title: title.trim(),
      description: description.trim(),
      price: price.trim(),
      date: new Date().toLocaleDateString(), // Дата на устройстве (можно локализовать через i18n, если нужно)
    };

    setLoading(true);
    try {
      if (adId) {
        await updateAd(adId, adData);
        Alert.alert(t('success'), t('adUpdated'));
      } else {
        await addAd(adData);
        Alert.alert(t('success'), t('adAdded'));
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('error'), t('failedSaveAd'));
    } finally {
      setLoading(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          <Text style={styles.label}>{t('title')} *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={t('placeholderTitle')}
            placeholderTextColor={Colors[theme].secondaryText}
          />

          <Text style={styles.label}>{t('description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('placeholderDescription')}
            placeholderTextColor={Colors[theme].secondaryText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.label}>{t('price')}</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            placeholder={t('placeholderPrice')}
            placeholderTextColor={Colors[theme].secondaryText}
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? t('saving') : (adId ? t('update') : t('add'))}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (theme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
    },
    form: {
      backgroundColor: Colors[theme].card,
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors[theme].text,
      marginBottom: 6,
      marginTop: 12,
    },
    input: {
      backgroundColor: Colors[theme].background,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      borderRadius: 12,
      padding: 12,
      fontSize: 16,
      color: Colors[theme].text,
    },
    textArea: {
      minHeight: 100,
    },
    saveButton: {
      backgroundColor: Colors[theme].primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
    },
    disabledButton: {
      opacity: 0.6,
    },
    saveButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });