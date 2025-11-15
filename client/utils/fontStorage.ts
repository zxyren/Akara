import type { LoadedFont } from "@/types/font";

const DB_NAME = "FontPreviewDB";
const STORE_NAME = "fonts";
const DB_VERSION = 1;

// Initialize IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
  });
};

// Save fonts to IndexedDB
export const saveFontsToStorage = async (fonts: LoadedFont[]): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // Clear existing fonts
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve(undefined);
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    // Add all fonts
    for (const font of fonts) {
      await new Promise((resolve, reject) => {
        const addRequest = store.add(font);
        addRequest.onsuccess = () => resolve(undefined);
        addRequest.onerror = () => reject(addRequest.error);
      });
    }

    db.close();
  } catch (error) {
    console.error("Error saving fonts to storage:", error);
  }
};

// Load fonts from IndexedDB
export const loadFontsFromStorage = async (): Promise<LoadedFont[]> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    const fonts = await new Promise<LoadedFont[]>((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    db.close();
    return fonts;
  } catch (error) {
    console.error("Error loading fonts from storage:", error);
    return [];
  }
};

// Clear all fonts from storage
export const clearFontsFromStorage = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve(undefined);
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    db.close();
  } catch (error) {
    console.error("Error clearing fonts from storage:", error);
  }
};