import type { Handler } from "@netlify/functions";

export const handler: Handler = async (_event, _context) => {
  const data = {
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
      summary:
        "Momento de introspección y calma. Ideal para observación profunda de cielo profundo.",
      visibility:
        "Visibilidad excelente a partir de las 22:30h en dirección Sudeste.",
    },
    eclipse2026Date: "2026-08-12T19:30:00Z",
  };

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
};
