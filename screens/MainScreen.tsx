import React, { useCallback, useMemo, useState } from 'react';
import { Image } from 'react-native';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Plus, Settings, PackageOpen, Edit, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, Ad } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { getSharedStyles } from '../styles/sharedStyles';
import { useAds } from '../hooks/useAds';

type MainScreenProps = StackNavigationProp<RootStackParamList, 'Main'>;

export default function MainScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<MainScreenProps>();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const { ads, loading, loadAds, removeAd } = useAds();

  const shared = useMemo(() => getSharedStyles(theme), [theme]);

  useFocusEffect(
    useCallback(() => {
      loadAds();
    }, [loadAds])
  );

  const handleDelete = (id: number) => {
    Alert.alert(
      t('confirmDelete'),
      '',
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await removeAd(id);
            } catch (error) {
              Alert.alert(t('error'), t('failedDeleteAd'));
            }
          },
        },
      ]
    );
  };

  const getPriceDisplay = useCallback((ad: Ad) => {
    if (ad.dealType === 'free') return t('free');
    if (ad.dealType === 'exchange') return t('exchange');
    return ad.price ? `${ad.price} ${ad.currency || ''}` : '';
  }, [t]);

  const renderItem = ({ item }: { item: Ad }) => (
    <View style={localStyles.card}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={localStyles.cardTouchable}
        onPress={() => navigation.navigate('Details', { ad: item })}
      >
        <View style={localStyles.cardContent}>
          {item.imageUrl && (
      <Image source={{ uri: item.imageUrl }} style={localStyles.image} />
    )}
          <View style={localStyles.textContainer}>
            <Text style={localStyles.adTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={localStyles.adPrice}>{getPriceDisplay(item)}</Text>
          </View>
          <Text style={localStyles.adDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
      <View style={localStyles.cardActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AdForm', { adId: item.id })}
          style={localStyles.actionButton}
        >
          <Edit size={18} color={Colors[theme].primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id!)}
          style={localStyles.actionButton}
        >
          <Trash2 size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const localStyles = useMemo(() => StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: Colors[theme].card,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '800',
      color: Colors[theme].text,
      letterSpacing: -0.5,
    },
    listContent: {
      paddingBottom: 100,
      paddingTop: 10,
    },
    card: {
      backgroundColor: Colors[theme].card,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },
    cardTouchable: {
      flex: 1,
    },
    cardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    textContainer: {
      flex: 1,
      marginRight: 10,
    },
    adTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: Colors[theme].text,
      marginBottom: 4,
    },
    adPrice: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors[theme].primary,
    },
    adDate: {
      fontSize: 12,
      color: Colors[theme].secondaryText,
      fontWeight: '500',
    },
    cardActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 12,
      gap: 16,
    },
    actionButton: {
      padding: 4,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 100,
    },
    emptyText: {
      marginTop: 12,
      fontSize: 16,
      color: Colors[theme].secondaryText,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 12,
    },
  }), [theme]);

  return (
    <View style={[shared.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={localStyles.header}>
        <Text style={localStyles.headerTitle}>{t('mainTitle')}</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')}
          style={shared.iconButton}
        >
          <Settings size={24} color={Colors[theme].text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={ads}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={localStyles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await loadAds();
          setRefreshing(false);
        }}
        ListEmptyComponent={
          <View style={localStyles.emptyContainer}>
            <PackageOpen size={64} color={Colors[theme].secondaryText} />
            <Text style={localStyles.emptyText}>{t('noAds')}</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={shared.fab}
        onPress={() => navigation.navigate('AdForm')}
        activeOpacity={0.8}
      >
        <Plus color="#FFF" size={28} />
      </TouchableOpacity>
    </View>
  );
}