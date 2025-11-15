import { IconInfoTriangleFilled } from "@tabler/icons-react";
import type { Language } from "@/hooks/use-i18n";
import { useI18n } from "@/hooks/use-i18n";

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
        activeLanguage === "km" ? "font-kantumruy" : "font-poppins"
      } fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4`}
    >
      <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-xl font-medium text-red-400">
            <IconInfoTriangleFilled size={24} className="text-yellow-500 inline-block mr-2" />
            {skippedFonts.length} {t("upload.skippedFonts")}
          </h3>
          <p className="text-sm text-slate-400 mt-2">{t("upload.fontsNotLoaded")}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {skippedFonts.map((font, idx) => (
              <div key={idx} className="bg-slate-700/50 rounded p-3 text-sm">
                <div className="font-medium text-slate-200 break-all">{font.name}</div>
                <div className="text-sm text-slate-400 mt-1">Reason: {font.reason}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};