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
import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon } from "@hugeicons/core-free-icons";

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-poppins">
      <AppHeader activeLanguage={activeLanguage} onLanguageChange={handleLanguageChange} />

      {showSkippedModal && (
        <SkippedFontsModal
          skippedFonts={skippedFonts}
          activeLanguage={activeLanguage}
          onClose={() => setShowSkippedModal(false)}
        />
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {isProcessing && (
          <ProcessingIndicator current={processProgress.current} total={processProgress.total} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-5">
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
          } border-t border-zinc-800/80 mt-12 sm:mt-14 bg-zinc-900/40`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img src="/logo.png" className="w-8 h-8 opacity-90" alt="akara Logo" />
            <p className="text-zinc-500 text-sm max-w-sm">
              {t("footer.text")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs text-zinc-500">
              <div className="flex items-center gap-1">
                <span>{t("footer.made-with")}</span>
                <HugeiconsIcon icon={FavouriteIcon} size={12} className="text-rose-400 fill-rose-400" />
                <span>{t("footer.for")}</span>
              </div>
              <span className="hidden sm:inline">·</span>
              <span>&copy; {new Date().getFullYear()} {t("footer.alrights")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}