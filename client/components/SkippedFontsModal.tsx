import { HugeiconsIcon } from '@hugeicons/react';
import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import type { Language } from "@/hooks/use-i18n";
import { useI18n } from "@/hooks/use-i18n";
import { Button } from './ui/button';

interface SkippedFontsModalProps {
  skippedFonts: Array<{ name: string; reason: string }>;
  activeLanguage: Language;
  onClose: () => void;
}

export const SkippedFontsModal = ({
  skippedFonts,
  activeLanguage,
  onClose,
}: SkippedFontsModalProps) => {
  const { t } = useI18n(activeLanguage);

  return (
    <div
      className={`${
        activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"
      } fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl">
        <div className="border-b border-zinc-800 px-5 py-4">
          <h3 className="flex items-center gap-2 text-base font-semibold text-amber-200">
            <HugeiconsIcon icon={AlertCircleIcon} size={20} className="shrink-0 text-amber-400" />
            {skippedFonts.length} {t("upload.skippedFonts")}
          </h3>
          <p className="mt-1 text-sm text-zinc-500">{t("upload.fontsNotLoaded")}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {skippedFonts.map((font, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 px-3 py-2 text-sm"
              >
                <div className="font-medium text-zinc-200 break-all">{font.name}</div>
                <div className="mt-0.5 text-xs text-zinc-500">{font.reason}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-zinc-800 p-4">
          <Button
          variant='blocked'
            onClick={onClose}
            className="w-full rounded-lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};