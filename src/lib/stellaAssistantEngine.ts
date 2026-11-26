import { Content, FunctionDeclaration, GoogleGenAI, Part, ThinkingLevel, Type } from "@google/genai";
import { SupportedLanguage, normalizeLanguage } from "./i18nHelpers";
import { STARLIGHT_SPOTS, CELESTIAL_EVENTS } from "../data/stellaData";
import { DARKSKY_ZONES } from "../data/darkSkyData";
import { AURORAS_DATA } from "../data/aurorasData";
import { assembleReportFromRawApis, buildOpenMeteoForecastUrl } from "./weatherService";

export interface AssistantSource {
  title: string;
  uri: string;
}

export interface AssistantHistoryItem {
  role: string;
  content: string;
}

export interface AssistantSuccessResult {
  reply: string;
  language: SupportedLanguage;
  sources: AssistantSource[];
  toolsUsed: string[];
}

export class AssistantApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const LANG_NAMES: Record<SupportedLanguage, string> = {
  es: "Spanish (Español)",
  en: "English",
  fr: "French (Français)",
  pt: "Portuguese (Português)",
  it: "Italian (Italiano)",
  de: "German (Deutsch)",
};

const ERROR_MESSAGES: Record<
  SupportedLanguage,
  { missingKey: string; invalidKey: string; quotaExceeded: string; upstreamError: string }
> = {
  es: {
    missingKey:
      "El servicio de IA en la nube no está configurado en este entorno todavía. Cuando esté activo, Stella podrá responder cualquier pregunta libre con datos astronómicos y meteorológicos en tiempo real.",
    invalidKey:
      "No se pudo autenticar la conexión con el motor de IA. Revisa la configuración del entorno.",
    quotaExceeded:
      "El motor de IA ha alcanzado temporalmente su límite de consultas. Inténtalo de nuevo en unos momentos.",
    upstreamError:
      "No se pudo completar la consulta con el motor de IA en este momento. Inténtalo de nuevo en unos segundos.",
  },
  en: {
    missingKey:
      "The cloud AI service is not configured in this environment yet. Once active, Stella can answer any open-ended question with live astronomical and weather data.",
    invalidKey:
      "Could not authenticate with the AI engine. Please verify the environment configuration.",
    quotaExceeded:
      "The AI engine has temporarily reached its usage limit. Please try again shortly.",
    upstreamError:
      "Could not complete the request with the AI engine right now. Please try again in a moment.",
  },
  fr: {
    missingKey:
      "Le service d'IA dans le cloud n'est pas encore configuré dans cet environnement. Une fois actif, Stella pourra répondre à toute question avec des données astronomiques et météo en direct.",
    invalidKey:
      "Impossible d'authentifier la connexion au moteur d'IA. Vérifiez la configuration.",
    quotaExceeded:
      "Le moteur d'IA a temporairement atteint sa limite de requêtes. Réessayez dans un instant.",
    upstreamError:
      "Impossible de finaliser la requête auprès du moteur d'IA pour le moment.",
  },
  pt: {
    missingKey:
      "O serviço de IA na nuvem ainda não está configurado neste ambiente. Quando ativo, a Stella poderá responder a qualquer pergunta com dados astronómicos e meteorológicos em tempo real.",
    invalidKey:
      "Não foi possível autenticar a ligação com o motor de IA.",
    quotaExceeded:
      "O motor de IA atingiu temporariamente o limite de consultas. Tente novamente em breve.",
    upstreamError:
      "Não foi possível concluir o pedido com o motor de IA neste momento.",
  },
  it: {
    missingKey:
      "Il servizio IA nel cloud non è ancora configurato in questo ambiente. Quando attivo, Stella potrà rispondere a qualsiasi domanda con dati astronomici e meteo in tempo reale.",
    invalidKey:
      "Impossibile autenticare la connessione con il motore IA.",
    quotaExceeded:
      "Il motore IA ha raggiunto temporaneamente il limite di richieste. Riprova tra poco.",
    upstreamError:
      "Impossibile completare la richiesta con il motore IA in questo momento.",
  },
  de: {
    missingKey:
      "Der Cloud-KI-Dienst ist in dieser Umgebung noch nicht konfiguriert. Sobald er aktiv ist, kann Stella jede Frage mit Live-Astronomie- und Wetterdaten beantworten.",
    invalidKey:
      "Authentifizierung beim KI-Dienst fehlgeschlagen.",
    quotaExceeded:
      "Das Anfragelimit des KI-Dienstes wurde vorübergehend erreicht. Bitte versuche es gleich erneut.",
    upstreamError:
      "Die Anfrage an den KI-Dienst konnte derzeit nicht abgeschlossen werden.",
  },
};

