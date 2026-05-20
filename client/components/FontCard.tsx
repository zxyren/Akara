import { motion } from "framer-motion";
import { useEffect, useRef, useState, memo } from "react";
import type { LoadedFont } from "@/types/font";
import { useI18n, type Language } from "@/hooks/use-i18n";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Cancel01Icon,
  Download01Icon,
  Task02Icon,
  TaskDone01Icon,
} from "@hugeicons/core-free-icons";
import { Button } from "./ui/button";

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
  const clean = name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  return `font-${clean}-${idx}`;
};

// Memoize the component to prevent unnecessary re-renders
export const FontCard = memo<FontCardProps>(
  ({
    font,
    fontIndex,
    previewText,
    activeLanguage,
    copied,
    onRemove,
    onCopy,
    getFileExtension,
    getFontFormat,
  }) => {
    const { t } = useI18n(activeLanguage);
    const ext = getFileExtension(font.name);
    const styleRef = useRef<HTMLStyleElement | null>(null);
    const [loaded, setLoaded] = useState(false);
    const fontFam = useRef(sanitizeFontName(font.name, fontIndex)).current;

    useEffect(() => {
      if (styleRef.current) return;

      const style = document.createElement("style");
      const format = getFontFormat(font.name);
      style.textContent = `@font-face{font-family:"${fontFam}";src:url('${font.fontData}')format('${format}');font-display:swap;}`;
      document.head.appendChild(style);
      styleRef.current = style;

      // Use requestIdleCallback for non-blocking font loading
      const loadFont = () => {
        if ("fonts" in document) {
          new FontFace(fontFam, `url('${font.fontData}')`)
            .load()
            .then((f) => {
              document.fonts.add(f);
              setLoaded(true);
            })
            .catch(() => setLoaded(true));
        } else {
          setLoaded(true);
        }
      };

      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadFont);
      } else {
        setTimeout(loadFont, 0);
      }

      return () => {
        if (styleRef.current?.parentNode) {
          styleRef.current.parentNode.removeChild(styleRef.current);
        }
      };
    }, []); // Empty deps - only run once

    const truncatedText =
      previewText.length > 60 ? previewText.slice(0, 60) + "..." : previewText;

    const downloadFont = () => {
      const link = document.createElement("a");
      link.href = font.fontData;
      link.download = font.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/15"
      >
        <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-white/10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-white/90 truncate text-sm">
                {font.name}
              </h3>
              <span className="shrink-0 rounded bg-white/[0.05] px-1.5 py-0.5 text-xs font-medium text-white/55 border border-white/10">
                .{ext}
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs text-white/50">
              {font.fontFamily}
            </p>
          </div>
          <Button
            variant="blocked"
            size="icon"
            onClick={() => onRemove(fontIndex)}
            className="shrink-0 rounded-lg p-1.5 group"
            aria-label="Remove font"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={20}
              className="group-hover:rotate-90 transition-transform ease-in-out duration-300"
            />
          </Button>
        </div>

        <div className="space-y-3">
          {!loaded && (
            <div className="flex items-center gap-2 text-xs text-white/55">
              <div className="h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse" />
              Loading…
            </div>
          )}

          <div
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4 min-h-[88px] flex items-center transition-opacity duration-200"
            style={{ opacity: loaded ? 1 : 0.5 }}
          >
            <p
              style={{ fontFamily: loaded ? fontFam : "inherit" }}
              className="text-2xl text-white/90 leading-snug break-words"
            >
              {truncatedText}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={downloadFont}
                className="inline-flex items-center gap-1.5 font-normal text-sm rounded-lg"
                variant="outline"
              >
                <HugeiconsIcon icon={Download01Icon} size={20} />
                <span>{t("font.download")}</span>
              </Button>
              <Button
                onClick={() => onCopy(font.name)}
                className="inline-flex items-center gap-1.5 font-normal text-sm rounded-lg"
                variant="secondary"
              >
                {copied === font.name ? (
                  <>
                    <HugeiconsIcon
                      icon={TaskDone01Icon}
                      size={20}
                      className="text-emerald-400"
                    />
                    <span className="text-emerald-400">{t("font.copied")}</span>
                  </>
                ) : (
                  <>
                    <HugeiconsIcon icon={Task02Icon} size={20} />
                    <span>{t("font.copyName")}</span>
                  </>
                )}
              </Button>
            </div>
            <span className="rounded-md bg-white/[0.02] border border-white/10 px-2 py-1 text-xs text-white/55">
              {(font.file.size / 1024).toFixed(1)} KB
            </span>
          </div>
        </div>
      </motion.div>
    );
  },
  (prev, next) => {
    // Custom comparison for better memoization
    return (
      prev.font.name === next.font.name &&
      prev.fontIndex === next.fontIndex &&
      prev.previewText === next.previewText &&
      prev.copied === next.copied &&
      prev.activeLanguage === next.activeLanguage
    );
  },
);
