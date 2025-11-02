import React from "react";
import { Sliders } from "lucide-react";
import { motion } from "framer-motion";

const factors = [
  {
    key: "soil",
    label: "Soil quality",
    min: 0.8,
    max: 1.2,
    step: 0.01,
    hint: "Fertility, drainage, contamination risk",
  },
  {
    key: "access",
    label: "Road access",
    min: 0.9,
    max: 1.15,
    step: 0.01,
    hint: "Proximity to paved roads and highways",
  },
  {
    key: "utilities",
    label: "Utilities availability",
    min: 0.9,
    max: 1.2,
    step: 0.01,
    hint: "Water, power, sewer, internet",
  },
  {
    key: "zoning",
    label: "Zoning potential",
    min: 0.8,
    max: 1.3,
    step: 0.01,
    hint: "Development rights and permitted uses",
  },
];

export default function FactorSliders({ value, onChange, onNext }) {
  const handle = (key, v) => {
    const next = { ...value, [key]: Number(v) };
    onChange(next);
  };

  return (
    <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-2xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300 flex items-center justify-center">
          <Sliders className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Fine‑tune factors</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Adjust what best reflects your parcel.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {factors.map((f) => {
          const v = value[f.key];
          const pct = ((v - f.min) / (f.max - f.min)) * 100;
          return (
            <div key={f.key} className="group">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium">{f.label}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">{f.hint}</div>
                </div>
                <motion.div
                  className="text-sm font-semibold tabular-nums"
                  animate={{ scale: 1 + (pct / 100) * 0.05, rotate: (pct - 50) / 20 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  × {v.toFixed(2)}
                </motion.div>
              </div>

              <div className="relative pt-6">
                <input
                  type="range"
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  value={v}
                  onChange={(e) => handle(f.key, e.target.value)}
                  aria-label={f.label}
                  className="w-full appearance-none bg-transparent"
                />
                <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden -mt-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400"
                    style={{ width: pct + "%" }}
                    initial={{ width: 0 }}
                    animate={{ width: pct + "%" }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-end">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400"
        >
          See estimate
        </button>
      </div>
    </div>
  );
}
