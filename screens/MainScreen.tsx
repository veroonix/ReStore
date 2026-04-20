import React, { useCallback, useMemo, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { Plus, Settings, PackageOpen, Edit, Trash2, Search, Filter, ArrowUpDown, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList, Ad, DealType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { getSharedStyles } from '../styles/sharedStyles';
import { useAds } from '../hooks/useAds';

type MainScreenProps = StackNavigationProp<RootStackParamList, 'Main'>;

// Мемоизированный компонент карточки
const AdCard = React.memo(({ 
  item, 
  onPress, 
  onEdit, 
  onDelete, 
  getPriceDisplay, 
  theme 
}: { 
  item: Ad; 
  onPress: (ad: Ad) => void; 
  onEdit: (id: string) => void; 
  onDelete: (id: string) => void; 
  getPriceDisplay: (ad: Ad) => string; 
  theme: 'light' | 'dark';
}) => {
  const styles = useMemo(() => StyleSheet.create({
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
    cardTouchable: { flex: 1 },
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
    actionButton: { padding: 4 },
    image: {
      width: 50,
      height: 50,
      borderRadius: 8,
      marginRight: 12,
    },
  }), [theme]);

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.7} style={styles.cardTouchable} onPress={() => onPress(item)}>
        <View style={styles.cardContent}>
          {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
          <View style={styles.textContainer}>
            <Text style={styles.adTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.adPrice}>{getPriceDisplay(item)}</Text>
          </View>
          <Text style={styles.adDate}>{item.date}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => onEdit(item.id!)} style={styles.actionButton}>
          <Edit size={18} color={Colors[theme].primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id!)} style={styles.actionButton}>
          <Trash2 size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function MainScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<MainScreenProps>();
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [tempFilterType, setTempFilterType] = useState<DealType | 'all'>('all');
  const [tempSortBy, setTempSortBy] = useState<'date' | 'price'>('date');
  const [tempSortOrder, setTempSortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    ads,
    loading,
    loadAds,
    removeAd,
    searchQuery,
    setSearchQuery,
    filterDealType,
    setFilterDealType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
  } = useAds();

  const shared = useMemo(() => getSharedStyles(theme), [theme]);

  useFocusEffect(
    useCallback(() => {
      loadAds();
    }, [loadAds])
  );

  const handleDelete = useCallback((id: string) => {
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
  }, [t, removeAd]);

  const getPriceDisplay = useCallback((ad: Ad) => {
    if (ad.dealType === 'free') return t('free');
    if (ad.dealType === 'exchange') return t('exchange');
    return ad.price ? `${ad.price} ${ad.currency || ''}` : '';
  }, [t]);

  const openFilterModal = () => {
    setTempFilterType(filterDealType);
    setFilterModalVisible(true);
  };

  const applyFilter = () => {
    setFilterDealType(tempFilterType);
    setFilterModalVisible(false);
  };

  const openSortModal = () => {
    setTempSortBy(sortBy);
    setTempSortOrder(sortOrder);
    setSortModalVisible(true);
  };

  const applySort = () => {
    setSortBy(tempSortBy);
    setSortOrder(tempSortOrder);
    setSortModalVisible(false);
  };

  const renderItem = useCallback(({ item }: { item: Ad }) => (
    <AdCard
      item={item}
      onPress={(ad) => navigation.navigate('Details', { ad })}
      onEdit={(id) => navigation.navigate('AdForm', { adId: id })}
      onDelete={handleDelete}
      getPriceDisplay={getPriceDisplay}
      theme={theme}
    />
  ), [navigation, handleDelete, getPriceDisplay, theme]);

  const keyExtractor = useCallback((item: Ad) => item.id?.toString() || `temp-${item.title}`, []);

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
    filterContainer: {
      backgroundColor: Colors[theme].card,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    searchContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors[theme].background,
      borderRadius: 12,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: Colors[theme].border,
    },
    searchIcon: { marginRight: 8 },
    searchInput: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 12,
      color: Colors[theme].text,
    },
    iconButton: {
      padding: 10,
      borderRadius: 12,
      backgroundColor: Colors[theme].iconBackground,
    },
    listContent: {
      paddingBottom: 100,
      paddingTop: 10,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '80%',
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors[theme].border,
    },
    modalOptionText: { fontSize: 16 },
    radioSelected: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    sortOrderContainer: { marginTop: 16 },
    modalSubtitle: { fontSize: 14, marginBottom: 8 },
    sortOrderButtons: { flexDirection: 'row', gap: 12 },
    sortOrderButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: Colors[theme].background,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors[theme].border,
    },
    sortOrderActive: {
      backgroundColor: Colors[theme].primary,
      borderColor: Colors[theme].primary,
    },
    sortOrderText: { color: Colors[theme].text },
    modalApplyButton: {
      marginTop: 20,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalApplyText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  }), [theme]);

  if (loading) {
    return (
      <View style={[shared.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors[theme].primary} />
      </View>
    );
  }

  return (
    <View style={[shared.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={localStyles.header}>
        <Text style={localStyles.headerTitle}>{t('mainTitle')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={shared.iconButton}>
          <Settings size={24} color={Colors[theme].text} />
        </TouchableOpacity>
      </View>

      <View style={localStyles.filterContainer}>
        <View style={localStyles.searchContainer}>
          <Search size={20} color={Colors[theme].secondaryText} style={localStyles.searchIcon} />
          <TextInput
            style={localStyles.searchInput}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor={Colors[theme].secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity onPress={openFilterModal} style={localStyles.iconButton}>
          <Filter size={22} color={Colors[theme].text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openSortModal} style={localStyles.iconButton}>
          <ArrowUpDown size={22} color={Colors[theme].text} />
        </TouchableOpacity>
      </View>

      {/* Модальное окно фильтра */}
      <Modal animationType="fade" transparent visible={filterModalVisible} onRequestClose={() => setFilterModalVisible(false)}>
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContent, { backgroundColor: Colors[theme].card }]}>
            <View style={localStyles.modalHeader}>
              <Text style={[localStyles.modalTitle, { color: Colors[theme].text }]}>{t('filterByType')}</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <X size={24} color={Colors[theme].text} />
              </TouchableOpacity>
            </View>
            {(['all', 'sale', 'free', 'exchange'] as const).map((type) => (
              <TouchableOpacity key={type} style={localStyles.modalOption} onPress={() => setTempFilterType(type)}>
                <Text style={[localStyles.modalOptionText, { color: Colors[theme].text }]}>{t(`filter_${type}`)}</Text>
                {tempFilterType === type && <View style={[localStyles.radioSelected, { backgroundColor: Colors[theme].primary }]} />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={[localStyles.modalApplyButton, { backgroundColor: Colors[theme].primary }]} onPress={applyFilter}>
              <Text style={localStyles.modalApplyText}>{t('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Модальное окно сортировки */}
      <Modal animationType="fade" transparent visible={sortModalVisible} onRequestClose={() => setSortModalVisible(false)}>
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalContent, { backgroundColor: Colors[theme].card }]}>
            <View style={localStyles.modalHeader}>
              <Text style={[localStyles.modalTitle, { color: Colors[theme].text }]}>{t('sortBy')}</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <X size={24} color={Colors[theme].text} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={localStyles.modalOption} onPress={() => setTempSortBy('date')}>
              <Text style={[localStyles.modalOptionText, { color: Colors[theme].text }]}>{t('sort_date')}</Text>
              {tempSortBy === 'date' && <View style={[localStyles.radioSelected, { backgroundColor: Colors[theme].primary }]} />}
            </TouchableOpacity>
            <TouchableOpacity style={localStyles.modalOption} onPress={() => setTempSortBy('price')}>
              <Text style={[localStyles.modalOptionText, { color: Colors[theme].text }]}>{t('sort_price')}</Text>
              {tempSortBy === 'price' && <View style={[localStyles.radioSelected, { backgroundColor: Colors[theme].primary }]} />}
            </TouchableOpacity>
            <View style={localStyles.sortOrderContainer}>
              <Text style={[localStyles.modalSubtitle, { color: Colors[theme].secondaryText }]}>{t('order')}</Text>
              <View style={localStyles.sortOrderButtons}>
                <TouchableOpacity style={[localStyles.sortOrderButton, tempSortOrder === 'asc' && localStyles.sortOrderActive]} onPress={() => setTempSortOrder('asc')}>
                  <Text style={[localStyles.sortOrderText, { color: Colors[theme].text }]}>{t('ascending')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[localStyles.sortOrderButton, tempSortOrder === 'desc' && localStyles.sortOrderActive]} onPress={() => setTempSortOrder('desc')}>
                  <Text style={[localStyles.sortOrderText, { color: Colors[theme].text }]}>{t('descending')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={[localStyles.modalApplyButton, { backgroundColor: Colors[theme].primary }]} onPress={applySort}>
              <Text style={localStyles.modalApplyText}>{t('apply')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={ads}
        keyExtractor={keyExtractor}
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

      <TouchableOpacity style={shared.fab} onPress={() => navigation.navigate('AdForm')} activeOpacity={0.8}>
        <Plus color="#FFF" size={28} />
      </TouchableOpacity>
    </View>
  );
}