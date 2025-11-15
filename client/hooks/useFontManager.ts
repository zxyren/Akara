import { useState, useEffect } from "react";
import type { LoadedFont } from "@/types/font";
import { validateFontFile, logFontDiagnostics } from "@/utils/fontValidator";
import { saveFontsToStorage, loadFontsFromStorage, clearFontsFromStorage } from "@/utils/fontStorage";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BATCH_SIZE = 20;

export const useFontManager = () => {
  const [fonts, setFonts] = useState<LoadedFont[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState({ current: 0, total: 0 });
  const [skippedFonts, setSkippedFonts] = useState<Array<{ name: string; reason: string }>>([]);
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(true);

  // Load fonts from IndexedDB on mount
  useEffect(() => {
    const loadStoredFonts = async () => {
      setIsLoadingFromStorage(true);
      const storedFonts = await loadFontsFromStorage();
      if (storedFonts.length > 0) {
        setFonts(storedFonts);
      }
      setIsLoadingFromStorage(false);
    };
    loadStoredFonts();
  }, []);

  // Save fonts to IndexedDB whenever fonts array changes
  useEffect(() => {
    if (!isLoadingFromStorage) {
      saveFontsToStorage(fonts);
    }
  }, [fonts, isLoadingFromStorage]);

  const processFontFile = (file: File): Promise<LoadedFont | { error: string } | null> => {
    return new Promise((resolve) => {
      if (file.size > MAX_FILE_SIZE) {
        resolve({
          error: `Too large (${(file.size / 1024 / 1024).toFixed(2)} MB, limit: ${MAX_FILE_SIZE / 1024 / 1024} MB)`,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const fontData = event.target?.result as string;
          if (fontData.length > 10 * 1024 * 1024) {
            resolve({ error: "Data too large after encoding" });
            return;
          }

          const fontFamily = file.name
            .replace(/\.[^.]+$/, "")
            .replace(/[^a-zA-Z0-9\s-]/g, "-")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim();

          const validation = validateFontFile(file, fontData);
          logFontDiagnostics(file.name, validation);

          if (!validation.isValid) {
            resolve({ error: "Invalid font format" });
            return;
          }

          resolve({ name: file.name, file, fontData, fontFamily });
        } catch (error) {
          resolve({ error: `Load error: ${error}` });
        }
      };
      reader.onerror = () => resolve({ error: "Failed to read file" });
      const timeout = setTimeout(() => {
        reader.abort();
        resolve({ error: "Read timeout" });
      }, 5000);
      reader.onloadend = () => clearTimeout(timeout);
      reader.readAsDataURL(file);
    });
  };

  const processFontsInBatches = async (files: File[]) => {
    setIsProcessing(true);
    setProcessProgress({ current: 0, total: files.length });
    const skipped: Array<{ name: string; reason: string }> = [];
    const fontFiles = files.filter((file) => /\.(ttf|otf|woff|woff2)$/i.test(file.name));

    try {
      for (let i = 0; i < fontFiles.length; i += BATCH_SIZE) {
        const batch = fontFiles.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(
          batch.map(async (file) => {
            try {
              return await processFontFile(file);
            } catch (err) {
              return { error: "Unexpected error" };
            }
          })
        );

        const validFonts: LoadedFont[] = [];
        results.forEach((result, idx) => {
          if (result && "error" in result) {
            skipped.push({ name: batch[idx].name, reason: result.error });
          } else if (result) {
            validFonts.push(result as LoadedFont);
          }
        });

        setFonts((prev) => [...prev, ...validFonts]);
        setProcessProgress({
          current: Math.min(i + BATCH_SIZE, fontFiles.length),
          total: fontFiles.length,
        });
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    } catch (error) {
      console.error("Fatal error during batch processing:", error);
      alert("An error occurred while processing fonts. Some fonts may not have loaded.");
    }

    setIsProcessing(false);
    setProcessProgress({ current: 0, total: 0 });
    if (skipped.length > 0) setSkippedFonts(skipped);
  };

  const removeFont = (index: number) => {
    setFonts((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFonts = async () => {
    setFonts([]);
    await clearFontsFromStorage();
  };

  return {
    fonts,
    isProcessing,
    processProgress,
    skippedFonts,
    isLoadingFromStorage,
    processFontsInBatches,
    removeFont,
    clearAllFonts,
    setSkippedFonts,
  };
};