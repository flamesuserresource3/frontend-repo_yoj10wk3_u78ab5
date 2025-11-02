import React from "react";
import { ChevronLeft, RefreshCw } from "lucide-react";

const steps = [
  { key: "intro", label: "Intro" },
  { key: "location", label: "Location" },
  { key: "factors", label: "Factors" },
  { key: "result", label: "Result" },
];

export default function StepProgress({ current, onBack, onReset }) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/70 dark:bg-zinc-900/60 backdrop-blur px-4 py-3 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={currentIndex <= 0}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Reset"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </button>
      </div>
      <ol className="flex items-center gap-2" aria-label="Progress">
        {steps.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={s.key} className="flex items-center gap-2">
              <div
                className={
                  "h-2 w-10 rounded-full transition-all " +
                  (done
                    ? "bg-emerald-400"
                    : active
                    ? "bg-sky-400 w-14"
                    : "bg-zinc-200 dark:bg-zinc-700")
                }
                aria-hidden
              />
              <span
                className={
                  "text-xs font-medium " +
                  (active
                    ? "text-sky-600 dark:text-sky-300"
                    : done
                    ? "text-emerald-600 dark:text-emerald-300"
                    : "text-zinc-500 dark:text-zinc-400")
                }
              >
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
