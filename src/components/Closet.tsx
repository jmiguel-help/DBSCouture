import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, Sparkles, AlertCircle, RefreshCw, Eye, Trash2, Heart, CheckCircle2, ChevronRight, Check } from "lucide-react";
import { WardrobeItem, StylingRecommendation } from "../types";

interface ClosetProps {
  wardrobe: WardrobeItem[];
  onDeleteItem: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function Closet({
  wardrobe,
  onDeleteItem,
  setActiveTab,
}: ClosetProps) {
  // Filtering states
  const [catFilter, setCatFilter] = useState<string>("All");
  const [archFilter, setArchFilter] = useState<string>("All");

  // Selection states for outfit pairings
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [occasion, setOccasion] = useState("Parisian Art Vernissage");

  // Styling analysis outcome
  const [stylingLoading, setStylingLoading] = useState(false);
  const [stylingError, setStylingError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<StylingRecommendation | null>(null);

  // Filter list
  const categories = ["All", "Top", "Bottom", "Outerwear", "Dress", "Accessory"];
  const archetypes = ["All", "Minimalist", "Avant-Garde", "Structured Tailoring", "Romantic Draper", "Cyberpunk Tailor"];

  // Perform filtration
  const filteredItems = wardrobe.filter((item) => {
    const matchCat = catFilter === "All" || item.type === catFilter;
    const matchArch = archFilter === "All" || item.archetype === archFilter;
    return matchCat && matchArch;
  });

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleFormulateOutfit = async () => {
    if (selectedIds.length === 0) return;

    setStylingLoading(true);
    setStylingError(null);
    setRecommendation(null);

    const selectedItems = wardrobe.filter((it) => selectedIds.includes(it.id));

    try {
      const response = await fetch("/api/styling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedItems,
          occasion,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to formulate styling recommendation.");
      }

      setRecommendation(data);
    } catch (err) {
      setStylingError(err instanceof Error ? err.message : "Styling engine was unable to balance these fabrics.");
    } finally {
      setStylingLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
    setRecommendation(null);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-light text-white tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C5A367]" /> Intelligent Closet
          </h2>
          <p className="text-xs text-[#8E9299] font-light">
            Catalog of lookbook standards and bespoke drafted pieces. Select garments to formulate styling synergy.
          </p>
        </div>

        {/* Categories Quick Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all cursor-pointer ${
                catFilter === cat
                  ? "bg-[#C5A367]/10 text-[#C5A367] border border-[#C5A367]/30"
                  : "bg-[#0D0D0D] border border-white/5 hover:border-white/20 text-[#8E9299]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Wardrobe Grid Column (Left) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Sub-filtering: Archetype selection row */}
          <div className="flex items-center gap-3 overflow-x-auto py-1">
            <span className="text-[10px] font-mono uppercase text-[#8E9299] shrink-0">Filter Archetype:</span>
            <div className="flex gap-2">
              {archetypes.map((arch) => (
                <button
                  key={arch}
                  onClick={() => setArchFilter(arch)}
                  className={`px-2.5 py-1 rounded-sm text-[10px] font-mono transition-all cursor-pointer shrink-0 ${
                    archFilter === arch
                      ? "bg-[#C5A367]/20 text-[#C5A367] border border-[#C5A367]/35"
                      : "bg-[#141414] hover:bg-[#1C1C1C] border border-white/5 text-[#8E9299]"
                  }`}
                >
                  {arch}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Items */}
          {filteredItems.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-sm p-12 text-center bg-[#0D0D0D] space-y-3">
              <p className="text-sm text-[#8E9299] font-light">No items match your active filtration parameters.</p>
              <button
                onClick={() => {
                  setCatFilter("All");
                  setArchFilter("All");
                }}
                className="text-xs text-[#C5A367] hover:text-[#b08e54] font-mono cursor-pointer"
              >
                Reset Filter Parameters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    className={`relative group border rounded-sm overflow-hidden transition-all duration-300 flex flex-col justify-between ${
                      isSelected
                        ? "border-[#C5A367] ring-1 ring-[#C5A367] bg-[#141414]"
                        : "border-white/5 hover:border-white/20 bg-[#0D0D0D]"
                    }`}
                  >
                    {/* Item Image with selection toggle */}
                    <div className="relative aspect-[3/4] bg-[#141414] overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />

                      {/* Select Overlay Checkbox Indicator */}
                      <div
                        onClick={() => handleToggleSelect(item.id)}
                        className="absolute top-3 left-3 w-5 h-5 rounded-full border border-white/10 bg-black/85 flex items-center justify-center cursor-pointer shadow-2xs transition-all"
                      >
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-[#C5A367] flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-black" />
                          </div>
                        )}
                      </div>

                      {/* Delete option for custom drafted items */}
                      {item.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteItem(item.id);
                          }}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-black/85 hover:bg-red-950/45 text-neutral-400 hover:text-red-400 border border-white/10 shadow-2xs transition-colors cursor-pointer"
                          title="Dissolve Garment Design"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Type Label */}
                      <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-sm bg-[#050505] text-[9px] font-mono text-[#C5A367] border border-white/10">
                        {item.type}
                      </div>
                    </div>

                    {/* Meta Section */}
                    <div className="p-3 space-y-1">
                      <p className="text-[9px] font-mono text-[#C5A367] uppercase">{item.archetype}</p>
                      <h4 className="text-xs font-medium text-white leading-tight group-hover:text-[#C5A367] transition-colors truncate">
                        {item.name}
                      </h4>
                      {/* Color swatches preview */}
                      <div className="flex gap-1 pt-1.5">
                        {item.colors.map((col, idx) => (
                          <div
                            key={idx}
                            title={col.name}
                            className="w-3.5 h-3.5 rounded-full border border-white/20"
                            style={{ backgroundColor: col.hex }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pairing Console & Recommendation Column (Right) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0D0D0D] text-[#E0E0E0] p-6 rounded-sm border border-white/10 space-y-6">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm bg-[#050505] border border-white/10 text-[9px] font-mono text-[#C5A367]">
                <Sparkles className="w-3 h-3" /> Styling Compiler
              </span>
              <h3 className="text-base font-medium text-white">Pairing Synthesis</h3>
              <p className="text-xs text-[#8E9299] font-light">Select 2 or more wardrobe items, configure the occasion, and synthesize dynamic drape synergy.</p>
            </div>

            {/* Selection indicators */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-[#8E9299]">Selected Items ({selectedIds.length})</span>
                {selectedIds.length > 0 && (
                  <button
                    onClick={handleClearSelection}
                    className="text-[#C5A367] hover:text-[#b08e54] cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {selectedIds.length === 0 ? (
                <div className="py-6 text-center border border-dashed border-white/5 bg-[#141414] rounded-sm text-xs text-[#8E9299] font-light leading-relaxed">
                  Click the corner of garment cards to group pieces for dynamic outfit analysis.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-1">
                  {wardrobe
                    .filter((it) => selectedIds.includes(it.id))
                    .map((it) => (
                      <div
                        key={it.id}
                        className="px-2.5 py-1.5 rounded-sm bg-[#141414] border border-white/5 flex items-center gap-2"
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: it.colors[0]?.hex }}
                        />
                        <span className="text-[10px] text-white font-light truncate max-w-[100px]">
                          {it.name}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Occasion Selection */}
            <div className="space-y-2">
              <label className="block text-[10px] font-mono uppercase text-[#8E9299] tracking-widest">Target Event / Occasion</label>
              <input
                type="text"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                placeholder="e.g. Gallery Exhibition opening, Autumn Brunch"
                className="w-full text-xs p-3 bg-[#141414] border border-white/10 rounded-sm focus:border-[#C5A367] focus:outline-none text-white placeholder:text-neutral-600 font-light"
              />
            </div>

            {/* Trigger Button */}
            <button
              id="btn-formulate-styling"
              onClick={handleFormulateOutfit}
              disabled={selectedIds.length === 0 || stylingLoading}
              className={`w-full py-3 rounded-sm font-semibold text-xs tracking-widest uppercase transition-all cursor-pointer ${
                selectedIds.length === 0 || stylingLoading
                  ? "bg-white/5 text-neutral-500 border border-white/5 cursor-not-allowed"
                  : "bg-[#C5A367] hover:bg-[#b08e54] text-neutral-950"
              }`}
            >
              {stylingLoading ? "Balancing Fabrics..." : "Synthesize Outfit Synergy"}
            </button>
          </div>

          {/* Analysis outcome renderer */}
          <AnimatePresence mode="wait">
            {stylingLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-6 bg-[#0D0D0D] border border-white/5 rounded-sm text-center space-y-4"
              >
                <div className="w-10 h-10 border border-white/5 border-t-[#C5A367] rounded-full animate-spin mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-xs font-mono uppercase text-[#C5A367] tracking-widest animate-pulse">Running Silhouette Formulation</h4>
                  <p className="text-[11px] text-[#8E9299] font-light">Assessing drape gravity, weight matches, and chromatic flow...</p>
                </div>
              </motion.div>
            )}

            {stylingError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-5 bg-red-950/10 border border-red-950/40 rounded-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-red-100">Styling Failure</h4>
                  <p className="text-[11px] text-red-400 font-light leading-relaxed">{stylingError}</p>
                </div>
              </motion.div>
            )}

            {recommendation && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-[#0D0D0D] border border-white/10 rounded-sm space-y-5"
              >
                {/* Score and Title */}
                <div className="space-y-2 border-b border-white/5 pb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A367]">Styling Verdict</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-medium text-[#8E9299]">Synergy Score:</span>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded-sm border border-emerald-900/50">
                        {recommendation.synergyScore}%
                      </span>
                    </div>
                  </div>
                  <h4 className="text-lg font-light tracking-tight text-white">{recommendation.title}</h4>
                  <p className="text-xs text-[#8E9299] font-light italic leading-relaxed">
                    &ldquo;{recommendation.vibe}&rdquo;
                  </p>
                </div>

                {/* Layering Strategy */}
                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-mono uppercase text-[#8E9299] tracking-widest">Draping & Layering Strategy</h5>
                  <p className="text-xs text-[#E0E0E0] font-light leading-relaxed">
                    {recommendation.layerStrategy}
                  </p>
                </div>

                {/* Footwear and accessories */}
                <div className="space-y-1.5">
                  <h5 className="text-[10px] font-mono uppercase text-[#8E9299] tracking-widest">Footwear & Adornments</h5>
                  <p className="text-xs text-[#E0E0E0] font-light leading-relaxed">
                    {recommendation.footwearAccessories}
                  </p>
                </div>

                {/* Signature Stylist Tip */}
                <div className="p-4 bg-[#141414] rounded-sm border border-white/5 space-y-1.5">
                  <h5 className="text-[10px] font-mono uppercase text-[#C5A367] tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Signature Pro-Tip
                  </h5>
                  <p className="text-xs text-[#8E9299] font-light leading-relaxed">
                    {recommendation.stylingTip}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
