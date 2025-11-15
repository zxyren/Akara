import { useState, useEffect } from "react";
import type { LoadedFont } from "@/types/font";
import { AppHeader } from "@/components/AppHeader";
import { UploadSection } from "@/components/UploadSection";
import { FontSearch } from "@/components/FontSearch";
import { PreviewTextSection } from "@/components/PreviewTextSection";
import { FontList } from "@/components/FontList";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { validateFontFile, logFontDiagnostics } from "@/utils/fontValidator";
import { saveFontsToStorage, loadFontsFromStorage, clearFontsFromStorage } from "@/utils/fontStorage";
import { IconInfoTriangleFilled } from "@tabler/icons-react";

const DEFAULT_TEXTS = { en: "The quick brown fox jumps over the lazy dog", km: "ខ្ញុំស្រលាញ់ភាសាខ្មែរ និងវប្បធម៌របស់ខ្មែរ" };
const ITEMS_PER_PAGE = 15;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BATCH_SIZE = 20;

export default function FontPreview() {
  const [fonts, setFonts] = useState<LoadedFont[]>([]);
  const [previewText, setPreviewText] = useState(DEFAULT_TEXTS);
  const [activeLanguage, setActiveLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("preferredLanguage");
    return (saved as Language) || "en";
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState({ current: 0, total: 0 });
  const [skippedFonts, setSkippedFonts] = useState<Array<{ name: string, reason: string }>>([]);
  const [showSkippedModal, setShowSkippedModal] = useState(false);
  const [isLoadingFromStorage, setIsLoadingFromStorage] = useState(true);

  const { t } = useI18n(activeLanguage);

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

  const getFileExtension = (filename: string) => filename.split(".").pop()?.toLowerCase() || "";
  const getFontFormat = (filename: string): string => {
    const formatMap: { [key: string]: string } = { ttf: "truetype", otf: "opentype", woff: "woff", woff2: "woff2" };
    return formatMap[getFileExtension(filename)] || "truetype";
  };
  const filteredFonts = fonts.filter((font) => font.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const processFontFile = (file: File): Promise<LoadedFont | { error: string } | null> => {
    return new Promise((resolve) => {
      if (file.size > MAX_FILE_SIZE) {
        resolve({ error: `Too large (${(file.size / 1024 / 1024).toFixed(2)} MB, limit: ${MAX_FILE_SIZE / 1024 / 1024} MB)` });
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

          const fontFamily = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9\s-]/g, "-").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
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
      const timeout = setTimeout(() => { reader.abort(); resolve({ error: "Read timeout" }); }, 5000);
      reader.onloadend = () => clearTimeout(timeout);
      reader.readAsDataURL(file);
    });
  };

  const processFontsInBatches = async (files: File[]) => {
    setIsProcessing(true);
    setProcessProgress({ current: 0, total: files.length });
    const skipped: Array<{ name: string, reason: string }> = [];
    const fontFiles = files.filter((file) => /\.(ttf|otf|woff|woff2)$/i.test(file.name));

    try {
      for (let i = 0; i < fontFiles.length; i += BATCH_SIZE) {
        const batch = fontFiles.slice(i, i + BATCH_SIZE);
        const results = await Promise.all(batch.map(async (file) => {
          try {
            return await processFontFile(file);
          } catch (err) {
            return { error: "Unexpected error" };
          }
        }));

        const validFonts: LoadedFont[] = [];
        results.forEach((result, idx) => {
          if (result && 'error' in result) {
            skipped.push({ name: batch[idx].name, reason: result.error });
          } else if (result) {
            validFonts.push(result as LoadedFont);
          }
        });

        setFonts((prev) => [...prev, ...validFonts]);
        setProcessProgress({ current: Math.min(i + BATCH_SIZE, fontFiles.length), total: fontFiles.length });
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) await processFontsInBatches(Array.from(files));
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) await processFontsInBatches(Array.from(files));
  };

  const removeFont = (index: number) => setFonts((prev) => prev.filter((_, i) => i !== index));
  const copyFontName = (name: string) => { navigator.clipboard.writeText(name); setCopied(name); setTimeout(() => setCopied(null), 2000); };
  const handleSearch = (query: string) => { setSearchQuery(query); setCurrentPage(1); };
  const handleClearAll = async () => { 
    setFonts([]); 
    setSearchQuery(""); 
    setCurrentPage(1); 
    await clearFontsFromStorage();
  };
  const handleLanguageChange = (lang: Language) => {
    setActiveLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  if (isLoadingFromStorage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-poppins flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading fonts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-poppins">
      <AppHeader activeLanguage={activeLanguage} onLanguageChange={handleLanguageChange} />
      {showSkippedModal && (
        <div className={`${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"
          } fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4`}>
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <h3 className="text-xl font-medium text-red-400"><IconInfoTriangleFilled size={24} className="text-yellow-500 inline-block mr-2" /> {skippedFonts.length} {t("upload.skippedFonts")}</h3>
              <p className="text-sm text-slate-400 mt-2">{t("upload.fontsNotLoaded")}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {skippedFonts.map((font, idx) => (
                  <div key={idx} className="bg-slate-700/50 rounded p-3 text-sm">
                    <div className="font-medium text-slate-200 break-all">{font.name}</div>
                    <div className="text-sm text-slate-400 mt-1">Reason: {font.reason}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button onClick={() => setShowSkippedModal(false)} className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium">Close</button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isProcessing && (
          <div className="mb-6 bg-cyan-900/30 border border-cyan-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-cyan-300">Processing fonts...</span>
              <span className="text-sm text-cyan-300">{processProgress.current} / {processProgress.total}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-1">
              <div className="bg-cyan-500 h-1 rounded-full transition-all duration-300" style={{ width: `${(processProgress.current / processProgress.total) * 100}%` }} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <UploadSection fontsCount={fonts.length} onFileUpload={handleFileUpload} onFolderUpload={handleFolderUpload} activeLanguage={activeLanguage} skippedFontsCount={skippedFonts.length} onShowSkipped={() => setShowSkippedModal(true)} />
              {fonts.length > 0 && <FontSearch searchQuery={searchQuery} onSearchChange={handleSearch} onClearAll={handleClearAll} filteredFontsCount={filteredFonts.length} totalFontsCount={fonts.length} activeLanguage={activeLanguage} />}
              <PreviewTextSection previewText={previewText[activeLanguage]} onTextChange={(text) => setPreviewText({ ...previewText, [activeLanguage]: text })} activeLanguage={activeLanguage} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <FontList fonts={fonts} filteredFonts={filteredFonts} currentPage={currentPage} onPageChange={setCurrentPage} previewText={previewText[activeLanguage]} activeLanguage={activeLanguage} copied={copied} onRemove={removeFont} onCopy={copyFontName} getFileExtension={getFileExtension} getFontFormat={getFontFormat} ITEMS_PER_PAGE={ITEMS_PER_PAGE} />
          </div>
        </div>
      </main>

      <footer className={`${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"
        } border-t border-slate-700 bg-slate-900/50 backdrop-blur-md mt-12 sm:mt-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-400 text-sm">
          <p>{t("footer.text")}</p>
        </div>
      </footer>
    </div>
  );
}