function normalizeText(str: string): string {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


const getSkyConditionsDeclaration: FunctionDeclaration = {
  name: "get_sky_conditions",
  description:
    "Fetches real-time astronomical weather, cloud cover layers, seeing, transparency, moon phase/illumination, and 7-day night forecast for a city or location.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      city: {
        type: Type.STRING,
        description: "City, town, or observing area name (e.g., 'Tromsø', 'Teruel', 'La Palma', 'Madrid').",
      },
    },
    required: ["city"],
  },
};


async function executeGetLiveAuroraKp() {
  try {
    const res = await fetch(
      "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json",
      { signal: AbortSignal.timeout(5000) }
    );
    if (!res.ok) {
      return { error: `NOAA SWPC returned HTTP ${res.status}` };
    }
    const rows = (await res.json()) as any[];
    if (!Array.isArray(rows) || rows.length < 2) {
      return { error: "NOAA SWPC payload empty" };
    }
    const latest = rows[rows.length - 1];
    const timeTag = Array.isArray(latest) ? String(latest[0] || "") : String(latest?.time_tag || "");
    const kpRaw = Array.isArray(latest) ? Number(latest[1]) : Number(latest?.Kp);
    if (!Number.isFinite(kpRaw)) {
      return { error: "Invalid Kp reading" };
    }
    let activityLevel = "Quiet (high latitudes only: 65°+)";
    if (kpRaw >= 7) activityLevel = "Severe Geomagnetic Storm (visible even at mid-latitudes ~40°-45°)";
    else if (kpRaw >= 5) activityLevel = "Geomagnetic Storm (visible across northern Europe, UK, northern US, Tasmania, NZ South Island)";
    else if (kpRaw >= 4) activityLevel = "Active (Iceland, northern Scandinavia, Yellowknife, Fairbanks, Ushuaia)";
    else if (kpRaw >= 3) activityLevel = "Moderate (good inside the auroral oval: Tromsø, Abisko, Rovaniemi, Yellowknife)";

    return {
      kpIndex: Number(kpRaw.toFixed(2)),
      timeTagUTC: timeTag,
      activityLevel,
      source: "NOAA Space Weather Prediction Center (SWPC)",
    };
  } catch (err: any) {
    return { error: err?.message || "Failed to fetch NOAA Kp index" };
  }
}

