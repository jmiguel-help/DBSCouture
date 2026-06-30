import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, AlertCircle, BookOpen, ExternalLink, RefreshCw, Layers, Sliders } from "lucide-react";
import { TrendReport } from "../types";

export default function TrendForecaster() {
  const [category, setCategory] = useState("runway silhouettes and drapery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<TrendReport | null>(null);

  const categories = [
    { label: "Silhouettes & Cuts", value: "runway silhouettes and drapery" },
    { label: "Chromatic Palettes", value: "high fashion runway colors and palettes" },
    { label: "Textile Engineering", value: "luxury sustainable fabrics and futuristic materials" }
  ];

  const handleSynthesizeTrends = async () => {
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch("/api/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Trend synthesis failed.");
      }

      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Runway grounding engine failed to parse search metrics.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-light text-white tracking-tight flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#C5A367]" /> Trend Forecaster
        </h2>
        <p className="text-xs text-[#8E9299] font-light">
          Real-time runway analytics powered by Google Search Grounding. Synthesize upcoming high-fashion movements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Panel (Left) */}
        <div className="lg:col-span-4 bg-[#0D0D0D] border border-white/5 p-6 rounded-sm space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] font-mono uppercase text-[#8E9299] tracking-widest">
              Forecast Dimension
            </label>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`w-full p-4 border rounded-sm text-left text-xs font-light transition-all flex justify-between items-center cursor-pointer ${
                    category === cat.value
                      ? "border-[#C5A367] bg-[#C5A367]/10 text-[#C5A367] font-semibold"
                      : "border-white/5 hover:border-white/20 bg-[#141414] text-[#8E9299]"
                  }`}
                >
                  <span>{cat.label}</span>
                  {category === cat.value && <div className="w-1.5 h-1.5 rounded-full bg-[#C5A367]" />}
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-run-forecast"
            onClick={handleSynthesizeTrends}
            disabled={loading}
            className={`w-full py-3.5 rounded-sm font-semibold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              loading
                ? "bg-white/5 text-neutral-500 border border-white/5 cursor-not-allowed"
                : "bg-[#C5A367] hover:bg-[#b08e54] text-neutral-950"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Synthesizing Grounding...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Synthesize Live Runway Forecast
              </>
            )}
          </button>
        </div>

        {/* Forecast Display Canvas (Right) */}
        <div className="lg:col-span-8 flex flex-col min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Empty state */}
            {!loading && !report && !error && (
              <motion.div
                key="trends-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-sm bg-[#0D0D0D] p-8 text-center space-y-4"
              >
                <div className="p-4 bg-[#141414] rounded-sm text-[#8E9299]">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-base font-medium text-white">Forecast Console Offline</h3>
                  <p className="text-xs text-[#8E9299] font-light leading-relaxed">
                    Trigger live fashion runway searches. The engine will query recent fashion weeks to construct structured reports.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Loading state */}
            {loading && (
              <motion.div
                key="trends-loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center border border-white/5 bg-[#0D0D0D] rounded-sm p-8 text-center space-y-5"
              >
                <div className="w-12 h-12 border border-white/5 border-t-[#C5A367] rounded-full animate-spin" />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-white">Scanning Haute Runway Reports</h3>
                  <p className="text-xs text-[#C5A367] font-mono animate-pulse">
                    Querying Milan, Paris, London, and New York Couture networks...
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error state */}
            {error && (
              <motion.div
                key="trends-error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center border border-red-950/40 bg-red-950/10 rounded-sm p-8 text-center space-y-4"
              >
                <div className="p-3 bg-red-950/20 text-red-400 rounded-sm">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="text-sm font-medium text-red-100">Grounding Interrupted</h3>
                  <p className="text-xs text-red-400 font-light leading-relaxed">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="px-4 py-2 border border-white/10 hover:border-[#C5A367] rounded-sm text-xs font-light text-[#8E9299] hover:text-white transition-colors cursor-pointer"
                >
                  Clear Terminal
                </button>
              </motion.div>
            )}

            {/* Trend Report Sheet */}
            {report && (
              <motion.div
                key="trends-report"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0D0D0D] border border-white/10 p-6 md:p-8 rounded-sm space-y-8 shadow-sm"
              >
                {/* Header info */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded bg-[#C5A367]/20 text-[#C5A367] text-[10px] font-mono tracking-widest uppercase font-semibold">
                      Targeted: {report.season || "Sartorial 2026"}
                    </span>
                    <h3 className="text-xl md:text-2xl font-light text-white">
                      Haute Runway Trend Synthesis
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#8E9299] font-mono uppercase tracking-wider">
                      Grounded Live Analysis
                    </span>
                  </div>
                </div>

                {/* Editorial Summary */}
                <div className="p-4 bg-[#141414] rounded-sm border border-white/5">
                  <p className="text-xs text-[#8E9299] font-light leading-relaxed">
                    <strong className="text-white font-medium">Editorial Overview:</strong> {report.reportSummary}
                  </p>
                </div>

                {/* Pillars Grid */}
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase text-[#8E9299] tracking-widest">Key Design Pillars</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {report.pillars.map((pil, idx) => (
                      <div
                        key={idx}
                        className="p-5 border border-white/5 bg-[#141414] hover:border-[#C5A367]/20 rounded-sm transition-colors space-y-4 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <span className="text-xs font-mono text-[#8E9299]/50">0{idx + 1}</span>
                          <h5 className="font-medium text-white tracking-tight text-sm">
                            {pil.name}
                          </h5>
                          <p className="text-xs text-[#8E9299] font-light leading-relaxed">
                            {pil.description}
                          </p>
                        </div>
                        <div className="space-y-1.5 pt-2 border-t border-white/5">
                          <p className="text-[9px] font-mono text-[#C5A367] uppercase leading-none tracking-wider">
                            Runway Spearhead
                          </p>
                          <p className="text-xs font-medium text-white">
                            {pil.citation}
                          </p>
                          <p className="text-[10px] text-[#8E9299] leading-normal font-light italic">
                            &ldquo;{pil.visualVibe}&rdquo;
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Citations & Source list */}
                {report.citations && report.citations.length > 0 && (
                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-[#8E9299] uppercase tracking-wider">Search Grounding citations</span>
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {report.citations.map((cite, idx) => (
                        <li key={idx} className="flex items-center">
                          <a
                            href={cite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#8E9299] hover:text-[#C5A367] font-light flex items-center gap-1 hover:underline truncate max-w-full"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-[#C5A367] shrink-0" />
                            <span className="truncate">{cite}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
