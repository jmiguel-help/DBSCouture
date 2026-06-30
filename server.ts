import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Express middleware for JSON parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Lazy initialisation helper for Gemini to prevent crash if key is missing on start
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set. AI features will run in sandbox/fallback mode.");
      throw new Error("GEMINI_API_KEY is required for AI actions. Please configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// -----------------------------------------------------------------------------
// API Endpoints
// -----------------------------------------------------------------------------

// 1. BESPOKE DESIGN ATELIER ENDPOINT
// Generates a fully detailed couture item and (optionally) a sketch using gemini-2.5-flash-image
app.post("/api/design", async (req, res) => {
  try {
    const { prompt, archetype, structure, vibe } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required to design an outfit." });
    }

    const ai = getAiClient();

    // Setup style instructions based on context parameters
    const systemPrompt = `You are an elite, haute couture digital fashion designer and textile engineer.
Your task is to design a unique, bespoke luxury fashion garment or complete outfit based on the user's creative prompt and constraints.
Style constraints:
- Style Archetype: ${archetype || "Minimalist"}
- Structural Style: ${structure || "Balanced Fluidity"}
- Artistic Vibe: ${vibe || "Modern Elegance"}

You must return a highly detailed design specifications object in JSON. Make it sound extremely professional, editorial, and sophisticated.
Do not use technical jargon about code. Use luxury fashion terms (e.g., drape, crepe, grain line, welt pocket, double-breasted, bias-cut).`;

    const userInstructions = `Design a high-fashion piece for: "${prompt}".
Provide:
1. Name: An elegant name for this garment/look.
2. Narrative: A poetic, editorial narrative describing the inspiration, fit, and movement (2-3 sentences).
3. Fabrics: A list of 2-3 precise fabrics with weights, origin, or description (e.g., "300gsm Japanese raw denim", "Double-ply Mulberry silk crepe de chine").
4. ColorPalette: 3 to 4 colors, each with an elegant name (e.g., "Obsidian Noir", "Dry Sand") and hex code.
5. TechnicalSpecs: 4 key structural details (e.g., "Hand-rolled lapel", "Asymmetrical fluid drape", "Hidden horn-button closure").
6. ImagePrompt: A detailed, high-quality prompt that can be passed to an image generation model to paint a professional, luxury lookbook photo of this exact garment on a minimalist neutral backdrop. Keep it clean and elegant.`;

    const textResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userInstructions,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Elegant name of the garment" },
            narrative: { type: Type.STRING, description: "Poetic editorial description of the inspiration and design" },
            fabrics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of premium fabrics used"
            },
            colorPalette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Sartorial name of the color" },
                  hex: { type: Type.STRING, description: "Valid hex code including #" }
                },
                required: ["name", "hex"]
              },
              description: "Curated seasonal color palette"
            },
            technicalSpecs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Technical details, cuts, trims, and finishes"
            },
            imagePrompt: { type: Type.STRING, description: "Detailed lookbook prompt for image generation" }
          },
          required: ["name", "narrative", "fabrics", "colorPalette", "technicalSpecs", "imagePrompt"]
        }
      }
    });

    const designData = JSON.parse(textResponse.text || "{}");

    // Try to generate an image sketch using gemini-2.5-flash-image
    let imageBase64 = null;
    try {
      const imgPrompt = `${designData.imagePrompt || prompt}. High-fashion lookbook, architectural tailoring, editorial photography, high-end studio lighting, clean soft background, hyper-detailed texture.`;
      const imgResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: imgPrompt,
        config: {
          imageConfig: {
            aspectRatio: "3:4",
            imageSize: "1K"
          }
        }
      });

      // Find inline data in parts
      if (imgResponse.candidates?.[0]?.content?.parts) {
        for (const part of imgResponse.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            imageBase64 = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (imgErr) {
      console.warn("Real-time image generation sketch skipped/failed (requires paid key/quota):", imgErr instanceof Error ? imgErr.message : imgErr);
    }

    res.json({
      success: true,
      design: designData,
      sketchUrl: imageBase64 // will be null if skipped, frontend handles fallback gracefully
    });

  } catch (error) {
    console.error("Design Atelier error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "An error occurred during garment drafting."
    });
  }
});