async function executeGetSkyConditions(city: string, lang: SupportedLanguage) {
  try {
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        city
      )}&count=1&language=${lang}&format=json`,
      { signal: AbortSignal.timeout(5000) }
    );
    if (!geoRes.ok) {
      return { error: "Geocoding service unavailable" };
    }
    const geoJson = (await geoRes.json()) as any;
    const first = Array.isArray(geoJson?.results) ? geoJson.results[0] : null;
    if (!first) {
      return { error: `Location '${city}' not found` };
    }
    const lat = Number(first.latitude);
    const lng = Number(first.longitude);

    const [omRes, stRes] = await Promise.all([
      fetch(buildOpenMeteoForecastUrl(lat, lng), { signal: AbortSignal.timeout(6500) }),
      fetch(
        `https://www.7timer.info/bin/api.pl?lon=${lng.toFixed(3)}&lat=${lat.toFixed(
          3
        )}&product=astro&output=json`,
        { signal: AbortSignal.timeout(4000) }
      ).catch(() => null),
    ]);

    if (!omRes.ok) {
      return { error: "Weather forecast upstream unavailable" };
    }
    const omData = await omRes.json();
    let sevenTimerData: any = null;
    if (stRes && stRes.ok) {
      try {
        sevenTimerData = await stRes.json();
      } catch {
        sevenTimerData = null;
      }
    }

    const report = assembleReportFromRawApis({
      lat,
      lng,
      locationName: String(first.name || city),
      region: first.admin1 ? String(first.admin1) : "",
      country: first.country ? String(first.country) : "",
      elevationMeters: typeof first.elevation === "number" ? Math.round(first.elevation) : undefined,
      openMeteoData: omData,
      sevenTimerData,
    });

    return {
      location: `${report.locationName}${report.region ? `, ${report.region}` : ""}${report.country ? ` (${report.country})` : ""}`,
      coordinates: { lat: report.latitude, lng: report.longitude },
      condition: report.condition,
      temperatureC: report.temperatureC,
      humidityPct: report.humidityPct,
      windKmH: report.windKmH,
      cloudsPct: {
        total: report.totalCloudsPct,
        low: report.lowCloudsPct,
        mid: report.midCloudsPct,
        high: report.highCloudsPct,
      },
      seeingQuality: report.seeingQuality,
      seeingArcsec: report.seeingArcsec,
      transparency: report.transparencyLabel,
      moonPhase: report.moonPhaseName,
      moonIlluminationPct: report.moonIlluminationPct,
      bortleClass: report.bortleClass,
      sqm: report.sqm,
      tonightAndNext3Days: report.forecast7Days.slice(0, 4).map((d) => ({
        date: d.dateISO,
        condition: d.condition,
        nightCloudsPct: d.nightTotalCloudsPct,
        clearWindowHours: d.clearWindowHours,
        moonIlluminationPct: d.moonIlluminationPct,
      })),
    };
  } catch (err: any) {
    return { error: err?.message || "Failed to fetch sky conditions" };
  }
}

function executeSearchStellawayCatalog(query: string, category: string = "all") {
  const q = normalizeText(query);
  const tokens = q.split(/\s+/).filter((t) => t.length >= 2);
  const cat = normalizeText(category || "all");

  const scoreMatch = (text: string) => {
    const norm = normalizeText(text);
    if (q && norm.includes(q)) return 10;
    return tokens.reduce((acc, tok) => (norm.includes(tok) ? acc + 2 : acc), 0);
  };

  const results: Record<string, any[]> = {};

  if (cat === "all" || cat === "starlight") {
    results.starlightSpots = STARLIGHT_SPOTS.map((s) => ({
      item: s,
      score: scoreMatch(`${s.name} ${s.region} ${s.country || ""} ${s.description}`),
    }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ item: s }) => ({
        name: s.name,
        region: s.region,
        country: s.country || "España",
        bortleClass: s.bortleClass,
        sqm: s.sqm,
        elevationMeters: s.elevationMeters,
        bestSeason: s.bestSeason,
        certified: s.certified !== false,
        description: s.description.slice(0, 140),
      }));
  }

  if (cat === "all" || cat === "darksky") {
    results.darkSkyZones = DARKSKY_ZONES.map((z) => ({
      item: z,
      score: scoreMatch(`${z.name} ${z.region} ${z.country} ${z.continent} ${z.category} ${z.description}`),
    }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ item: z }) => ({
        name: z.name,
        category: z.category,
        region: z.region,
        country: z.country,
        bortleClass: z.bortleClass,
        sqm: z.sqm,
        bestSeason: z.bestSeason,
        description: z.description.slice(0, 140),
      }));
  }

  if (cat === "all" || cat === "auroras") {
    results.auroraSpots = AURORAS_DATA.map((a) => ({
      item: a,
      score: scoreMatch(
        `${a.name} ${a.region} ${a.country} ${a.continent} ${a.auroraType} ${a.frequencyLabel} ${a.description}`
      ),
    }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ item: a }) => ({
        name: a.name,
        auroraType: a.auroraType,
        country: a.country,
        region: a.region,
        frequency: a.frequencyLabel,
        bestSeason: a.bestSeason,
        orientation: a.orientation,
        bortle: a.bortle,
        description: a.description.slice(0, 140),
      }));
  }

  if (cat === "all" || cat === "events") {
    results.celestialEvents = CELESTIAL_EVENTS.map((e) => ({
      item: e,
      score: scoreMatch(`${e.title} ${e.categoryLabel} ${e.date} ${e.description} ${e.bestVisibilityZone}`),
    }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ item: e }) => ({
        title: e.title,
        category: e.categoryLabel,
        date: e.date,
        peakTime: e.peakTime,
        bestVisibilityZone: e.bestVisibilityZone,
        equipmentNeeded: e.equipmentNeeded,
        description: e.description.slice(0, 140),
      }));
  }

  return results;
}

function sanitizeConversationHistory(history: AssistantHistoryItem[]): Content[] {
  if (!Array.isArray(history)) return [];
  const cleaned: Content[] = [];

  for (const item of history) {
    if (!item || typeof item.content !== "string" || !item.content.trim()) continue;
    const role: "user" | "model" = item.role === "user" ? "user" : "model";
    // Skip any leading assistant/model greeting so Gemini history starts cleanly with a user turn
    if (cleaned.length === 0 && role === "model") continue;

    const prev = cleaned[cleaned.length - 1];
    if (prev && prev.role === role) {
      prev.parts = [...(prev.parts || []), { text: item.content.trim() }];
    } else {
      cleaned.push({ role, parts: [{ text: item.content.trim() }] });
    }
  }

  // Ensure the final entry in history isn't from 'user' right before our new user message
  while (cleaned.length > 0 && cleaned[cleaned.length - 1].role === "user") {
    cleaned.pop();
  }

  return cleaned;
}

export async function runStellaAssistant(params: {
  message: string;
  language?: string;
  conversationHistory?: AssistantHistoryItem[];
}): Promise<AssistantSuccessResult> {
  const lang = normalizeLanguage(params.language);
  const errs = ERROR_MESSAGES[lang];
  const candidateKeys = Array.from(
    new Set(
      [process.env.STELLA_API_KEY?.trim(), process.env.GEMINI_API_KEY?.trim()].filter(
        (k): k is string => Boolean(k && k.length > 0)
      )
    )
  );

  if (candidateKeys.length === 0) {
    throw new AssistantApiError(503, "GEMINI_API_KEY_MISSING", errs.missingKey);
  }

  const systemInstruction = `You are "Stella", the astronomical and astrotourism expert inside StellaWay.
