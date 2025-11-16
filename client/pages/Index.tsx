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
        className={`${
          activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"
        } border-t border-slate-700 bg-slate-900/50 backdrop-blur-md mt-12 sm:mt-16`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-slate-400 text-sm">
          <p>{t("footer.text")}</p>
        </div>
      </footer>
    </div>
  );
}