import type { LoadedFont } from "@/types/font";

const DB_NAME = "FontPreviewDB";
const STORE_NAME = "fonts";
const SKIPPED_STORE_NAME = "skippedFonts";
const DB_VERSION = 2; // Increment version to add new store

// Initialize IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create fonts store
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
      
      // Create skipped fonts store
      if (!db.objectStoreNames.contains(SKIPPED_STORE_NAME)) {
        db.createObjectStore(SKIPPED_STORE_NAME, { keyPath: "id", autoIncrement: true });
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

    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve(undefined);
      clearRequest.onerror = () => reject(clearRequest.error);
    });

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

// Save skipped fonts to IndexedDB
export const saveSkippedFontsToStorage = async (
  skippedFonts: Array<{ name: string; reason: string }>
): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(SKIPPED_STORE_NAME, "readwrite");
    const store = transaction.objectStore(SKIPPED_STORE_NAME);

    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve(undefined);
      clearRequest.onerror = () => reject(clearRequest.error);
    });

    for (const skipped of skippedFonts) {
      await new Promise((resolve, reject) => {
        const addRequest = store.add(skipped);
        addRequest.onsuccess = () => resolve(undefined);
        addRequest.onerror = () => reject(addRequest.error);
      });
    }

    db.close();
  } catch (error) {
    console.error("Error saving skipped fonts to storage:", error);
  }
};

// Load skipped fonts from IndexedDB
export const loadSkippedFontsFromStorage = async (): Promise<
  Array<{ name: string; reason: string }>
> => {
  try {
    const db = await openDB();
    const transaction = db.transaction(SKIPPED_STORE_NAME, "readonly");
    const store = transaction.objectStore(SKIPPED_STORE_NAME);

    const skippedFonts = await new Promise<Array<{ name: string; reason: string }>>(
      (resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      }
    );

    db.close();
    return skippedFonts;
  } catch (error) {
    console.error("Error loading skipped fonts from storage:", error);
    return [];
  }
};

// Clear all fonts and skipped fonts from storage
export const clearFontsFromStorage = async (): Promise<void> => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME, SKIPPED_STORE_NAME], "readwrite");
    
    const fontsStore = transaction.objectStore(STORE_NAME);
    const skippedStore = transaction.objectStore(SKIPPED_STORE_NAME);

    await Promise.all([
      new Promise((resolve, reject) => {
        const clearRequest = fontsStore.clear();
        clearRequest.onsuccess = () => resolve(undefined);
        clearRequest.onerror = () => reject(clearRequest.error);
      }),
      new Promise((resolve, reject) => {
        const clearRequest = skippedStore.clear();
        clearRequest.onsuccess = () => resolve(undefined);
        clearRequest.onerror = () => reject(clearRequest.error);
      }),
    ]);

    db.close();
  } catch (error) {
    console.error("Error clearing fonts from storage:", error);
  }
};
