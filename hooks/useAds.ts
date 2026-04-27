import { useState, useEffect, useCallback, useMemo } from 'react';
import { Ad, DealType } from '../types';
import { subscribeToUserAds, addUserAd, updateUserAd, deleteUserAd } from '../services/firestoreService';
import { getApiCache, saveApiCache } from '../database';
import { fetchAdsFromAPI } from '../services/api';
import { useNetworkStatus } from './useNetworkStatus';
import Fuse from 'fuse.js';


export const useAds = () => {
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [apiAds, setApiAds] = useState<Ad[]>([]);
  const [loadingApi, setLoadingApi] = useState(false);
  const isConnected = useNetworkStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDealType, setFilterDealType] = useState<DealType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // **Подписка на реальные обновления пользовательских объявлений**
  useEffect(() => {
  if (!isConnected) {
    setUserAds([]);
    return;
  }
  const unsubscribe = subscribeToUserAds((ads) => {
    
    setUserAds(ads);
  });
  return () => unsubscribe();
}, [isConnected]);

  // Загрузка API-товаров (кэш) – без изменений
  const loadApiAds = useCallback(async () => {
    setLoadingApi(true);
    try {
      if (isConnected) {
        const fresh = await fetchAdsFromAPI();
        await saveApiCache(fresh);
        setApiAds(fresh);
      } else {
        const cached = await getApiCache();
        setApiAds(cached);
      }
    } catch (error) {
      const cached = await getApiCache();
      setApiAds(cached);
    } finally {
      setLoadingApi(false);
    }
  }, [isConnected]);

  // При запуске загружаем API-часть (пользовательские сами придут через подписку)
  useEffect(() => {
    loadApiAds();
  }, [loadApiAds]);

  const createAd = useCallback(async (ad: Omit<Ad, 'id'>) => {
    if (!isConnected) throw new Error('No internet');
    await addUserAd(ad);
  }, [isConnected]);

  const editAd = useCallback(async (id: string, ad: Partial<Ad>) => {
    if (!isConnected) throw new Error('No internet');
    await updateUserAd(id, ad);
  }, [isConnected]);

  const removeAd = useCallback(async (id: string) => {
    if (!isConnected) throw new Error('No internet');
    await deleteUserAd(id);
  }, [isConnected]);

  // Объединённый список
  const allAds = useMemo(() => [...userAds, ...apiAds], [userAds, apiAds]);

  // Поиск и фильтрация (как было)
  const fuse = useMemo(() => new Fuse(allAds, {
    keys: ['title', 'description'],
    threshold: 0.3,           // 0.0 = точное совпадение, 1.0 = очень нечёткое
    distance: 100,            // расстояние для нечёткого совпадения
    ignoreLocation: true,     // искать по всему тексту, а не только в начале
    // minMatchCharLength: 2, // минимальная длина совпадения (опционально)
  }), [allAds]);


// Фильтрация, поиск, сортировка
const filteredAds = useMemo(() => {
  // 1. Начинаем с фильтрации по типу (создаем новый массив)
  let result = filterDealType === 'all' 
    ? [...allAds] 
    : allAds.filter(ad => ad.dealType === filterDealType);

  // 2. Нечёткий поиск (если есть запрос)
  if (searchQuery.trim()) {
    // Важно: поиск по уже отфильтрованному списку или по всему? 
    // Обычно ищут по всему, а потом фильтруют. 
    // Если хотите искать только внутри категории, используйте:
    const searcher = new Fuse(result, {
      keys: ['title', 'description'],
      threshold: 0.4,
    });
    result = searcher.search(searchQuery).map(r => r.item);
  }

  return result.sort((a, b) => {
    let aVal: number, bVal: number;
    if (sortBy === 'date') {
      aVal = new Date(a.date).getTime();
      bVal = new Date(b.date).getTime();
    } else {
      aVal = parseFloat(a.price || '0');
      bVal = parseFloat(b.price || '0');
    }
    
    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });
}, [allAds, searchQuery, filterDealType, sortBy, sortOrder]); 

 
  const getAdById = useCallback((id: string): Ad | undefined => {
  return allAds.find(ad => ad.id === id);
}, [allAds]);
  return {
    ads: filteredAds,
    loading: loadingApi,         // только API-часть может грузиться, пользовательские приходят мгновенно
    loadAds: loadApiAds,        // для перезагрузки API-кэша (можно оставить)
    createAd,
    editAd,
    removeAd,
    searchQuery,
    setSearchQuery,
    filterDealType,
    setFilterDealType,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    getAdById
  };
};