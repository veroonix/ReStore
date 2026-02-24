export type DealType = 'sale' | 'free' | 'exchange';

export interface Ad {
  id?: number;
  title: string;
  description: string | null;
  price: string | null;        
  currency: string | null;     
  dealType: DealType;          
  date: string;                
}

export type RootStackParamList = {
  Main: undefined;
  Details: { ad: Ad };
  Settings: undefined;
  AdForm?: { adId?: number }; 
};