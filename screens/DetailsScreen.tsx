import React, { useMemo } from 'react';
import { Image } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../types';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { ArrowLeft, Edit } from 'lucide-react-native';
import { getSharedStyles } from '../styles/sharedStyles';

type DetailsRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsNavigationProp = StackNavigationProp<RootStackParamList, 'Details'>;

export default function DetailsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<DetailsNavigationProp>();
  const route = useRoute<DetailsRouteProp>();
  const { ad } = route.params;
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const shared = useMemo(() => getSharedStyles(theme), [theme]);

  const getPriceDisplay = () => {
    if (ad.dealType === 'free') return t('free');
    if (ad.dealType === 'exchange') return t('exchange');
    return ad.price ? `${ad.price} ${ad.currency || ''}` : '';
  };

  const localStyles = useMemo(() => StyleSheet.create({
    content: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 10,
    },
    price: {
      fontSize: 20,
      color: Colors[theme].primary,
      marginBottom: 15,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: Colors[theme].secondaryText,
      marginBottom: 20,
    },
    date: {
      fontSize: 14,
      color: Colors[theme].secondaryText,
    },
    header: {
    ...shared.header,
    justifyContent: 'space-between',
    },
    detailImage: {
      width: '100%',
      height: 200,
      borderRadius: 12,
      marginBottom: 16,
      resizeMode: 'cover',
    },
  }), [theme]);

  const handleEdit = () => {
    navigation.navigate('AdForm', { adId: ad.id });
  };

  return (
    <View style={[shared.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Кастомный хедер */}
      <View style={localStyles.header }>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={shared.backButton}>
            <ArrowLeft size={24} color={Colors[theme].text} />
          </TouchableOpacity>
          <Text style={shared.headerTitle}>{t('details')}</Text>
        </View>
        <TouchableOpacity onPress={handleEdit} style={shared.iconButton}>
          <Edit size={22} color={Colors[theme].primary} />
        </TouchableOpacity>
      </View>

      <View style={localStyles.content}>
         {ad.imageUrl && (
            <Image source={{ uri: ad.imageUrl }} style={localStyles.detailImage} />
          )}
        <Text style={localStyles.title}>{ad.title}</Text>
        <Text style={localStyles.price}>{getPriceDisplay()}</Text>
        <Text style={localStyles.description}>{ad.description}</Text>
        <Text style={localStyles.date}>{t('added')}: {ad.date}</Text>
      </View>
    </View>
  );t
}