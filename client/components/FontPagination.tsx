import { motion } from "framer-motion";
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

  return (
    <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
      >
        {t("font.prev")}
      </motion.button>

      <div className="flex gap-1">
        {totalPages <= 10 ? (
          Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                currentPage === page
                  ? "bg-cyan-500 text-slate-900"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {page}
            </motion.button>
          ))
        ) : (
          <>
            {currentPage > 3 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(1)}
                  className="w-8 h-8 rounded-lg text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                >
                  1
                </motion.button>
                <span className="text-slate-500 px-1">...</span>
              </>
            )}

            {Array.from(
              {
                length: Math.min(5, totalPages - Math.max(1, currentPage - 2) + 1),
              },
              (_, i) => Math.max(1, currentPage - 2) + i
            ).map((page) => (
              <motion.button
                key={page}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  currentPage === page
                    ? "bg-cyan-500 text-slate-900"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {page}
              </motion.button>
            ))}

            {currentPage < totalPages - 2 && (
              <>
                <span className="text-slate-500 px-1">...</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(totalPages)}
                  className="w-8 h-8 rounded-lg text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
                >
                  {totalPages}
                </motion.button>
              </>
            )}
          </>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
      >
        {t("font.next")}
      </motion.button>
    </div>
  );
};
