import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Plus, Settings, PackageOpen, Edit, Trash2 } from 'lucide-react-native';
import { RootStackParamList, Ad } from '../types';
import { getAllAds, deleteAd } from '../database';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';

type MainScreenProps = StackNavigationProp<RootStackParamList, 'Main'>;

export default function MainScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<MainScreenProps>();
  const { theme, isDark } = useTheme();
  const [ads, setAds] = useState<Ad[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const data = await getAllAds();
    setAds(data);
  };

  // Обновляем данные при возвращении на экран (например, после добавления/редактирования)
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
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
              await deleteAd(id);
              await loadData(); // перезагружаем список
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось удалить объявление');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Ad }) => (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.cardTouchable}
        onPress={() => navigation.navigate('Details', { ad: item })}
      >
        <View style={styles.cardContent}>
          <View style={styles.textContainer}>
            <Text style={styles.adTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.adPrice}>{item.price}</Text>
          </View>
          <Text style={styles.adDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.cardActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AdForm', { adId: item.id })}
          style={styles.actionButton}
        >
          <Edit size={18} color={Colors[theme].primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id!)}
          style={styles.actionButton}
        >
          <Trash2 size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
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
    iconButton: {
      padding: 8,
      backgroundColor: Colors[theme].iconBackground,
      borderRadius: 12,
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
    fab: {
      position: 'absolute',
      bottom: 30,
      right: 20,
      backgroundColor: Colors[theme].primary,
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
    },
  }), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('mainTitle')}</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')}
          style={styles.iconButton}
        >
          <Settings size={24} color={Colors[theme].text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={ads}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await loadData();
          setRefreshing(false);
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <PackageOpen size={64} color={Colors[theme].secondaryText} />
            <Text style={styles.emptyText}>{t('noAds')}</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate('AdForm')}
        activeOpacity={0.8}
      >
        <Plus color="#FFF" size={28} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}