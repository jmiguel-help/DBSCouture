import React from "react";
import { motion } from "motion/react";
import { Sparkles, Compass, Layers, ShieldCheck, Heart } from "lucide-react";
import { WardrobeItem, StyleArchetype } from "../types";
import { styleArchetypes } from "../data";

interface DashboardProps {
  wardrobe: WardrobeItem[];
  selectedArchetype: StyleArchetype;
  setSelectedArchetype: (arch: StyleArchetype) => void;
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({
  wardrobe,
  selectedArchetype,
  setSelectedArchetype,
  setActiveTab,
}: DashboardProps) {
  // Simple stats calculation
  const totalItems = wardrobe.length;
  const customDraftsCount = wardrobe.filter((item) => item.isCustom).length;
  const lookbookCount = totalItems - customDraftsCount;

  // Extract primary colors for display
  const colorCount: { [key: string]: string } = {};
  wardrobe.forEach((item) => {
    item.colors.forEach((col) => {
      colorCount[col.name] = col.hex;
    });
  });
  const colorNames = Object.keys(colorCount).slice(0, 5);

  // Pick Look of the Day
  const lookOfTheDay = wardrobe[0] || null;

  return (
    <div className="space-y-12">
      {/* Editorial Hero Brand Banner */}
      <motion.div
        id="dashboard-hero"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden bg-gradient-to-br from-[#0D0D0D] to-[#050505] text-[#E0E0E0] p-8 md:p-16 rounded-sm border border-white/10"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(197,163,103,0.08)_0%,transparent_60%)] opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm border border-white/10 bg-[#050505] text-xs font-mono tracking-widest text-[#C5A367]">
            <Sparkles className="w-3.5 h-3.5" /> Haute Couture AI
          </div>
          <h1 className="text-4xl md:text-6xl font-sans font-light tracking-tight text-white leading-none">
            Couture <span className="font-serif italic font-normal text-[#C5A367]">Intelligent</span>
          </h1>
          <p className="text-base md:text-lg text-[#8E9299] font-light leading-relaxed max-w-xl">
            Where mathematical precision meets artistic drapery. We weave advanced AI reasoning and generative sketches directly into bespoke sartorial patterns, custom tailored for your precise digital look.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              id="btn-atelier"
              onClick={() => setActiveTab("atelier")}
              className="px-6 py-3 bg-[#C5A367] hover:bg-[#b08e54] text-neutral-950 rounded-sm font-medium text-sm transition-colors duration-200 cursor-pointer uppercase tracking-wider"
            >
              Enter AI Design Atelier
            </button>
            <button
              id="btn-closet"
              onClick={() => setActiveTab("closet")}
              className="px-6 py-3 border border-white/20 hover:border-[#C5A367] bg-white/5 rounded-sm font-medium text-sm text-neutral-200 transition-colors duration-200 cursor-pointer uppercase tracking-wider"
            >
              View Digital Wardrobe
            </button>
          </div>
        </div>
      </motion.div>

      {/* Wardrobe Metrics Grid */}
      <div id="metrics-grid" className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-2">
          <p className="text-xs font-mono text-[#8E9299] tracking-widest uppercase">Active Wardrobe</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-white">{totalItems}</span>
            <span className="text-xs text-[#8E9299]">Pieces</span>
          </div>
        </div>

        <div className="p-6 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-2">
          <p className="text-xs font-mono text-[#8E9299] tracking-widest uppercase">Custom AI Drafts</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-white">{customDraftsCount}</span>
            <span className="text-xs text-[#C5A367] font-mono font-medium tracking-wider">Bespoke</span>
          </div>
        </div>

        <div className="p-6 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-2">
          <p className="text-xs font-mono text-[#8E9299] tracking-widest uppercase">Studio Lookbooks</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light text-white">{lookbookCount}</span>
            <span className="text-xs text-[#8E9299]">Masterpieces</span>
          </div>
        </div>

        <div className="p-6 bg-[#0D0D0D] border border-white/5 rounded-sm space-y-2">
          <p className="text-xs font-mono text-[#8E9299] tracking-widest uppercase">Curated Palettes</p>
          <div className="flex gap-1.5 pt-2">
            {colorNames.length > 0 ? (
              colorNames.map((name, i) => (
                <div
                  key={i}
                  title={name}
                  className="w-6 h-6 rounded-full border border-white/20"
                  style={{ backgroundColor: colorCount[name] }}
                />
              ))
            ) : (
              <span className="text-xs text-[#8E9299] font-mono">None loaded</span>
            )}
          </div>
        </div>
      </div>

      {/* Style Archetypes Selector Section */}
      <div id="archetype-section" className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-light tracking-tight text-white">Aesthetic Archetypes</h2>
          <p className="text-sm text-[#8E9299]">Select your base styling profile. This influences your bespoke AI garment draping algorithms.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {styleArchetypes.map((arch) => {
            const isSelected = selectedArchetype === arch.name;
            return (
              <motion.div
                key={arch.name}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedArchetype(arch.name as StyleArchetype)}
                className={`p-5 rounded-sm border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? "border-[#C5A367] bg-[#141414] text-white shadow-sm"
                    : "border-white/5 bg-[#0D0D0D] hover:border-white/20 text-[#8E9299]"
                }`}
              >
                <div className="space-y-2">
                  <h3 className={`font-medium tracking-tight text-sm ${isSelected ? "text-white" : "text-[#E0E0E0]"}`}>
                    {arch.name}
                  </h3>
                  <p className={`text-xs ${isSelected ? "text-[#C5A367]" : "text-[#8E9299]"} font-mono`}>
                    {arch.tagline}
                  </p>
                  <p className={`text-xs leading-relaxed font-light ${isSelected ? "text-neutral-300" : "text-[#8E9299]"}`}>
                    {arch.desc}
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <span className={`text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded-sm ${
                    isSelected ? "bg-[#C5A367]/20 text-[#C5A367]" : "bg-white/5 text-[#8E9299] border border-white/5"
                  }`}>
                    {isSelected ? "Active Persona" : "Select Profile"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Featured Look of the Day Section */}
      {lookOfTheDay && (
        <div id="lookbook-showcase" className="bg-gradient-to-br from-[#0D0D0D] to-[#050505] border border-white/10 rounded-sm p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-5 aspect-[3/4] w-full overflow-hidden rounded-sm border border-white/10">
            <img
              src={lookOfTheDay.imageUrl}
              alt={lookOfTheDay.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded bg-[#141414] border border-white/5 text-[#C5A367] text-[10px] font-mono tracking-widest uppercase">
                Featured Masterpiece
              </span>

              <h3 className="text-2xl md:text-3xl font-light text-white">{lookOfTheDay.name}</h3>
              <p className="text-xs text-[#C5A367] font-mono">{lookOfTheDay.archetype} Archetype</p>
            </div>
            <p className="text-sm text-[#8E9299] font-light leading-relaxed">
              {lookOfTheDay.narrative}
            </p>
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase text-[#8E9299] tracking-wider">Fabric Integrity</h4>
              <ul className="flex flex-wrap gap-2">
                {lookOfTheDay.fabrics.map((fab, idx) => (
                  <li key={idx} className="px-3 py-1 rounded-sm bg-[#141414] text-xs text-[#E0E0E0] border border-white/5">
                    {fab}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-4 pt-2">
              <button
                id="btn-view-lookbook-closet"
                onClick={() => setActiveTab("closet")}
                className="px-5 py-2.5 border border-[#C5A367] hover:bg-[#C5A367] hover:text-black text-[#C5A367] font-medium text-xs rounded-sm transition-colors duration-200 cursor-pointer uppercase tracking-wider"
              >
                Interact inside Closet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
