import { motion, AnimatePresence } from "framer-motion";
import { FontCard } from "./FontCard";
import { FontPagination } from "./FontPagination";
import type { LoadedFont } from "@/types/font";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { IconUpload } from "@tabler/icons-react";

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

  const totalPages = Math.ceil(filteredFonts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFonts = filteredFonts.slice(startIndex, endIndex);

  if (fonts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-12 text-center flex items-center justify-center min-h-96 ${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"}`}
      >
        <div>
          <IconUpload className="w-16 h-16 mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">
            {t("font.noFontsUploaded")}
          </h3>
          <p className="text-slate-400">{t("font.uploadFonts")}</p>
        </div>
      </motion.div>
    );
  }

  if (filteredFonts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"
          } bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-12 text-center flex items-center justify-center min-h-96`}
      >
        <div>
          <p className="text-slate-400">{t("font.noFontsMatch")}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"
      }space-y-4`}>
      <AnimatePresence mode="popLayout">
        {paginatedFonts.map((font, index) => {
          const fontIndex = fonts.indexOf(font);
          return (
            <FontCard
              key={`${font.name}-${index}`}
              font={font}
              fontIndex={fontIndex}
              previewText={previewText}
              activeLanguage={activeLanguage}
              copied={copied}
              onRemove={onRemove}
              onCopy={onCopy}
              getFileExtension={getFileExtension}
              getFontFormat={getFontFormat}
            />
          );
        })}
      </AnimatePresence>

      {/* Font Counter and Pagination */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"
          } space-y-4`}
      >
        <div className="text-center text-slate-400 mt-9">
          <p className="text-sm">
            {t("font.showing")} {startIndex + 1}-{Math.min(endIndex, filteredFonts.length)}{" "}
            {t("font.of")} {filteredFonts.length} {t("font.font")}
            {activeLanguage === "en" && filteredFonts.length !== 1 ? "s" : ""}
          </p>
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
