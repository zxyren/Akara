import { AnimatePresence, motion } from "framer-motion";
import { useI18n, type Language } from "@/hooks/use-i18n";

interface AppHeaderProps {
  activeLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AppHeader = ({
  activeLanguage,
  onLanguageChange,
}: AppHeaderProps) => {
  const { t } = useI18n(activeLanguage);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"} 
        border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left side: logo and subtitle */}
          <div>
            <img src="/logo.png" className="w-10 h-10" alt="Akson Logo" />
          </div>

          {/* Right side: Language toggle */}
          <div className="flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                onLanguageChange(activeLanguage === "en" ? "km" : "en")
              }
              className="relative flex items-center justify-center p-1 rounded-md border border-slate-600 bg-slate-800/70 hover:bg-slate-700/70 transition-all duration-200 shadow-sm"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeLanguage}
                  src={
                    activeLanguage === "en"
                      ? "Flag_of_the_United_Kingdom.svg"
                      : "Flag_of_Cambodia.svg"
                  }
                  alt={activeLanguage === "en" ? "English" : "Khmer"}
                  className="w-8 h-5 rounded"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};
