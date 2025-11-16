import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { UploadSection } from "@/components/UploadSection";
import { FontSearch } from "@/components/FontSearch";
import { PreviewTextSection } from "@/components/PreviewTextSection";
import { FontList } from "@/components/FontList";
import { SkippedFontsModal } from "@/components/SkippedFontsModal";
import { ProcessingIndicator } from "@/components/ProcessingIndicator";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { useFontManager } from "@/hooks/useFontManager";
import { getFileExtension, getFontFormat } from "@/utils/fontHelpers";
import { IconHeart, IconSparkles } from "@tabler/icons-react";

const DEFAULT_TEXTS = {
  en: "The quick brown fox jumps over the lazy dog",
  km: "ខ្ញុំស្រលាញ់ភាសាខ្មែរ និងវប្បធម៌របស់ខ្មែរ",
};
const ITEMS_PER_PAGE = 15;

export default function FontPreview() {
  const [previewText, setPreviewText] = useState(DEFAULT_TEXTS);
  const [activeLanguage, setActiveLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("preferredLanguage");
    return (saved as Language) || "en";
  });
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showSkippedModal, setShowSkippedModal] = useState(false);

  const {
    fonts,
    isProcessing,
    processProgress,
    skippedFonts,
    isLoadingFromStorage,
    processFontsInBatches,
    removeFont,
    clearAllFonts,
  } = useFontManager();

  const { t } = useI18n(activeLanguage);

  const filteredFonts = fonts.filter((font) =>
    font.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) await processFontsInBatches(Array.from(files));
  };

  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) await processFontsInBatches(Array.from(files));
  };

  const copyFontName = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleClearAll = async () => {
    await clearAllFonts();
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleLanguageChange = (lang: Language) => {
    setActiveLanguage(lang);
    localStorage.setItem("preferredLanguage", lang);
  };

  if (isLoadingFromStorage) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-poppins">
      <AppHeader activeLanguage={activeLanguage} onLanguageChange={handleLanguageChange} />

      {showSkippedModal && (
        <SkippedFontsModal
          skippedFonts={skippedFonts}
          activeLanguage={activeLanguage}
          onClose={() => setShowSkippedModal(false)}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isProcessing && (
          <ProcessingIndicator current={processProgress.current} total={processProgress.total} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <UploadSection
                fontsCount={fonts.length}
                onFileUpload={handleFileUpload}
                onFolderUpload={handleFolderUpload}
                activeLanguage={activeLanguage}
                skippedFontsCount={skippedFonts.length}
                onShowSkipped={() => setShowSkippedModal(true)}
              />
              {fonts.length > 0 && (
                <FontSearch
                  searchQuery={searchQuery}
                  onSearchChange={handleSearch}
                  onClearAll={handleClearAll}
                  filteredFontsCount={filteredFonts.length}
                  totalFontsCount={fonts.length}
                  activeLanguage={activeLanguage}
                />
              )}
              <PreviewTextSection
                previewText={previewText[activeLanguage]}
                onTextChange={(text) => setPreviewText({ ...previewText, [activeLanguage]: text })}
                activeLanguage={activeLanguage}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <FontList
              fonts={fonts}
              filteredFonts={filteredFonts}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              previewText={previewText[activeLanguage]}
              activeLanguage={activeLanguage}
              copied={copied}
              onRemove={removeFont}
              onCopy={copyFontName}
              getFileExtension={getFileExtension}
              getFontFormat={getFontFormat}
              ITEMS_PER_PAGE={ITEMS_PER_PAGE}
            />
          </div>
        </div>
      </main>


      <footer
        className={`${activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"
          } relative border-t border-slate-700/50 bg-gradient-to-b from-slate-900/50 to-slate-950/80 backdrop-blur-xl mt-12 sm:mt-16 overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" className="w-9 h-w-9" alt="akara Logo" />
            </div>
            <p className="text-slate-400 text-sm max-w-md text-center">
              {t("footer.text")}
            </p>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1.5">
                <span>{t("footer.made-with")}</span>
                <IconHeart size={14} className="text-red-400 fill-red-400" />
                <span>{t("footer.for")}</span>
              </div>
              <span className="hidden sm:block text-xl text-slate-700">•</span>
              <span>&copy; {new Date().getFullYear()} {t("footer.alrights")}</span>
            </div>
          </div>
        </div>
        {/* Bottom glow effect */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </footer>
    </div>
  );
}