CRITICAL LANGUAGE RULE: Reply strictly in ${LANG_NAMES[lang]} (language code: ${lang}).

BEHAVIOR RULES:
1. Answer the user's ACTUAL question directly, clearly, and accurately right in your first sentence.
   - Example: If asked whether a telescope is needed to see auroras, answer "No" immediately and explain that auroras span wide arcs across the sky and are best seen with the naked eye (needing darkness, clear skies, a clear polar horizon, and geomagnetic activity—plus optional wide-angle camera settings if they want photos).
   - Never hijack a question with unrelated topics just because a keyword like "telescope" appeared in the question.
2. NEVER introduce yourself as an AI or recite a list of StellaWay features unless the user specifically greets you or asks what you can do.
3. Answer ANY astronomy, astrophysics, stargazing, optics, astrophotography, space weather, eclipse, or astrotourism question thoroughly and naturally—even topics not stored in a static catalog.
4. Use your live tools proactively when relevant:
   - Use 'get_live_aurora_kp' if the user asks about current/tonight's aurora chances or Kp index.
   - Use 'get_sky_conditions' if the user asks about tonight's weather, clouds, seeing, or moon phase for a specific city/location.
   - Use 'search_stellaway_catalog' when recommending Starlight destinations, DarkSky parks, aurora viewing spots, or upcoming celestial events in the app.
   - Use 'googleSearch' for up-to-date astronomical news, comets, missions, or recent discoveries.
