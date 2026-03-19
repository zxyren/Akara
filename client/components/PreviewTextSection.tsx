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
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"}`}
    >
      <h2 className="text-sm font-semibold tracking-tight text-white/85 mb-3">
        {t("preview.title")}
      </h2>
      <textarea
        value={previewText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={t("preview.placeholder")}
        className="w-full h-28 resize-none rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-white/85 placeholder-white/40 focus:border-white/15 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
};
