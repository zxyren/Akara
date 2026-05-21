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
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b border-white/10 bg-[#070A12]/70 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/logo.png" className="h-9 w-9" alt="Logo" />
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight text-white/90 truncate">
              Abgs
            </div>
            <div className="text-xs text-white/55 truncate">
              {t("app.subtitle")}
            </div>
          </div>
        </div>

        <div className="flex rounded-lg bg-white/[0.03] p-0.5 border border-white/10">
          {(["en", "km"] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                ${activeLanguage === lang ? "text-[#070A12]" : "text-white/55 hover:text-white/80"}`}
            >
              {activeLanguage === lang && (
                <motion.div
                  layoutId="lang-pill"
                  className="absolute inset-0 rounded-md bg-white/90 -z-10"
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
};
