import React, { useEffect } from "react";
import { Gauge, Share2, Download, Info } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

export default function ResultPanel({ summary, onShare, onDownload }) {
  const { estimate, confidence, regionBaseline, acres, multipliers } = summary;

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const formatted = useTransform(rounded, (v) => v.toLocaleString());

  useEffect(() => {
    const controls = animate(count, estimate, { duration: 0.8, ease: "easeOut" });
    return controls.stop;
  }, [estimate]);

  const confPct = Math.max(0, Math.min(100, Math.round(confidence * 100)));

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/70 backdrop-blur p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
          <Gauge className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Estimated land value</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Based on your inputs and regional market data.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Estimated total</div>
          <motion.div
            aria-live="polite"
            className="mt-1 text-4xl md:text-5xl font-semibold tracking-tight"
          >
            $ {formatted}
          </motion.div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-500 dark:text-zinc-400">Confidence</span>
              <span className="font-medium">{confPct}%</span>
            </div>
            <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-violet-400"
                initial={{ width: 0 }}
                animate={{ width: confPct + "%" }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onShare}
              className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
            >
              <Share2 className="h-4 w-4" /> Share
            </button>
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400"
            >
              <Download className="h-4 w-4" /> Download
            </button>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Info className="h-4 w-4" /> This is an estimate, not an appraisal.
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white/60 dark:bg-zinc-900/60">
          <div className="text-sm font-medium mb-3">Methodology snapshot</div>
          <ul className="text-sm space-y-2 text-zinc-600 dark:text-zinc-300">
            <li>Baseline per acre (region): <span className="font-semibold">${regionBaseline.toLocaleString()}</span></li>
            <li>Acreage: <span className="font-semibold">{acres.toLocaleString()} ac</span></li>
            <li>Multipliers:
              <ul className="ml-4 list-disc">
                <li>Soil: ×{multipliers.soil.toFixed(2)}</li>
                <li>Access: ×{multipliers.access.toFixed(2)}</li>
                <li>Utilities: ×{multipliers.utilities.toFixed(2)}</li>
                <li>Zoning: ×{multipliers.zoning.toFixed(2)}</li>
              </ul>
            </li>
          </ul>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Estimates vary with market volatility and parcel specifics. It’s a starting point to explore value — not a substitute for a professional appraisal.
          </p>
        </div>
      </div>
    </div>
  );
}
