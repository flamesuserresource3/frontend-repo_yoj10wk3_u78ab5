import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Info } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const regions = [
  { id: "urban", label: "Urban core", baseline: 250000 },
  { id: "suburban", label: "Suburban", baseline: 120000 },
  { id: "rural", label: "Rural", baseline: 35000 },
];

export default function LocationAcreageStep({ value, onChange, onNext }) {
  const [local, setLocal] = useState(value);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => setLocal(value), [value]);

  const pinVariants = {
    hidden: { y: -20, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const regionObj = useMemo(() => regions.find((r) => r.id === local.region) || regions[1], [local.region]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-300 flex items-center justify-center">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Location</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Where is your land located?</p>
          </div>
        </div>
        <label className="block text-sm font-medium mb-1" htmlFor="location-input">Address or area</label>
        <div className="relative">
          <input
            id="location-input"
            type="text"
            value={local.location}
            onChange={(e) => setLocal((s) => ({ ...s, location: e.target.value }))}
            placeholder="e.g. 123 Meadow Lane, Palo Alto, CA"
            className="w-full rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 pr-12 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-400"
            aria-describedby="location-help"
          />
          <motion.div
            initial="hidden"
            animate="visible"
            variants={shouldReduceMotion ? {} : pinVariants}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-500"
            aria-hidden
          >
            <MapPin className="h-5 w-5" />
          </motion.div>
        </div>
        <p id="location-help" className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          We don’t store this — it’s only used for a quick estimate.
        </p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="region-select">Region profile</label>
            <select
              id="region-select"
              value={local.region}
              onChange={(e) => setLocal((s) => ({ ...s, region: e.target.value }))}
              className="w-full rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="self-end text-sm text-zinc-600 dark:text-zinc-300 flex items-center gap-2 px-2 py-1 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
            <Info className="h-4 w-4" /> Baseline: <span className="font-semibold">${regionObj.baseline.toLocaleString()}</span> per acre
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
            <span className="font-bold">ac</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Acreage</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">How large is the parcel?</p>
          </div>
        </div>
        <label htmlFor="acreage" className="block text-sm font-medium mb-1">Total acres</label>
        <div className="flex items-center gap-3">
          <input
            id="acreage"
            type="number"
            min={0.1}
            step={0.1}
            value={local.acres}
            onChange={(e) => setLocal((s) => ({ ...s, acres: Number(e.target.value) }))}
            className="w-full rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="button"
            onClick={() => setLocal((s) => ({ ...s, acres: Math.max(0.1, Number((s.acres - 1).toFixed(1))) }))}
            className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            aria-label="Decrease acres"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => setLocal((s) => ({ ...s, acres: Number((s.acres + 1).toFixed(1)) }))}
            className="px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            aria-label="Increase acres"
          >
            +
          </button>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            Size scaling applies automatically for very small or very large lots.
          </div>
          <button
            type="button"
            onClick={() => {
              onChange(local);
              onNext();
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
