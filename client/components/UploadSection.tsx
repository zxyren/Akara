import { motion } from "framer-motion";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { IconAlertHexagon, IconFileUpload, IconFolderFilled, IconFolderUp, IconUpload } from "@tabler/icons-react";

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

  return (
    <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 ${activeLanguage === "km" ? "font-kantumruy" : "font-poppins"}`}>
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        <IconUpload size={20} className="text-cyan-400" />
        {t("upload.title")}
      </h2>

      <div className="space-y-4">
        <label className="block">
          <motion.div
            whileHover={{ borderColor: "rgb(34, 211, 238)" }}
            className="border-2 border-dashed border-slate-600 rounded-2xl p-6 text-center cursor-pointer transition-colors hover:bg-slate-700/30"
          >
            <IconFileUpload size={32} className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm font-medium text-slate-300">
              {t("upload.selectFiles")}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t("upload.supportedFormats")}
            </p>
          </motion.div>
          <input
            type="file"
            multiple
            accept=".ttf,.otf,.woff,.woff2"
            onChange={onFileUpload}
            className="hidden"
          />
        </label>

        <label className="block">
          <motion.div
            whileHover={{ borderColor: "rgb(34, 211, 238)" }}
            className="border-2 border-dashed border-slate-600 rounded-2xl p-6 text-center cursor-pointer transition-colors hover:bg-slate-700/30"
          >
            <IconFolderUp size={32} className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm font-medium text-slate-300">
              {t("upload.selectFolder")}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {t("upload.folderDescription")}
            </p>
          </motion.div>
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
        <div className="p-3 bg-slate-700/50 rounded-lg">
          <p className="text-xs text-slate-400 flex items-center gap-1">
            <IconFolderFilled size={20} className="text-yellow-500" />
            {fontsCount} {t("upload.fontsLoaded")}
          </p>
        </div>

        {skippedFontsCount > 0 && onShowSkipped && (
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShowSkipped}
            className="w-full p-3 bg-red-900/30 border border-red-700/50 hover:bg-red-900/40 rounded-lg transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <IconAlertHexagon size={20} className="text-red-400" />
              <span className="text-sm text-red-300 font-medium">
                {skippedFontsCount} font{skippedFontsCount > 1 ? 's' : ''} couldn't be loaded
              </span>
            </div>
            <span className="text-xs text-red-400">View →</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};