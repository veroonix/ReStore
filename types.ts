export interface Ad {
  id?: number;
  title: string;
  description: string;
  price: string;    // Цена или пометка "Обмен"
  date: string;     // Дата публикации
}



// types.ts
export type RootStackParamList = {
  Main: undefined;
  Details: { ad: Ad };
  Settings: undefined;
  AdForm?: { adId?: number }; // необязательный параметр id для редактирования
};