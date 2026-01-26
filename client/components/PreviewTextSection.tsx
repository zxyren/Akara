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
      className={`rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 ${activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"}`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">
        {t("preview.title")}
      </h2>
      <textarea
        value={previewText}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={t("preview.placeholder")}
        className="w-full h-28 resize-none rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
      />
    </div>
  );
};
