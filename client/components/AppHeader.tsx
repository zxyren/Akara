import { motion } from "framer-motion";
import { useI18n, type Language } from "@/hooks/use-i18n";

interface AppHeaderProps {
  activeLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AppHeader = ({ activeLanguage, onLanguageChange }: AppHeaderProps) => {
  const { t } = useI18n(activeLanguage);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"} border-b border-slate-700 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              FP
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              {t("app.subtitle")}
            </p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLanguageChange(activeLanguage === "en" ? "km" : "en")}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${activeLanguage === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                }`}
            >
              {activeLanguage === "en" ? t("language.english") : t("language.khmer")}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
