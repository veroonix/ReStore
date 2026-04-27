import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { RootStackParamList, DealType } from '../types';
import { getSharedStyles } from '../styles/sharedStyles';
import { useAds } from '../hooks/useAds';

type AdFormRouteProp = RouteProp<RootStackParamList, 'AdForm'>;
type AdFormNavigationProp = StackNavigationProp<RootStackParamList, 'AdForm'>;

const CURRENCIES = ['BYN', 'USD', 'EUR'];

export default function AdFormScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<AdFormNavigationProp>();
  const route = useRoute<AdFormRouteProp>();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const adId = route.params?.adId; // string | undefined

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [dealType, setDealType] = useState<DealType>('sale');
  const [currency, setCurrency] = useState('BYN');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { createAd, editAd, getAdById } = useAds();
  const shared = useMemo(() => getSharedStyles(theme), [theme]);

  useEffect(() => {
  if (adId) {
    const ad = getAdById(adId);
    if (ad) {
      setTitle(ad.title);
      setDescription(ad.description || '');
      setPrice(ad.price || '');
      setDealType(ad.dealType);
      setCurrency(ad.currency || 'BYN');
      setImageUri(ad.imageUrl || null);
    } else {
     // Alert.alert(t('error'), t('failedLoadAd'));
    }
  }
}, [adId, getAdById, t]);

  const takePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(t('error'), t('cameraPermissionRequired'));
    return;
  }
  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
  });
  if (!result.canceled && result.assets[0].uri) {
    const newUri = result.assets[0].uri;
    const fileName = `${Date.now()}.jpg`;
    const destPath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.copyAsync({ from: newUri, to: destPath });
    setImageUri(destPath);
  }
};

