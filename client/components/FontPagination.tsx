import { motion } from "framer-motion";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { useEffect } from "react";

interface FontPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  activeLanguage: Language;
}

export const FontPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  activeLanguage,
}: FontPaginationProps) => {
  const { t } = useI18n(activeLanguage);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    const pages: (number | string)[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }
    return pages;
  };

  const PageButton = ({ page, isActive }: { page: number; isActive?: boolean }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onPageChange(page)}
      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
        isActive
          ? "bg-cyan-500 text-slate-900"
          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
      }`}
    >
      {page}
    </motion.button>
  );

  return (
    <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
      >
        {t("font.prev")}
      </motion.button>

      <div className="flex gap-1 items-center">
        {getPageNumbers().map((page, idx) =>
          typeof page === "number" ? (
            <PageButton key={page} page={page} isActive={currentPage === page} />
          ) : (
            <span key={`ellipsis-${idx}`} className="text-slate-500 px-1">
              ...
            </span>
          )
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
      >
        {t("font.next")}
      </motion.button>
    </div>
  );
};