import type { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";
import { generateAstronomicalAnswer } from "../../src/lib/astronomyKnowledge";
import { normalizeLanguage, SupportedLanguage } from "../../src/lib/i18nHelpers";

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

export const handler: Handler = async (event, _context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const lang = normalizeLanguage(body?.language);
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Message required" }),
      };
    }

    const langNames: Record<SupportedLanguage, string> = {
      es: "Spanish (Español)",
      en: "English",
      fr: "French (Français)",
      pt: "Portuguese (Português)",
      it: "Italian (Italiano)",
      de: "German (Deutsch)",
    };

    const ai = getAiClient();
    if (ai) {
      try {
        const systemInstruction = `You are "Stella", the expert astronomy and stargazing AI assistant from StellaWay (Starlight reserves, DarkSky sanctuaries, polar auroras & Solar Eclipses 2026–2027).
CRITICAL: Always reply in ${langNames[lang]} matching the user's selected language (${lang}). Give accurate, clear, and practical guidance on telescopes, astrophotography, Bortle 1–9 skies, and eclipses.`;

        const safeHistory = Array.isArray(conversationHistory) ? conversationHistory : [];
        const contents = [
          ...safeHistory.map((item: { role: string; content: string }) => ({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: String(item.content || "") }],
          })),
          { role: "user", parts: [{ text: message }] },
        ];

        const response = await ai.models.generateContent({
          model: "gemini-4-hydrogen",
          contents,
          config: {
            systemInstruction,
          },
        });

        const reply = response.text;
        if (reply && reply.trim().length > 0) {
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply, language: lang }),
          };
        }
      } catch (apiError) {
        console.warn("Gemini API call failed, invoking intelligent astronomical fallback:", apiError);
      }
    }

    const fallback = generateAstronomicalAnswer(message, lang);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: fallback, language: lang }),
    };
  } catch (error) {
    console.error("Error in AI Assistant handler:", error);
    const safeReply = generateAstronomicalAnswer("hola", "es");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: safeReply, language: "es" }),
    };
  }
};
