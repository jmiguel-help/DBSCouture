import { WardrobeItem } from "./types";

// Import our pre-generated high-fashion lookbook images
import blazerImg from "./assets/images/couture_minimal_blazer_1782793075843.jpg";
import dressImg from "./assets/images/couture_silk_dress_1782793093434.jpg";
import trenchImg from "./assets/images/couture_wool_trench_1782793110138.jpg";
import jacketImg from "./assets/images/couture_tech_jacket_1782793131904.jpg";

export const initialWardrobe: WardrobeItem[] = [
  {
    id: "lookbook-blazer",
    name: "Sandtailored Linen Blazer",
    narrative: "A masterclass in restraint, this double-breasted sand blazer features relaxed shoulders and extended lines. It hangs with deliberate drape, channeling warm-weather sophistication and casual authority.",
    fabrics: ["220gsm Organic Irish Linen", "Habotai Silk interior half-lining"],
    colors: [
      { name: "Sartorial Sand", hex: "#E3D3C4" },
      { name: "Chalk White", hex: "#F5F5F0" }
    ],
    technicalSpecs: [
      "Relaxed architectural shoulders",
      "Soft double-breasted front with hidden horn buttons",
      "Unstructured back draping",
      "Hand-finished welt pockets"
    ],
    imageUrl: blazerImg,
    type: "Outerwear",
    archetype: "Minimalist",
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "lookbook-dress",
    name: "Champagne Slip Draped Dress",
    narrative: "An elegant fluid dress that clings and cascades like liquid gold. Designed with an open cowl back and bias-cut hem, it moves beautifully under light, creating a shimmering weightless silhouette.",
    fabrics: ["35 momme Heavy Mulberry Silk Crepe de Chine", "Fine Silk Satin trim"],
    colors: [
      { name: "Champagne Lustre", hex: "#E8D8C8" },
      { name: "Soft Ivory", hex: "#FFFDF9" }
    ],
    technicalSpecs: [
      "Precision bias-cut drape",
      "Liquid-flow low cowl neckline",
      "Delicate hand-rolled spaghetti shoulder straps",
      "Floating asymmetric midi hemline"
    ],
    imageUrl: dressImg,
    type: "Dress",
    archetype: "Romantic Draper",
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "lookbook-trench",
    name: "Obsidian Asymmetric Wool Trench",
    narrative: "An imposing, architectural outer layer constructed from dense volcanic wool. Features extreme storm flaps and a beltless asymmetric crossover closure that structures the body with modern drama.",
    fabrics: ["480gsm Virgin Australian Wool Tweed", "Heavy silk satin sleeve sleeve lining"],
    colors: [
      { name: "Obsidian Noir", hex: "#1A1A1A" },
      { name: "Volcanic Ash", hex: "#3D3D3D" }
    ],
    technicalSpecs: [
      "Dramatic oversized peak lapels",
      "Asymmetric deep storm flaps on chest",
      "Concealed gunmetal clasp closure",
      "Vent back with deep pleat for movement"
    ],
    imageUrl: trenchImg,
    type: "Outerwear",
    archetype: "Structured Tailoring",
    isCustom: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "lookbook-jacket",
    name: "Metalthread Architectural Jacket",
    narrative: "A futuristic cropped jacket containing micro-metallic silver threads that allow the wearer to memory-mold the creases. Features sharp, geometric collar cuts and structured waist cinching.",
    fabrics: ["Cotton-poly composite with 3% Silver Micro-filaments", "Matte silk satin collar lining"],
    colors: [
      { name: "Alloy Silver", hex: "#BFC1C2" },
      { name: "Obsidian Gray", hex: "#2C3539" }
    ],
    technicalSpecs: [
      "Crease-retaining memory metallic thread matrix",
      "Sharp angular futuristic stand-collar",
      "Cropped ergonomic sleeve tailoring",
      "Integrated side-cinch buckles"
    ],
    imageUrl: jacketImg,
    type: "Outerwear",
    archetype: "Cyberpunk Tailor",
    isCustom: false,
    createdAt: new Date().toISOString()
  }
];

export const styleArchetypes = [
  {
    name: "Minimalist",
    tagline: "Restraint. Soft neutrals. Pure form.",
    desc: "Focuses on premium fabrics, hidden closures, and balanced fluidity. Think sand linen blazers, silk slips, and charcoal wool."
  },
  {
    name: "Avant-Garde",
    tagline: "Asymmetry. Over-proportion. Pure concept.",
    desc: "Challenges standard garment geometry with draped folds, high-contrast black overlays, and sculptural volume."
  },
  {
    name: "Structured Tailoring",
    tagline: "Architectural shoulders. Crisp lines. Power form.",
    desc: "Emphasizes sharp waist-cinches, heavy wool overlays, structured double-breasted closures, and imposing lines."
  },
  {
    name: "Romantic Draper",
    tagline: "Liquid silk. Cowl backs. Gentle movement.",
    desc: "Encompasses bias-cut dresses, shimmering crepe de chine, and soft cascading drapes that respond to motion."
  },
  {
    name: "Cyberpunk Tailor",
    tagline: "Tech composite. Memory creases. Silver threads.",
    desc: "Utilizes composite fabrics with memory wire, tech-strapping, cropped hems, and metallic silver alloy highlights."
  }
];
