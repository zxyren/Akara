import { motion } from "framer-motion";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { IconSearch } from "@tabler/icons-react";

interface FontSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
  filteredFontsCount: number;
  totalFontsCount: number;
  activeLanguage: Language;
}

export const FontSearch = ({
  searchQuery,
  onSearchChange,
  onClearAll,
  filteredFontsCount,
  totalFontsCount,
  activeLanguage,
}: FontSearchProps) => {
  const { t } = useI18n(activeLanguage);

  return (
    <div className={`${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"
          } bg-slate-800 border border-slate-700 rounded-xl p-6`}>
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <IconSearch className="w-5 h-5 text-cyan-400" />
        {t("search.title")}
      </h2>
      <input
        type="text"
        placeholder={t("search.placeholder")}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none mb-3"
      />
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearAll}
          className="flex-1 px-3 py-2 bg-red-600/20 border border-red-600/50 text-red-300 rounded-lg font-medium hover:bg-red-600/30 transition-colors text-sm"
        >
          {t("search.clearAll")}
        </motion.button>
        <span className="flex-1 px-3 py-2 bg-slate-700/50 rounded-lg text-xs text-slate-400 flex items-center justify-center">
          {filteredFontsCount} {t("search.found")}
        </span>
      </div>
    </div>
  );
};
