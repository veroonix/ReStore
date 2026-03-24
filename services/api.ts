// services/api.ts
import { Ad } from '../types';

const BASE_URL = 'https://dummyjson.com/products';

const mapProductToAd = (product: any): Ad => ({
  id: product.id,
  title: product.title,
  description: product.description,
  price: product.price.toString(),
  currency: 'USD',
  dealType: 'sale',
  date: new Date().toLocaleDateString(),
  imageUrl: product.thumbnail,
});

export const fetchAdsFromAPI = async (): Promise<Ad[]> => {
  try {
    const response = await fetch(`${BASE_URL}?limit=10`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.products.map(mapProductToAd);
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};