// database.ts
import * as SQLite from 'expo-sqlite';
import { Ad } from './types';

const db = SQLite.openDatabaseSync('marketplace.db');

export const initDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS ads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      price TEXT,
      date TEXT
    );
  `);
};

// CREATE
export const addAd = async (ad: Omit<Ad, 'id'>): Promise<number> => {
  const result = await db.runAsync(
    'INSERT INTO ads (title, description, price, date) VALUES (?, ?, ?, ?)',
    [ad.title, ad.description, ad.price, ad.date]
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
    'UPDATE ads SET title = ?, description = ?, price = ?, date = ? WHERE id = ?',
    [ad.title, ad.description, ad.price, ad.date, id]
  );
};

// DELETE
export const deleteAd = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM ads WHERE id = ?', [id]);
};