// 2. INTELLIGENT STYLING FORMULATION ENDPOINT
// Recommends clothing pairings and styling strategies for selected wardrobe pieces
app.post("/api/styling", async (req, res) => {
  try {
    const { items, occasion } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Please select at least one item from the wardrobe to style." });
    }

    const ai = getAiClient();

    const systemPrompt = `You are a high-fashion personal stylist, private concierge, and fashion editor.
Given a list of items from a user's digital wardrobe, formulate an elite, editorial-worthy styling combination.
Make the advice highly actionable, rich with aesthetic vision, and focused on silhouette balance, proportion play, and layering.`;

    const userPrompt = `Formulate a styled outfit for occasion: "${occasion || "Casual Sophistication"}".
Wardrobe pieces provided:
${items.map((it, idx) => `- [Item ${idx + 1}] Name: ${it.name}, Fabrics: ${it.fabrics?.join(", ") || "Unknown"}, Colors: ${it.colors?.map((c: any) => c.name).join(", ") || "Unknown"}, Type: ${it.type}`).join("\n")}

Respond in JSON format:
1. title: An editorial outfit concept title (e.g., "The Architectural Nomad", "Dusk Satin Minimalist").
2. vibe: A 1-sentence aesthetic summary.
3. layerStrategy: Layering advice (which piece goes first, outerwear combinations, tucking or draping style).
4. footwearAccessories: Suggested footwear, jewelry, and bags to complete the look.
5. stylingTip: A signature styling pro-tip (e.g., "Roll the sleeves twice to expose the lining", "Belt asymmetric to cinch").
6. synergyScore: A cohesion rating from 0 to 100 assessing how well these pieces pair.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            vibe: { type: Type.STRING },
            layerStrategy: { type: Type.STRING },
            footwearAccessories: { type: Type.STRING },
            stylingTip: { type: Type.STRING },
            synergyScore: { type: Type.INTEGER }
          },
          required: ["title", "vibe", "layerStrategy", "footwearAccessories", "stylingTip", "synergyScore"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));

  } catch (error) {
    console.error("Styling formulation error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "An error occurred during look formulation."
    });
  }
});

// 3. TREND FORECASTER ENDPOINT
// Uses Search Grounding to find actual fashion trends for the current/upcoming seasons
app.post("/api/trends", async (req, res) => {
  try {
    const { category } = req.body; // e.g. "Silhouettes", "Colors", "Fabrics"
    const ai = getAiClient();

    const searchQuery = `major haute couture fashion runway trends for ${category || "silhouettes colors and fabrics"} 2026`;

    const systemPrompt = `You are a professional fashion trend analyst, fashion forecaster, and editor.
You must analyze current runway reports and fashion forecast data to deliver an elite trend analysis report.
IMPORTANT: You MUST include sources, links, or runway citations from your search grounding results in your text. Do not make up fake links.`;

    const userPrompt = `Synthesize the top 3 high-fashion trends for "${category || "Runway Pillars"} in 2026".
Find real, up-to-date fashion show references, runway citations, and textile movements using Google Search.
Format the output strictly as a JSON object:
1. season: The targeted season (e.g. "Autumn/Winter 2026").
2. reportSummary: A 2-sentence editorial overview of the direction.
3. pillars: An array of 3 distinct trend pillars. Each pillar must have:
   - name: Distinctive trend name.
   - description: 2-sentence breakdown detailing cuts, runways, or fabrics.
   - citation: Which runway or brand spearheaded this (e.g., "Prada AW26", "Loewe Couture").
   - visualVibe: A visual description for the mood (e.g., "Oversized shoulders paired with gossamer slip details").
4. citations: Array of web sources or grounding links found during search.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            season: { type: Type.STRING },
            reportSummary: { type: Type.STRING },
            pillars: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  citation: { type: Type.STRING },
                  visualVibe: { type: Type.STRING }
                },
                required: ["name", "description", "citation", "visualVibe"]
              }
            },
            citations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["season", "reportSummary", "pillars", "citations"]
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    
    // Supplement with grounding metadata URLs if any
    const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (searchChunks && Array.isArray(searchChunks)) {
      const extractedUrls = searchChunks
        .map((chunk: any) => chunk.web?.uri)
        .filter((uri): uri is string => typeof uri === "string");
      
      if (extractedUrls.length > 0) {
        parsedData.citations = Array.from(new Set([...(parsedData.citations || []), ...extractedUrls]));
      }
    }

    res.json(parsedData);

  } catch (error) {
    console.error("Trend Forecaster error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "An error occurred during runway trend synthesis."
    });
  }
});

// -----------------------------------------------------------------------------
// Vite and Static File Serving
// -----------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Couture Intelligent Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
