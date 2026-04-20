// database.ts
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('cache.db');

export const initCacheDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS api_cache (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT,
      currency TEXT,
      dealType TEXT NOT NULL,
      date TEXT,
      imageUrl TEXT
    );
  `);
};

export const getApiCache = async (): Promise<any[]> => {
  return await db.getAllAsync('SELECT * FROM api_cache ORDER BY date DESC');
};

export const saveApiCache = async (items: any[]) => {
  await db.runAsync('DELETE FROM api_cache');
  for (const item of items) {
    await db.runAsync(
      `INSERT INTO api_cache (id, title, description, price, currency, dealType, date, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.id, item.title, item.description, item.price, item.currency, item.dealType, item.date, item.imageUrl]
    );
  }
};