const pickFromGallery = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.5,
  });
  if (!result.canceled && result.assets[0].uri) {
    const newUri = result.assets[0].uri;
    const fileName = `${Date.now()}.jpg`;
    const destPath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.copyAsync({ from: newUri, to: destPath });
    setImageUri(destPath);
  }
};

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('error'), t('titleRequired'));
      return;
    }

    const finalPrice = dealType === 'sale' ? price.trim() : null;
    const finalCurrency = dealType === 'sale' ? currency : null;

    const adData = {
      title: title.trim(),
      description: description.trim(),
      price: finalPrice,
      currency: finalCurrency,
      dealType,
      date: new Date().toISOString(),
      imageUrl: imageUri,
    };

    setLoading(true);
    try {
      if (adId) {
        await editAd(adId, adData);
        Alert.alert(t('success'), t('adUpdated'));
      } else {
        await createAd(adData);
        Alert.alert(t('success'), t('adAdded'));
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('error'), t('failedSaveAd'));
    } finally {
      setLoading(false);
    }
  };

  const renderDealTypeButton = (type: DealType, label: string) => (
    <TouchableOpacity
      style={[
        localStyles.dealTypeButton,
        dealType === type && localStyles.dealTypeButtonActive,
      ]}
      onPress={() => setDealType(type)}
    >
      <Text
        style={[
          localStyles.dealTypeText,
          dealType === type && localStyles.dealTypeTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const localStyles = useMemo(() => StyleSheet.create({
    scrollContent: { flexGrow: 1, padding: 20 },
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
    textArea: { minHeight: 100 },
    dealTypeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    dealTypeButton: {
      flex: 1,
      paddingVertical: 10,
      marginHorizontal: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      backgroundColor: Colors[theme].background,
      alignItems: 'center',
    },
    dealTypeButtonActive: { backgroundColor: Colors[theme].primary, borderColor: Colors[theme].primary },
    dealTypeText: { fontWeight: '600', color: Colors[theme].text },
    dealTypeTextActive: { color: '#FFF' },
    priceRow: { flexDirection: 'row', alignItems: 'center' },
    priceInput: { flex: 1, marginRight: 8 },
    pickerContainer: {
      flex: 1,
      backgroundColor: Colors[theme].background,
      borderWidth: 1,
      borderColor: Colors[theme].border,
      borderRadius: 12,
    },
    picker: { height: 50, color: Colors[theme].text },
    infoText: { marginTop: 8, fontSize: 14, color: Colors[theme].secondaryText, fontStyle: 'italic' },
    imagePickerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      backgroundColor: Colors[theme].iconBackground,
      borderRadius: 12,
      marginTop: 12,
    },
    imagePreview: {
      width: 100,
      height: 100,
      borderRadius: 12,
      marginTop: 12,
      alignSelf: 'center',
    },
    saveButton: {
      backgroundColor: Colors[theme].primary,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
    },
    rowText: {
      fontSize: 16,
      fontWeight: '500',
      color: Colors[theme].text,
    },
    disabledButton: { opacity: 0.6 },
    saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  }), [theme]);

  return (
    <View style={[shared.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <View style={shared.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backButton}>
            <ArrowLeft size={24} color={Colors[theme].text} />
          </TouchableOpacity>
          <Text style={shared.headerTitle}>
            {adId ? t('editAd') : t('addAd')}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={localStyles.scrollContent}>
        <View style={localStyles.form}>
          <Text style={localStyles.label}>{t('title')} *</Text>
          <TextInput
            style={localStyles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={t('placeholderTitle')}
            placeholderTextColor={Colors[theme].secondaryText}
          />

          <Text style={localStyles.label}>{t('dealType')}</Text>
          <View style={localStyles.dealTypeContainer}>
            {renderDealTypeButton('sale', t('sale'))}
            {renderDealTypeButton('free', t('free'))}
            {renderDealTypeButton('exchange', t('exchange'))}
          </View>

          {dealType === 'sale' && (
            <>
              <Text style={localStyles.label}>{t('price')}</Text>
              <View style={localStyles.priceRow}>
                <TextInput
                  style={[localStyles.input, localStyles.priceInput]}
                  value={price}
                  onChangeText={setPrice}
                  placeholder={t('placeholderPrice')}
                  placeholderTextColor={Colors[theme].secondaryText}
                  keyboardType="numeric"
                />
                <View style={localStyles.pickerContainer}>
                  <Picker
                    selectedValue={currency}
                    onValueChange={(itemValue) => setCurrency(itemValue)}
                    style={localStyles.picker}
                    dropdownIconColor={Colors[theme].text}
                  >
                    {CURRENCIES.map((cur) => (
                      <Picker.Item key={cur} label={cur} value={cur} />
                    ))}
                  </Picker>
                </View>
              </View>
            </>
          )}

          {dealType === 'free' && <Text style={localStyles.infoText}>{t('freeInfo')}</Text>}
          {dealType === 'exchange' && <Text style={localStyles.infoText}>{t('exchangeInfo')}</Text>}

          <Text style={localStyles.label}>{t('description')}</Text>
          <TextInput
            style={[localStyles.input, localStyles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('placeholderDescription')}
            placeholderTextColor={Colors[theme].secondaryText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity onPress={takePhoto} style={[localStyles.imagePickerButton, { flex: 1, marginRight: 8 }]}>
            <ImageIcon size={20} color={Colors[theme].primary} />
            <Text style={[localStyles.rowText, { marginLeft: 8 }]}>{t('takePhoto')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickFromGallery} style={[localStyles.imagePickerButton, { flex: 1, marginLeft: 8 }]}>
            <ImageIcon size={20} color={Colors[theme].primary} />
            <Text style={[localStyles.rowText, { marginLeft: 8 }]}>{t('chooseFromGallery')}</Text>
          </TouchableOpacity>

          {imageUri && (
            <Image source={{ uri: imageUri }} style={localStyles.imagePreview} />
          )}

          <TouchableOpacity
            style={[localStyles.saveButton, loading && localStyles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={localStyles.saveButtonText}>
              {loading ? t('saving') : (adId ? t('update') : t('add'))}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}