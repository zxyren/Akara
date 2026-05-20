import { motion, AnimatePresence } from "framer-motion";
import { FontCard } from "./FontCard";
import { FontPagination } from "./FontPagination";
import type { LoadedFont } from "@/types/font";
import { useI18n, type Language } from "@/hooks/use-i18n";

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

  const EmptyCard = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
      {children}
    </div>
  );

  if (fonts.length === 0) {
    return (
      <EmptyCard>
        <div>
          <div className="mx-auto grid place-items-center h-14 w-14 rounded-2xl border border-white/10 bg-white/[0.03]">
            <img
              src="/icons8-opened-folder.svg"
              alt=""
              className="h-8 w-8 opacity-70"
            />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-white/90">
            {t("font.noFontsUploaded")}
          </h3>
          <p className="mt-1 text-sm text-white/55 max-w-sm">
            {t("font.uploadFonts")}
          </p>
        </div>
      </EmptyCard>
    );
  }

  if (filteredFonts.length === 0) {
    return (
      <EmptyCard>
        <div>
          <div className="mx-auto grid place-items-center h-14 w-14 rounded-2xl border border-white/10 bg-white/[0.03]">
            <img
              src="/icons8-opened-folder.svg"
              alt=""
              className="h-8 w-8 opacity-70"
            />
          </div>
          <p className="mt-4 text-sm font-medium text-white/75">
            {t("font.noFontsMatch")}
          </p>
        </div>
      </EmptyCard>
    );
  }

  return (
    <div className="space-y-6">
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

      <div className="space-y-4 pt-2">
        <div className="flex justify-center">
          <span className="rounded-full border border-white/10 bg-white/[0.02] px-4 py-2 text-xs text-white/55">
            {t("font.showing")}{" "}
            <span className="font-medium text-white/85">
              {startIndex + 1}–{Math.min(endIndex, filteredFonts.length)}
            </span>{" "}
            {t("font.of")}{" "}
            <span className="font-medium text-white/85">
              {filteredFonts.length}
            </span>{" "}
            {t("font.font")}
            {activeLanguage === "en" && filteredFonts.length !== 1 && "s"}
          </span>
        </div>

        {totalPages > 1 && (
          <FontPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            activeLanguage={activeLanguage}
          />
        )}
      </div>
    </div>
  );
};
