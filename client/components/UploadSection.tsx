import { motion } from "framer-motion";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { IconArrowRight, IconInfoTriangleFilled } from "@tabler/icons-react";

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
    <div className={`bg-slate-800 border border-slate-700 rounded-xl p-6 ${activeLanguage === "km" ? "font-inter-khmer" : "font-poppins"}`}>
      <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
        {t("upload.title")}
      </h2>

      <div className="space-y-4">
        <label className="block">
          <motion.div
            whileHover={{ borderColor: "rgb(34, 211, 238)" }}
            className="border-2 border-dashed border-slate-600 rounded-2xl p-6 text-center cursor-pointer transition-colors hover:bg-slate-700/30"
          >
            <img
              src="/upload-cloud-file.png"
              alt="Upload file"
              className="mx-auto mb-2 w-16 h-w-16 object-contain"
            />
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
            <img
              src="/upload-cloud-folder.png"
              alt="Upload folder"
              className="mx-auto mb-2 w-16 h-16 object-contain"
            />
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border border-slate-700/30 rounded-xl"
        >
          <div className="flex items-center gap-2">
            <img src="/alphabet-folder.png" alt="Folder" className="w-8 h-8 object-contain" />
            <span className="text-sm text-slate-300 font-normal">
              {fontsCount} {t("upload.fontsLoaded")}
            </span>
          </div>
          {fontsCount > 0 && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </motion.div>

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
              <IconInfoTriangleFilled size={20} className="text-yellow-400" />
              <span className="text-sm text-red-300 font-medium">
                {skippedFontsCount} {t("font.font")}
                {activeLanguage === "en" && skippedFontsCount > 1 ? "s " : " "}
                {t("upload.fontsNotLoaded")}
              </span>
            </div>
            <span className="text-xs flex space-y-5 text-red-400">{t("upload.view")}<IconArrowRight size={16} /></span>
          </motion.button>
        )}
      </div>
    </div>
  );
};