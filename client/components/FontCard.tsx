import { motion } from "framer-motion";
import { useEffect, useRef, useState, forwardRef } from "react";
import type { LoadedFont } from "@/types/font";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { IconClipboardCheck, IconClipboard, IconX, IconFileTypography } from "@tabler/icons-react";

interface FontCardProps {
  font: LoadedFont;
  fontIndex: number;
  previewText: string;
  activeLanguage: Language;
  copied: string | null;
  onRemove: (index: number) => void;
  onCopy: (name: string) => void;
  getFileExtension: (filename: string) => string;
  getFontFormat: (filename: string) => string;
}

const sanitizeFontName = (name: string, idx: number) => {
  const clean = name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9\s-]/g, "-").replace(/\s+/g, "-").replace(/-+/g, "-");
  return `font-${clean}-${idx}`;
};

export const FontCard = forwardRef<HTMLDivElement, FontCardProps>(({
  font,
  fontIndex,
  previewText,
  activeLanguage,
  copied,
  onRemove,
  onCopy,
  getFileExtension,
  getFontFormat,
}, ref) => {
  const { t } = useI18n(activeLanguage);
  const ext = getFileExtension(font.name);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [fontFam] = useState(() => sanitizeFontName(font.name, fontIndex));

  useEffect(() => {
    if (!styleRef.current) {
      const style = document.createElement("style");
      style.textContent = `@font-face{font-family:"${fontFam}";src:url('${font.fontData}')format('${getFontFormat(font.name)}');font-display:swap;}`;
      document.head.appendChild(style);
      styleRef.current = style;

      if ('fonts' in document) {
        new FontFace(fontFam, `url('${font.fontData}')`).load()
          .then(f => { document.fonts.add(f); setLoaded(true); })
          .catch(() => setLoaded(true));
      } else {
        setTimeout(() => setLoaded(true), 500);
      }
    }
    return () => {
      if (styleRef.current && document.head.contains(styleRef.current)) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, [font.fontData, font.name, getFontFormat, fontFam]);

  const fontClass = activeLanguage === "km" ? "font-inter-khmer" : "font-poppins";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`${fontClass} group relative overflow-hidden bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/80 hover:shadow-xl hover:shadow-slate-900/20 transition-all`}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-5 pb-4 border-b border-slate-700/50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-slate-700/50 rounded-lg">
              <IconFileTypography size={23} className="text-blue-400" strokeWidth={2} />
            </div>
            <h3 className="font-medium text-slate-100 truncate">{font.name}</h3>
            <span className="px-2 py-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-md text-xs text-cyan-300 font-mono uppercase tracking-wide">{ext}</span>
          </div>
          <p className="text-xs text-slate-400 truncate pl-8">{font.fontFamily}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onRemove(fontIndex)}
          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group/btn"
        >
          <IconX size={20} className="text-slate-400 group-hover/btn:text-red-400 transition-colors" />
        </motion.button>
      </div>

      {/* Preview Section */}
      <div className="relative space-y-4">
        {!loaded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-slate-400 text-sm"
          >
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            Loading font...
          </motion.div>
        )}

        <div
          className="relative bg-slate-900 rounded-xl p-5 min-h-[100px] flex items-center border border-slate-700/30"
          style={{ opacity: loaded ? 1 : 0.4 }}
        >
          <p
            style={{ fontFamily: fontFam }}
            className="text-3xl text-white leading-snug"
          >
            {previewText ? previewText.slice(0, 60) : ''}
            {previewText && previewText.length > 60 && '...'}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCopy(font.name)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all text-sm font-medium"
          >
            {copied === font.name ? (
              <>
                <IconClipboardCheck size={16} className="text-green-400" />
                <span className="text-green-400">{t("font.copied")}</span>
              </>
            ) : (
              <>
                <IconClipboard size={16} className="text-slate-300" />
                <span className="text-slate-300">{t("font.copyName")}</span>
              </>
            )}
          </motion.button>

          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/50 border border-slate-700/30 rounded-lg">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">
              {(font.file.size / 1024).toFixed(2)} KB
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});