5. Keep formatting clean, scannable, and practical (short paragraphs or concise bullet points). Today's date is ${new Date().toISOString().slice(0, 10)}.`;

  const history = sanitizeConversationHistory(params.conversationHistory || []);
  const normMessage = normalizeText(params.message);

  // Pre-fetch live NOAA Kp (if aurora/Kp/solar related) and matching StellaWay catalog records in parallel
  const needsLiveKp =
    /aurora|aurore|boreal|austral|polarlicht|northern lights|southern lights|\bkp\b|geomagnet|solar|tormenta/.test(
      normMessage
    );

  const [liveKpData, catalogMatches] = await Promise.all([
    needsLiveKp ? executeGetLiveAuroraKp().catch(() => null) : Promise.resolve(null),
    Promise.resolve(executeSearchStellawayCatalog(params.message, "all")),
  ]);

  const contextSnippets: string[] = [];
  if (liveKpData && !("error" in liveKpData)) {
    contextSnippets.push(
      `LIVE NOAA SWPC AURORA DATA (fetched right now): Kp Index = ${liveKpData.kpIndex}, Time (UTC) = ${liveKpData.timeTagUTC}, Activity = ${liveKpData.activityLevel}.`
    );
  }
  const hasCatalogHits = Object.values(catalogMatches).some(
    (arr) => Array.isArray(arr) && arr.length > 0
  );
  if (hasCatalogHits) {
    contextSnippets.push(
      `MATCHING STELLAWAY CATALOG ENTRIES:\n${JSON.stringify(catalogMatches)}`
    );
  }

  const enrichedSystemInstruction =
    contextSnippets.length > 0
      ? `${systemInstruction}\n\nREAL-TIME APP CONTEXT (use these verified values when answering):\n${contextSnippets.join("\n")}`
      : systemInstruction;

  const executeWithKey = async (apiKey: string): Promise<AssistantSuccessResult> => {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });

    const contents: Content[] = [
      ...history,
      { role: "user", parts: [{ text: params.message.trim() }] },
    ];

    const toolsUsed = new Set<string>();
    if (liveKpData && !("error" in liveKpData)) {
      toolsUsed.add("get_live_aurora_kp");
    }
    if (hasCatalogHits) {
      toolsUsed.add("search_stellaway_catalog");
    }
    const sourcesMap = new Map<string, AssistantSource>();

    const weatherTools = [
      {
        functionDeclarations: [getSkyConditionsDeclaration],
      },
    ];

    const needsWeatherTool =
      /tiempo|clima|nubes|despejado|weather|clouds|forecast|meteo|wetter|tempo|nuvol|lluvia|rain|seeing|visibilidad|esta noche|tonight|hoy|today|manana|tomorrow/.test(
        normMessage
      );

    let activeModel = "gemini-4-hydrogen";

    const callGeminiFast = async (currentContents: Content[], allowWeatherTool: boolean) => {
      const config: any = {
        systemInstruction: enrichedSystemInstruction,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        ...(allowWeatherTool ? { tools: weatherTools } : {}),
      };

      const runWithTimeout = (modelName: string, cfg: any, ms = 12000) =>
        Promise.race([
          ai.models.generateContent({
            model: modelName,
            contents: currentContents,
            config: cfg,
          }),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("GEMINI_TIMEOUT")), ms)
          ),
        ]);

      try {
        return await runWithTimeout(activeModel, config, 12000);
      } catch (firstErr: any) {
        const status = Number(firstErr?.status || firstErr?.code || 0);
        const msg = String(firstErr?.message || "");
        const isRateLimit = status === 429 || msg.includes("RESOURCE_EXHAUSTED");

        if ((isRateLimit || msg === "GEMINI_TIMEOUT") && activeModel !== "gemini-3.1-flash-lite") {
          activeModel = "gemini-3.1-flash-lite";
          return await runWithTimeout(
            activeModel,
            {
              systemInstruction: enrichedSystemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
            15000
          );
        }

        if (allowWeatherTool && (status === 400 || msg === "GEMINI_TIMEOUT")) {
          return await runWithTimeout(
            activeModel,
            {
              systemInstruction: enrichedSystemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
            15000
          );
        }

        throw firstErr;
      }
    };

    let response = await callGeminiFast(contents, needsWeatherTool);

    const functionCalls = response.functionCalls;
    const previousContent = response.candidates?.[0]?.content;
    if (functionCalls && functionCalls.length > 0 && previousContent) {
      const responseParts: Part[] = [];
      for (const call of functionCalls) {
        if (call.name === "get_sky_conditions") {
          toolsUsed.add("get_sky_conditions");
          const args = (call.args || {}) as Record<string, any>;
          const result = await executeGetSkyConditions(String(args.city || ""), lang);
          responseParts.push({
            functionResponse: {
              ...(call.id ? { id: call.id } : {}),
              name: call.name,
              response: { result },
            },
          });
        }
      }

      if (responseParts.length > 0) {
        contents.push(previousContent);
        contents.push({ role: "user", parts: responseParts });
        response = await callGeminiFast(contents, true);
      }
    }

    const reply = response.text?.trim() || "";
    if (!reply) {
      throw new AssistantApiError(502, "EMPTY_RESPONSE", errs.upstreamError);
    }

    return {
      reply,
      language: lang,
      sources: Array.from(sourcesMap.values()).slice(0, 5),
      toolsUsed: Array.from(toolsUsed),
    };
  };

  let lastErr: any = null;
  for (const key of candidateKeys) {
    try {
      return await executeWithKey(key);
    } catch (err: any) {
      lastErr = err;
      const status = Number(err?.status || err?.code || 0);
      const msg = String(err?.message || "");
      const canRetryNextKey =
        status === 429 ||
        status === 401 ||
        status === 403 ||
        status === 400 ||
        msg.includes("RESOURCE_EXHAUSTED") ||
        msg.includes("API_KEY_INVALID") ||
        msg.includes("PERMISSION_DENIED");
      if (!canRetryNextKey) {
        break;
      }
    }
  }

  try {
    throw lastErr;
  } catch (err: any) {
    if (err instanceof AssistantApiError) {
      throw err;
    }

    const status = Number(err?.status || err?.code || 0);
    const msg = String(err?.message || "");
    const safeMsg = msg.replace(/AIza[0-9A-Za-z_-]+/g, "[REDACTED]").slice(0, 220);
    console.error("[StellaAssistantEngine] Gemini API error:", status, safeMsg);

    if (
      status === 400 &&
      (msg.includes("API_KEY_INVALID") || msg.toLowerCase().includes("api key"))
    ) {
      throw new AssistantApiError(400, "API_KEY_INVALID", errs.invalidKey);
    }
    if (status === 401 || status === 403 || msg.includes("PERMISSION_DENIED")) {
      throw new AssistantApiError(403, "PERMISSION_DENIED", errs.invalidKey);
    }
    if (status === 429 || msg.includes("RESOURCE_EXHAUSTED")) {
      throw new AssistantApiError(429, "RESOURCE_EXHAUSTED", errs.quotaExceeded);
    }

    throw new AssistantApiError(502, "GEMINI_UPSTREAM_ERROR", errs.upstreamError);
  }
}
