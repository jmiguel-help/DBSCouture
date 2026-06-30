import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Scissors, Compass, Layers, Sparkles, LayoutDashboard, Menu, X, Check, Heart } from "lucide-react";
import { WardrobeItem, StyleArchetype } from "./types";
import { initialWardrobe } from "./data";

// Component imports
import Dashboard from "./components/Dashboard";
import Atelier from "./components/Atelier";
import Closet from "./components/Closet";
import TrendForecaster from "./components/TrendForecaster";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(initialWardrobe);
  const [selectedArchetype, setSelectedArchetype] = useState<StyleArchetype>("Minimalist");
  
  // Custom interactive notification state
  const [notification, setNotification] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAddItem = (item: WardrobeItem) => {
    setWardrobe((prev) => [item, ...prev]);
    triggerNotification(`&ldquo;${item.name}&rdquo; cataloged into Wardrobe.`);
  };

  const handleDeleteItem = (id: string) => {
    setWardrobe((prev) => prev.filter((item) => item.id !== id));
    triggerNotification("Garment design removed from digital catalog.");
  };

  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-sans flex flex-col justify-between selection:bg-[#C5A367] selection:text-neutral-950">
      
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 bg-[#141414] border border-white/10 rounded-sm shadow-lg flex items-center gap-3 max-w-sm md:max-w-md"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <p 
              className="text-xs font-light text-neutral-200"
              dangerouslySetInnerHTML={{ __html: notification }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Header */}
      <header className="border-b border-white/10 bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-sm bg-[#C5A367] flex items-center justify-center text-black transition-transform group-hover:rotate-12 duration-300">
              <Scissors className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-lg font-display font-medium tracking-tight text-white leading-none">
                Couture <span className="font-serif italic text-[#C5A367]">Intelligent</span>
              </h1>
              <p className="text-[9px] font-mono tracking-wider uppercase text-[#8E9299] mt-0.5 leading-none">
                Atelier &amp; Wardrobe
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wider uppercase">
            <button
              id="nav-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 transition-colors cursor-pointer relative ${
                activeTab === "dashboard" ? "text-[#C5A367]" : "text-[#8E9299] hover:text-white"
              }`}
            >
              Dashboard
              {activeTab === "dashboard" && (
                <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C5A367]" />
              )}
            </button>
            <button
              id="nav-atelier"
              onClick={() => setActiveTab("atelier")}
              className={`py-2 transition-colors cursor-pointer relative ${
                activeTab === "atelier" ? "text-[#C5A367]" : "text-[#8E9299] hover:text-white"
              }`}
            >
              AI Atelier
              {activeTab === "atelier" && (
                <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C5A367]" />
              )}
            </button>
            <button
              id="nav-closet"
              onClick={() => setActiveTab("closet")}
              className={`py-2 transition-colors cursor-pointer relative ${
                activeTab === "closet" ? "text-[#C5A367]" : "text-[#8E9299] hover:text-white"
              }`}
            >
              Closet
              {activeTab === "closet" && (
                <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C5A367]" />
              )}
            </button>
            <button
              id="nav-trends"
              onClick={() => setActiveTab("trends")}
              className={`py-2 transition-colors cursor-pointer relative ${
                activeTab === "trends" ? "text-[#C5A367]" : "text-[#8E9299] hover:text-white"
              }`}
            >
              Forecaster
              {activeTab === "trends" && (
                <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#C5A367]" />
              )}
            </button>
          </nav>

          {/* Right quick badge */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#8E9299]">
              Active Profile:
            </span>
            <span className="text-xs font-mono bg-[#C5A367]/10 border border-[#C5A367]/20 text-[#C5A367] px-3 py-1 rounded-sm font-medium">
              {selectedArchetype}
            </span>
          </div>

          {/* Mobile menu trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0A0A0A] border-b border-white/10 overflow-hidden"
          >
            <nav className="flex flex-col p-6 space-y-4 text-xs font-mono tracking-wider uppercase">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 ${activeTab === "dashboard" ? "text-[#C5A367]" : "text-[#8E9299]"}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab("atelier");
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 ${activeTab === "atelier" ? "text-[#C5A367]" : "text-[#8E9299]"}`}
              >
                AI Atelier
              </button>
              <button
                onClick={() => {
                  setActiveTab("closet");
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 ${activeTab === "closet" ? "text-[#C5A367]" : "text-[#8E9299]"}`}
              >
                Closet
              </button>
              <button
                onClick={() => {
                  setActiveTab("trends");
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 ${activeTab === "trends" ? "text-[#C5A367]" : "text-[#8E9299]"}`}
              >
                Forecaster
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 md:py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {activeTab === "dashboard" && (
              <Dashboard
                wardrobe={wardrobe}
                selectedArchetype={selectedArchetype}
                setSelectedArchetype={setSelectedArchetype}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === "atelier" && (
              <Atelier
                selectedArchetype={selectedArchetype}
                onAddItem={handleAddItem}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === "closet" && (
              <Closet
                wardrobe={wardrobe}
                onDeleteItem={handleDeleteItem}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === "trends" && (
              <TrendForecaster />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#050505] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-[#C5A367] flex items-center justify-center text-black">
              <Scissors className="w-3 h-3" />
            </div>
            <span className="text-xs font-display font-medium text-white">
              Couture <span className="font-serif italic text-[#C5A367]">Intelligent</span>
            </span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] font-mono text-[#8E9299]">
              Intelligent tailoring. Digital drape. Handcrafted precision.
            </p>
            <p className="text-[9px] text-neutral-500 mt-1">
              &copy; 2026 Couture Intelligent. Powered by Google Gemini. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
