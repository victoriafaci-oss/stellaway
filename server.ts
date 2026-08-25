import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client lazy/safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "StellaWay" });
  });

  // Astronomical Weather & Sky conditions API
  app.get("/api/sky-conditions", (req, res) => {
    res.json({
      location: "Castellón & Arco Mediterráneo",
      bortleClass: 3,
      seeing: "Excelente",
      seeingScore: 9.2,
      cloudCover: {
        low: 12,
        mid: 4,
        high: 0,
      },
      relativeHumidity: 42,
      transparency: "Óptima (5.8 mag)",
      windSpeedKmH: 7,
      moonPhase: "Luna Nueva (2% iluminada)",
      planetaryEnergy: {
        planet: "Saturno en Tránsito",
        summary: "Momento de introspección y calma. Ideal para observación profunda de cielo profundo.",
        visibility: "Visibilidad excelente a partir de las 22:30h en dirección Sudeste."
      },
      eclipse2026Date: "2026-08-12T19:30:00Z"
    });
  });

  // Stargazing AI Assistant Route using Gemini 3.6 Flash
  app.post("/api/assistant", async (req, res) => {
    try {
      const { message, conversationHistory = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Mensaje requerido" });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.json({
          reply: "El servicio de IA estelar está activo en modo local offline. ¿En qué te puedo ayudar sobre el Gran Eclipse Solar 2026 o tus sesiones de observación?"
        });
      }

      const systemInstruction = `Eres "Stella", el asistente virtual experto de StellaWay, una aplicación dedicada a la observación astronómica, astrofotografía y el seguimiento del Gran Eclipse Solar Total del 12 de agosto de 2026 en Castellón y el Arco Mediterráneo.
Responde de forma clara, apasionada, precisa e inspiradora en español. Ofrece recomendaciones de telescopios, equipo, lugares con baja contaminación lumínica (Escala Bortle), objetos de cielo profundo (Messier, Caldwell), técnicas de astrofotografía y detalles del Gran Eclipse Solar 2026.`;

      const contents = [
        ...conversationHistory.map((item: { role: string; content: string }) => ({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.content }],
        })),
        { role: "user", parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || "No pude generar una respuesta en este momento. ¡Sigue mirando las estrellas!";
      res.json({ reply });
    } catch (error) {
      console.error("Error in AI Assistant:", error);
      res.status(500).json({
        error: "Error procesando la consulta estelar",
        reply: "Servicio temporalmente no disponible. Inténtalo de nuevo en unos momentos."
      });
    }
  });

  // Vite middleware in dev mode
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
