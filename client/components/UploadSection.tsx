import { motion } from "framer-motion";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, ArrowRight02Icon } from "@hugeicons/core-free-icons";

interface UploadSectionProps {
  fontsCount: number;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFolderUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeLanguage: Language;
  skippedFontsCount?: number;
  onShowSkipped?: () => void;
}

export const UploadSection = ({
  fontsCount,
  onFileUpload,
  onFolderUpload,
  activeLanguage,
  skippedFontsCount = 0,
  onShowSkipped,
}: UploadSectionProps) => {
  const { t } = useI18n(activeLanguage);

  const dropZoneClass =
    "rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center cursor-pointer transition-colors hover:border-white/15 hover:bg-white/[0.05]";

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.03] p-5 ${activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"}`}
    >
      <h2 className="text-sm font-semibold tracking-tight text-white/85 mb-4">
        {t("upload.title")}
      </h2>

      <div className="space-y-3">
        <label className="block">
          <div className={dropZoneClass}>
            <img
              src="icons8-file.svg"
              alt="Upload file"
              className="mx-auto mb-2 w-9 h-9 object-contain opacity-70"
            />
            <p className="text-sm font-medium text-white/85">
              {t("upload.selectFiles")}
            </p>
            <p className="text-xs text-white/55 mt-0.5">
              {t("upload.supportedFormats")}
            </p>
          </div>
          <input
            type="file"
            multiple
            accept=".ttf,.otf,.woff,.woff2"
            onChange={onFileUpload}
            className="hidden"
          />
        </label>

        <label className="block">
          <div className={dropZoneClass}>
            <img
              src="/icons8-folder.svg"
              alt="Upload folder"
              className="mx-auto mb-2 w-9 h-9 object-contain opacity-70"
            />
            <p className="text-sm font-medium text-white/85">
              {t("upload.selectFolder")}
            </p>
            <p className="text-xs text-white/55 mt-0.5">
              {t("upload.folderDescription")}
            </p>
          </div>
          <input
            type="file"
            multiple
            {...({ webkitdirectory: "" } as any)}
            accept=".ttf,.otf,.woff,.woff2"
            onChange={onFolderUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.02] border border-white/10">
          <div className="flex items-center gap-2">
            <img
              src="/icons8-file-384.svg"
              alt=""
              className="w-5 h-5 object-contain opacity-60"
            />
            <span className="text-sm text-white/70">
              {fontsCount} {t("upload.fontsLoaded")}
            </span>
          </div>
          {fontsCount > 0 && (
            <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
          )}
        </div>

        {skippedFontsCount > 0 && onShowSkipped && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onShowSkipped}
            className="w-full p-3 rounded-xl border border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon
                icon={AlertCircleIcon}
                size={18}
                className="text-amber-400 shrink-0"
              />
              <span className="text-sm text-amber-200/90">
                {skippedFontsCount} {t("font.font")}
                {activeLanguage === "en" && skippedFontsCount > 1 ? "s " : " "}
                {t("upload.fontsNotLoaded")}
              </span>
            </div>
            <span className="text-xs text-amber-400/80 flex items-center gap-0.5 shrink-0">
              {t("upload.view")}
              <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
            </span>
          </motion.button>
        )}
      </div>
    </div>
  );
};
