import { motion } from "framer-motion";
import { useEffect, useRef, useState, forwardRef } from "react";
import type { LoadedFont } from "@/types/font";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { IconClipboardCheck, IconClipboard, IconX } from "@tabler/icons-react";

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

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`${
    activeLanguage === "km" ? "font-kantumruy" : "font-poppins"
  } bg-slate-800 border border-slate-700 my-3 rounded-3xl p-6 hover:border-slate-600 transition-colors`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 border-b border-slate-700 pb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-slate-200 break-all">{font.name}</h3>
            <span className="px-2 py-1 bg-slate-700 rounded-lg text-xs text-cyan-300 font-mono flex-shrink-0">.{ext}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{font.fontFamily}</p>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => onRemove(fontIndex)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
          <IconX size={23} className="text-slate-400" />
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="space-y-3">
        {!loaded && <div className="text-white text-sm italic">Loading...</div>}
        <div className="space-y-2" style={{ opacity: loaded ? 1 : 0.5 }}>
          <p style={{ fontFamily: fontFam }} className="text-3xl break-words">
            {previewText ? previewText.slice(0, 60) : ''}{previewText && previewText.length > 60 && '...'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-3 border-slate-700">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => onCopy(font.name)} className="flex items-center gap-2 px-3 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
            {copied === font.name ? (
              <>
                <IconClipboardCheck size={16} className="text-green-400" />
                {t("font.copied")}
              </>
            ) : (
              <>
                <IconClipboard size={16} />
                {t("font.copyName")}
              </>
            )}
          </motion.button>
          <span className="text-xs text-slate-400 px-3 py-1 bg-slate-700/50 rounded-lg">
            {(font.file.size / 1024).toFixed(2)} KB
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
});