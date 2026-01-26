import { useI18n, type Language } from "@/hooks/use-i18n";
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon } from "@hugeicons/core-free-icons";
import { Button } from "./ui/button";

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
    <div
      className={`rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 ${activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"}`}
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
        <HugeiconsIcon icon={Search01Icon} size={20} />
        {t("search.title")}
      </h2>
      <input
        type="text"
        placeholder={t("search.placeholder")}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
      />
      <div className="mt-3 flex gap-2">
        <Button
          variant="blocked"
          onClick={onClearAll}
          className="flex-1 rounded-lg"
        >
          {t("search.clearAll")}
        </Button>
        <span className="flex flex-1 items-center justify-center rounded-lg bg-zinc-950/60 px-3 py-2 text-sm text-zinc-500">
          {filteredFontsCount} {t("search.found")}
        </span>
      </div>
    </div>
  );
};
