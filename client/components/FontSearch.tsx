import { useI18n, type Language } from "@/hooks/use-i18n";
import { HugeiconsIcon } from "@hugeicons/react";
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="relative">
        <HugeiconsIcon
          icon={Search01Icon}
          size={20}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60"
        />
        <input
          type="text"
          placeholder={t("search.placeholder")}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-3 py-2 text-sm text-white/85 placeholder-white/40 focus:border-white/15 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          variant="blocked"
          onClick={onClearAll}
          className="flex-1 rounded-xl"
        >
          {t("search.clearAll")}
        </Button>
        <span className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/55">
          {filteredFontsCount}/{totalFontsCount} {t("search.found")}
        </span>
      </div>
    </div>
  );
};
