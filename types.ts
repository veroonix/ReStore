export type DealType = 'sale' | 'free' | 'exchange';

export interface Ad {
  id: string;                     // теперь строка (Firestore ID)
  title: string;
  description: string | null;
  price: string | null;
  currency: string | null;
  dealType: DealType;
  date: string;
  imageUrl?: string | null;
  isApiAd?: boolean;              // true для товаров из API (кэш), false для пользовательских
}
export type RootStackParamList = {
  Main: undefined;
  Details: { ad: Ad };
  Settings: undefined;
  AdForm?: { adId?: string }; 
};