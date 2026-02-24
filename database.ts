// database.ts
import * as SQLite from 'expo-sqlite';
import { Ad } from './types';

const db = SQLite.openDatabaseSync('marketplace.db');

export const initDB = async () => {
 // await db.execAsync(`DROP TABLE IF EXISTS ads;`);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT,
      currency TEXT,
      dealType TEXT NOT NULL DEFAULT 'sale',
      date TEXT
    );
  `);
};

// CREATE
export const addAd = async (ad: Omit<Ad, 'id'>): Promise<number> => {
  const result = await db.runAsync(
    'INSERT INTO ads (title, description, price, currency, dealType, date) VALUES (?, ?, ?, ?, ?, ?)',
    [ad.title, ad.description, ad.price, ad.currency, ad.dealType, ad.date]
  );
  return result.lastInsertRowId;
};

// READ all
export const getAllAds = async (): Promise<Ad[]> => {
  return await db.getAllAsync('SELECT * FROM ads ORDER BY id DESC');
};

// READ one
export const getAdById = async (id: number): Promise<Ad | null> => {
  const result = await db.getFirstAsync<Ad>('SELECT * FROM ads WHERE id = ?', [id]);
  return result ?? null;
};

// UPDATE
export const updateAd = async (id: number, ad: Omit<Ad, 'id'>): Promise<void> => {
  await db.runAsync(
    'UPDATE ads SET title = ?, description = ?, price = ?, currency = ?, dealType = ?, date = ? WHERE id = ?',
    [ad.title, ad.description, ad.price, ad.currency, ad.dealType, ad.date, id]
  );
};

// DELETE
export const deleteAd = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM ads WHERE id = ?', [id]);
};

// Заполнение тестовыми данными (если таблица пуста)
export const seedAdsIfNeeded = async () => {
  const existingAds = await getAllAds();
  if (existingAds.length > 0) return; 

  const sampleAds: Omit<Ad, 'id'>[] = [
    {
      title: "Горный велосипед Author",
      description: "Продам горный велосипед Author Tracker, 26 дюймов, алюминиевая рама, дисковые гидравлические тормоза, передняя амортизация. В отличном состоянии, пробег небольшой. Торг уместен.",
      price: "25000",
      currency: "BYN",
      dealType: "sale",
      date: new Date().toLocaleDateString(),
    },
    {
      title: "1-комнатная квартира в центре",
      description: "Сдам 1-комнатную квартиру в центре. Евроремонт, мебель, техника, хорошая транспортная доступность. Без животных. Срок от 1 года.",
      price: "35000",
      currency: "BYN",
      dealType: "sale",
      date: new Date().toLocaleDateString(),
    },
    {
      title: "Репетитор по английскому языку",
      description: "Преподаватель с опытом 10 лет, индивидуальные занятия для детей и взрослых. Подготовка к экзаменам, разговорный английский. Возможен выезд или онлайн.",
      price: "1000",
      currency: "BYN",
      dealType: "sale",
      date: new Date().toLocaleDateString(),
    },
    {
      title: "Котята (отдам даром)",
      description: "Отдадим в добрые руки двухмесячных котят (мальчик и девочка). Привиты, лоток приучены. Очень ласковые, ищут дом.",
      price: null,
      currency: null,
      dealType: "free",
      date: new Date().toLocaleDateString(),
    },
    {
      title: "Меняю iPhone 12 на Android",
      description: "Предлагаю обменять iPhone 12 128GB в отличном состоянии (гарантия до конца года) на аналогичный флагман Android (Samsung S21/22, Xiaomi 12 и т.п.). Рассмотрю варианты.",
      price: null,
      currency: null,
      dealType: "exchange",
      date: new Date().toLocaleDateString(),
    },
  ];

  for (const ad of sampleAds) {
    await addAd(ad);
  }
};