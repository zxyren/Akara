import { motion, AnimatePresence } from "framer-motion";
import { FontCard } from "./FontCard";
import { FontPagination } from "./FontPagination";
import type { LoadedFont } from "@/types/font";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { IconUpload, IconSparkles } from "@tabler/icons-react";

interface FontListProps {
  fonts: LoadedFont[];
  filteredFonts: LoadedFont[];
  currentPage: number;
  onPageChange: (page: number) => void;
  previewText: string;
  activeLanguage: Language;
  copied: string | null;
  onRemove: (index: number) => void;
  onCopy: (name: string) => void;
  getFileExtension: (filename: string) => string;
  getFontFormat: (filename: string) => string;
  ITEMS_PER_PAGE: number;
}

export const FontList = ({
  fonts,
  filteredFonts,
  currentPage,
  onPageChange,
  previewText,
  activeLanguage,
  copied,
  onRemove,
  onCopy,
  getFileExtension,
  getFontFormat,
  ITEMS_PER_PAGE,
}: FontListProps) => {
  const { t } = useI18n(activeLanguage);
  const fontClass = activeLanguage === "km" ? "font-kantumruy" : "font-poppins";
  const totalPages = Math.ceil(filteredFonts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFonts = filteredFonts.slice(startIndex, endIndex);

  const EmptyCard = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${fontClass} relative overflow-hidden bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-16 text-center min-h-[400px] flex items-center justify-center`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      {children}
    </motion.div>
  );

  if (fonts.length === 0) {
    return (
      <EmptyCard>
        <div className="relative z-10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6 inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600/50 shadow-xl items-center justify-center">
            <IconUpload className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
          </motion.div>
          <h3 className="text-2xl font-semibold text-slate-200 mb-3">{t("font.noFontsUploaded")}</h3>
          <p className="text-slate-400">{t("font.uploadFonts")}</p>
        </div>
      </EmptyCard>
    );
  }

  if (filteredFonts.length === 0) {
    return (
      <EmptyCard>
        <div className="relative z-10">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mb-5 text-6xl">🔍</motion.div>
          <p className="text-slate-300 text-lg font-medium">{t("font.noFontsMatch")}</p>
        </div>
      </EmptyCard>
    );
  }

  return (
    <div className={`${fontClass} space-y-6`}>
      <AnimatePresence mode="popLayout">
        {paginatedFonts.map((font, idx) => (
          <FontCard
            key={`${font.name}-${idx}`}
            font={font}
            fontIndex={fonts.indexOf(font)}
            previewText={previewText}
            activeLanguage={activeLanguage}
            copied={copied}
            onRemove={onRemove}
            onCopy={onCopy}
            getFileExtension={getFileExtension}
            getFontFormat={getFontFormat}
          />
        ))}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pt-4">
        <div className="flex justify-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-full shadow-lg">
            <IconSparkles className="w-4 h-4 text-blue-400" strokeWidth={2} />
            <span className="text-sm text-slate-300">
              {t("font.showing")} <strong className="text-white">{startIndex + 1}-{Math.min(endIndex, filteredFonts.length)}</strong> {t("font.of")} <strong className="text-white">{filteredFonts.length}</strong> {t("font.font")}{activeLanguage === "en" && filteredFonts.length !== 1 && "s"}
            </span>
          </motion.div>
        </div>

        {totalPages > 1 && (
          <FontPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            activeLanguage={activeLanguage}
          />
        )}
      </motion.div>
    </div>
  );
};