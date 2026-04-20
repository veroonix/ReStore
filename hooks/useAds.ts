import { useState, useCallback, useMemo } from 'react';
import { Ad, DealType } from '../types';
import { fetchUserAds, addUserAd, updateUserAd, deleteUserAd } from '../services/firestoreService';
import { getApiCache, saveApiCache } from '../database';
import { fetchAdsFromAPI } from '../services/api';
import { useNetworkStatus } from './useNetworkStatus';
import Fuse from 'fuse.js';

export const useAds = () => {
  const [userAds, setUserAds] = useState<Ad[]>([]);
  const [apiAds, setApiAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const isConnected = useNetworkStatus();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDealType, setFilterDealType] = useState<DealType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'price'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Загрузка пользовательских объявлений (только из Firestore, только онлайн)
  const loadUserAds = useCallback(async () => {
    if (!isConnected) {
      setUserAds([]);
      return;
    }
    try {
      const ads = await fetchUserAds();
      setUserAds(ads);
    } catch (error) {
      console.warn('Failed to load user ads', error);
    }
  }, [isConnected]);

  // Загрузка API-товаров (с кэшированием в SQLite)
  const loadApiAds = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
    }
  }, [isConnected]);

  // Общая загрузка
  const loadAds = useCallback(async () => {
    await Promise.all([loadUserAds(), loadApiAds()]);
  }, [loadUserAds, loadApiAds]);

  // Создание пользовательского объявления
  const createAd = useCallback(async (ad: Omit<Ad, 'id'>) => {
    if (!isConnected) throw new Error('No internet');
    const id = await addUserAd(ad);
    const newAd = { ...ad, id, isApiAd: false };
    setUserAds(prev => [newAd, ...prev]);
  }, [isConnected]);

  // Редактирование пользовательского объявления
  const editAd = useCallback(async (id: string, ad: Partial<Ad>) => {
    if (!isConnected) throw new Error('No internet');
    await updateUserAd(id, ad);
    setUserAds(prev => prev.map(item => item.id === id ? { ...item, ...ad } : item));
  }, [isConnected]);

  // Удаление пользовательского объявления
  const removeAd = useCallback(async (id: string) => {
    if (!isConnected) throw new Error('No internet');
    await deleteUserAd(id);
    setUserAds(prev => prev.filter(item => item.id !== id));
  }, [isConnected]);

  const getAdById = useCallback((id: string): Ad | undefined => {
    return userAds.find(ad => ad.id === id) || apiAds.find(ad => ad.id === id);
  }, [userAds, apiAds]);
  // Объединённый список всех объявлений
  const allAds = useMemo(() => [...userAds, ...apiAds], [userAds, apiAds]);

  // Нечёткий поиск по объединённому списку
  const fuse = useMemo(() => new Fuse(allAds, {
    keys: ['title', 'description'],
    threshold: 0.4,
  }), [allAds]);

  // Фильтрация, поиск, сортировка
  const filteredAds = useMemo(() => {
    let result = allAds;
    if (filterDealType !== 'all') {
      result = result.filter(ad => ad.dealType === filterDealType);
    }
    if (searchQuery.trim()) {
      const fuseResults = fuse.search(searchQuery);
      result = fuseResults.map(r => r.item);
    }
    result.sort((a, b) => {
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
    return result;
  }, [allAds, searchQuery, filterDealType, sortBy, sortOrder, fuse]);

  return {
    ads: filteredAds,
    loading,
    loadAds,
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