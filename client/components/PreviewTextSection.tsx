import { useI18n, type Language } from "@/hooks/use-i18n";

interface PreviewTextSectionProps {
  previewText: string;
  onTextChange: (text: string) => void;
  activeLanguage: Language;
}

export const PreviewTextSection = ({
  previewText,
  onTextChange,
  activeLanguage,
}: PreviewTextSectionProps) => {
  const { t } = useI18n(activeLanguage);

  return (
    <div className={`${activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"
          } bg-slate-800 border border-slate-700 rounded-xl p-6`}>
      <h2 className="text-xl font-medium mb-4">{t("preview.title")}</h2>
      <textarea
        value={previewText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={t("preview.placeholder")}
        className="w-full h-32 bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none resize-none"
      />
    </div>
  );
};
