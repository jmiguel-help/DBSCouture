export interface ColorPalette {
  name: string;
  hex: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  narrative: string;
  fabrics: string[];
  colors: ColorPalette[];
  technicalSpecs: string[];
  imageUrl: string;
  type: "Top" | "Bottom" | "Outerwear" | "Dress" | "Accessory";
  archetype: string;
  isCustom: boolean;
  createdAt: string;
}

export interface StylingRecommendation {
  title: string;
  vibe: string;
  layerStrategy: string;
  footwearAccessories: string;
  stylingTip: string;
  synergyScore: number;
}

export interface TrendPillar {
  name: string;
  description: string;
  citation: string;
  visualVibe: string;
}

export interface TrendReport {
  season: string;
  reportSummary: string;
  pillars: TrendPillar[];
  citations: string[];
}

export type StyleArchetype = "Minimalist" | "Avant-Garde" | "Romantic Draper" | "Structured Tailoring" | "Cyberpunk Tailor";
