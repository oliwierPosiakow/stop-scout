import { openDB, type IDBPDatabase } from 'idb';

export const dbPromise: Promise<IDBPDatabase> = openDB('StopScoutDB', 2, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('favorites')) {
      db.createObjectStore('favorites', { keyPath: 'stopId' });
    }
    if (!db.objectStoreNames.contains('users')) {
      const usersStore = db.createObjectStore('users', { keyPath: 'username' });
      usersStore.createIndex('createdAt', 'createdAt');
    }
  },
});
