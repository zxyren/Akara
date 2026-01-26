import { useEffect } from "react";
import { useI18n, type Language } from "@/hooks/use-i18n";

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

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("font.prev")}
      </button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, idx) =>
          typeof page === "number" ? (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                currentPage === page
                  ? "bg-zinc-200 text-zinc-900"
                  : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={`ellipsis-${idx}`} className="px-1 text-zinc-500">…</span>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("font.next")}
      </button>
    </div>
  );
};