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
import { HugeiconsIcon } from "@hugeicons/react";
import { FavouriteIcon } from "@hugeicons/core-free-icons";

const DEFAULT_TEXTS = {
  en: "The quick brown fox jumps over the lazy dog",
  km: "កញ្ជ្រោងពណ៌ត្នោតដ៏រហ័សរហួនលោតរំលងឆ្កែខ្ជិល",
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
    font.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
    <div className="min-h-screen text-white/90 bg-[#070A12]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1000px_500px_at_50%_-140px,rgba(255,255,255,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_15%_0%,rgba(99,102,241,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_85%_0%,rgba(56,189,248,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(7,10,18,0.35),rgba(7,10,18,0.95))]" />
      </div>
      <AppHeader
        activeLanguage={activeLanguage}
        onLanguageChange={handleLanguageChange}
      />

      {showSkippedModal && (
        <SkippedFontsModal
          skippedFonts={skippedFonts}
          activeLanguage={activeLanguage}
          onClose={() => setShowSkippedModal(false)}
        />
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {isProcessing && (
          <ProcessingIndicator
            current={processProgress.current}
            total={processProgress.total}
          />
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-0">
            <aside className="lg:border-r border-white/10 p-4 sm:p-6">
              <div className="sticky top-[5.5rem] space-y-4">
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
                  onTextChange={(text) =>
                    setPreviewText({ ...previewText, [activeLanguage]: text })
                  }
                  activeLanguage={activeLanguage}
                />
              </div>
            </aside>

            <section className="p-4 sm:p-6">
              <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-white/90">
                    {t("app.title")}
                  </h1>
                  <p className="text-sm text-white/55">{t("app.subtitle")}</p>
                </div>
                {fonts.length > 0 && (
                  <div className="text-xs text-white/55">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                      {filteredFonts.length} {t("search.found")}
                    </span>
                  </div>
                )}
              </div>

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
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 mt-12 sm:mt-14 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <img src="/logo.png" className="w-8 h-8 opacity-90" alt="logo" />
            <p className="text-white/55 text-sm max-w-sm">{t("footer.text")}</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs text-white/55">
              <div className="flex items-center gap-1">
                <span>{t("footer.made-with")}</span>
                <HugeiconsIcon
                  icon={FavouriteIcon}
                  size={12}
                  className="text-rose-400 fill-rose-400"
                />
                <span>{t("footer.for")}</span>
              </div>
              <span className="hidden sm:inline">·</span>
              <span>
                &copy; {new Date().getFullYear()} {t("footer.alrights")}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
