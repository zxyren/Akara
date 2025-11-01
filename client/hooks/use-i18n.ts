import { useCallback } from "react";
import enTranslations from "@/locales/en.json";
import khTranslations from "@/locales/kh.json";

export type Language = "en" | "km";

const translations: Record<Language, typeof enTranslations> = {
  en: enTranslations,
  km: khTranslations,
};

type TranslationKeys = keyof typeof enTranslations;

export const useI18n = (language: Language) => {
  const t = useCallback(
    (key: string): string => {
      const keys = key.split(".");
      let value: any = translations[language];

      for (const k of keys) {
        value = value?.[k];
      }

      if (typeof value === "string") {
        return value;
      }

      // Fallback to English if translation not found
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }

      return typeof value === "string" ? value : key;
    },
    [language]
  );

  return { t, language };
};
