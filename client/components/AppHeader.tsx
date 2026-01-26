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
  useI18n(activeLanguage);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"}
        border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <img src="/logo.png" className="h-8 w-8" alt="akara Logo" />

        <div className="flex rounded-lg bg-zinc-900/80 p-0.5 border border-zinc-800/80">
          {(["en", "km"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${activeLanguage === lang ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-200"}`}
            >
              {activeLanguage === lang && (
                <motion.div
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-md bg-zinc-200 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {lang === "en" ? "EN" : "KM"}
            </button>
          ))}
        </div>
      </div>
    </motion.header>
  );
}