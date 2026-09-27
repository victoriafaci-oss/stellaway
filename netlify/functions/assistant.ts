import type { Handler } from "@netlify/functions";
import { GoogleGenAI } from "@google/genai";
import { generateAstronomicalAnswer } from "../../src/lib/astronomyKnowledge";

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
    const { message, conversationHistory = [], language = "es" } = JSON.parse(
      event.body || "{}"
    );

    if (!message) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Mensaje requerido" }),
      };
    }

    const ai = getAiClient();
    if (ai) {
      try {
        const isEnglish = language === "en";
        const systemInstruction = isEnglish
          ? `You are "Stella", the expert astronomy and stargazing AI assistant from StellaWay, an app dedicated to astronomical observation, astrophotography, and tracking the Great Total Solar Eclipse of August 12, 2026 in Spain (Castellón, Iberian Peninsula, and Mediterranean Arc).
Respond clearly, enthusiastically, and accurately in English. Provide expert advice on telescopes, astrophotography gear, Bortle scale dark sky spots, deep sky objects, and the 2026 Total Solar Eclipse.`
          : `Eres "Stella", el asistente virtual experto de StellaWay, una aplicación dedicada a la observación astronómica, astrofotografía y el seguimiento del Gran Eclipse Solar Total del 12 de agosto de 2026 en Castellón y el Arco Mediterráneo.
Responde de forma clara, apasionada, precisa e inspiradora en español. Ofrece recomendaciones de telescopios, equipo, lugares con baja contaminación lumínica (Escala Bortle), objetos de cielo profundo (Messier, Caldwell), técnicas de astrofotografía y detalles del Gran Eclipse Solar 2026.`;

        const contents = [
          ...conversationHistory.map((item: { role: string; content: string }) => ({
            role: item.role === "user" ? "user" : "model",
            parts: [{ text: item.content }],
          })),
          { role: "user", parts: [{ text: message }] },
        ];

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text;
        if (reply && reply.trim().length > 0) {
          return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply }),
          };
        }
      } catch (apiError) {
        console.warn("Gemini API call failed, invoking intelligent astronomical fallback:", apiError);
      }
    }

    // Intelligent Astronomical Knowledge Engine
    const fallback = generateAstronomicalAnswer(message, language);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: fallback }),
    };
  } catch (error) {
    console.error("Error in AI Assistant handler:", error);
    const safeReply = generateAstronomicalAnswer("hola", "es");
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: safeReply }),
    };
  }
};

