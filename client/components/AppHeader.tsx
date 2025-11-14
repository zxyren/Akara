import { motion } from "framer-motion";
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
          {/* Left side: logo */}
          <div>
            <img src="/logo.png" className="w-10 h-10" alt="Akson Logo" />
          </div>

          {/* Right side: Language toggle - Minimal Underline */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => onLanguageChange("en")}
              className="relative pb-2 text-base font-medium transition-colors"
            >
              <span className={activeLanguage === "en" ? "text-white" : "text-slate-500 hover:text-slate-400"}>
                EN
              </span>
              {activeLanguage === "en" && (
                <motion.div
                  layoutId="language-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>

            <button
              onClick={() => onLanguageChange("km")}
              className="relative pb-2 text-base font-medium transition-colors"
            >
              <span className={activeLanguage === "km" ? "text-white" : "text-slate-500 hover:text-slate-400"}>
                KM
              </span>
              {activeLanguage === "km" && (
                <motion.div
                  layoutId="language-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};