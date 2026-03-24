import { useState, useCallback } from 'react';
import { Ad } from '../types';
import { getAllAds, addAd, updateAd, deleteAd, saveAdsFromAPI } from '../database';
import { fetchAdsFromAPI } from '../services/api';
import { useNetworkStatus } from './useNetworkStatus';

export const useAds = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(false);
  const isConnected = useNetworkStatus();

   const loadAds = useCallback(async () => {
    setLoading(true);
    try {
      if (isConnected) {
        const apiAds = await fetchAdsFromAPI();
        await saveAdsFromAPI(apiAds);
      }
      // После обновления API (или если интернета нет) всегда показываем всё, что есть в БД
      const allAds = await getAllAds();
      setAds(allAds);
    } catch (error) {
      const allAds = await getAllAds();
      setAds(allAds);
    } finally {
      setLoading(false);
    }
  }, [isConnected]);

  // При создании/редактировании просто сохраняем локально (можно добавить флаг synced)
  const createAd = useCallback(async (ad: Omit<Ad, 'id'>) => {
    await addAd(ad);
    await loadAds(); // перезагружаем список
  }, [loadAds]);

  const editAd = useCallback(async (id: number, ad: Omit<Ad, 'id'>) => {
    await updateAd(id, ad);
    await loadAds();
  }, [loadAds]);

  const removeAd = useCallback(async (id: number) => {
    await deleteAd(id);
    await loadAds();
  }, [loadAds]);

  return { ads, loading, loadAds, createAd, editAd, removeAd };
};