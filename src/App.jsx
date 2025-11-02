import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import StepProgress from "./components/StepProgress.jsx";
import LocationAcreageStep from "./components/LocationAcreageStep.jsx";
import FactorSliders from "./components/FactorSliders.jsx";
import ResultPanel from "./components/ResultPanel.jsx";

const defaultState = {
  location: "",
  region: "suburban",
  acres: 1.0,
};

const defaultFactors = {
  soil: 1.0,
  access: 1.0,
  utilities: 1.0,
  zoning: 1.0,
};

const regionBaselineMap = {
  urban: 250000,
  suburban: 120000,
  rural: 35000,
};

function sizeScaling(acres) {
  if (acres <= 1) return 1.05 - 0.05 * (1 - acres); // slight premium for small lots
  if (acres <= 10) return 1 - 0.03 * Math.log(acres); // diminishing return
  return Math.max(0.75, 1 - 0.08 * Math.log(acres));
}

function computeEstimate({ region, acres }, m) {
  const base = regionBaselineMap[region] || 100000;
  const scale = sizeScaling(Math.max(0.1, acres));
  const multiplier = m.soil * m.access * m.utilities * m.zoning;
  const estimate = Math.max(0, Math.round(base * acres * scale * multiplier));
  // A simple confidence proxy: mid when factors near 1 and size moderate
  const factorDistance =
    Math.abs(1 - m.soil) + Math.abs(1 - m.access) + Math.abs(1 - m.utilities) + Math.abs(1 - m.zoning);
  const sizePenalty = acres > 50 ? 0.65 : acres > 10 ? 0.8 : 0.95;
  const confidence = Math.max(0.35, Math.min(0.95, 1 - factorDistance / 5)) * sizePenalty;
  return { estimate, confidence, regionBaseline: base };
}

export default function App() {
  const [step, setStep] = useState("intro");
  const [inputs, setInputs] = useState(defaultState);
  const [factors, setFactors] = useState(defaultFactors);

  const summary = useMemo(() => {
    const { estimate, confidence, regionBaseline } = computeEstimate(inputs, factors);
    return {
      estimate,
      confidence,
      regionBaseline,
      acres: inputs.acres,
      multipliers: factors,
    };
  }, [inputs, factors]);

  const handleShare = async () => {
    const text = `Estimated land value: $${summary.estimate.toLocaleString()}\nAcreage: ${inputs.acres} ac`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: "Land Value Estimate", text, url });
        return;
      } catch (e) {}
    }
    await navigator.clipboard.writeText(text + "\n" + url);
    alert("Link copied to clipboard");
  };

  const handleDownload = () => {
    const data = {
      location: inputs.location,
      region: inputs.region,
      acres: inputs.acres,
      multipliers: factors,
      estimate: summary.estimate,
      confidence: summary.confidence,
      generatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "land-value-estimate.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setInputs(defaultState);
    setFactors(defaultFactors);
    setStep("intro");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 text-zinc-900 dark:text-zinc-50">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <StepProgress
            current={step}
            onBack={() => setStep((s) => (s === "intro" ? "intro" : s === "location" ? "intro" : s === "factors" ? "location" : "factors"))}
            onReset={resetAll}
          />
        </div>

        {step === "intro" && (
          <div className="grid gap-8 md:grid-cols-5 items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="md:col-span-3 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur shadow-sm"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-100 to-emerald-100 dark:from-sky-900/30 dark:to-emerald-900/30 text-sky-700 dark:text-sky-200 px-3 py-1 text-xs font-medium mb-4">
                <Sparkles className="h-4 w-4" /> New • Land Value Estimator
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mb-3">
                Just a few inputs and you’ll get an estimated value for your land.
              </h1>
              <p className="text-zinc-600 dark:text-zinc-300">
                Ultra‑modern, friendly and transparent. Adjust factors like soil, access and zoning to see how they change value in real time.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setStep("location")}
                  className="inline-flex items-center gap-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
                >
                  Start estimating
                </button>
                <a
                  href="#methodology"
                  className="inline-flex items-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  <Info className="h-4 w-4" /> How this works
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 h-64 rounded-3xl bg-gradient-to-br from-sky-200/60 via-violet-200/60 to-emerald-200/60 dark:from-sky-900/30 dark:via-violet-900/30 dark:to-emerald-900/30 shadow-inner relative overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="absolute -top-6 -left-6 h-40 w-40 rounded-full bg-white/60 blur-2xl" />
                <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-white/40 blur-2xl" />
              </div>
            </motion.div>
          </div>
        )}

        {step === "location" && (
          <LocationAcreageStep
            value={inputs}
            onChange={setInputs}
            onNext={() => setStep("factors")}
          />
        )}

        {step === "factors" && (
          <FactorSliders
            value={factors}
            onChange={setFactors}
            onNext={() => setStep("result")}
          />
        )}

        {step === "result" && (
          <ResultPanel summary={summary} onShare={handleShare} onDownload={handleDownload} />
        )}

        <section id="methodology" className="mt-10 text-sm text-zinc-600 dark:text-zinc-400">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-white/60 dark:bg-zinc-900/60">
            <h2 className="font-semibold mb-2">Methodology & transparency</h2>
            <p>
              We start with recent region‑level sales to determine a baseline per‑acre value. We then apply size scaling (smaller parcels can command a premium, larger ones may see discounts) and your adjustable multipliers for soil, access, utilities and zoning potential. The result is a directional estimate to inform decisions.
            </p>
            <p className="mt-2">
              This is not a formal appraisal. Market dynamics, legal encumbrances, topography and on‑site inspections can materially change value.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
