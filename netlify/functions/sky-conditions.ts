import type { Handler } from "@netlify/functions";
import { normalizeLanguage } from "../../src/lib/i18nHelpers";
import {
  assembleReportFromRawApis,
  buildOpenMeteoForecastUrl,
} from "../../src/lib/weatherService";

export const handler: Handler = async (event) => {
  try {
    const qs = event.queryStringParameters || {};
    const lang = normalizeLanguage(qs.lang);
    const rawLat = qs.lat !== undefined ? Number(qs.lat) : NaN;
    const rawLon = qs.lon !== undefined ? Number(qs.lon) : NaN;
    const cityQuery = typeof qs.city === "string" ? qs.city.trim() : "";

    let lat = rawLat;
    let lng = rawLon;
    let locationName = typeof qs.name === "string" ? qs.name.trim() : "";
    let region = typeof qs.region === "string" ? qs.region.trim() : "";
    let country = typeof qs.country === "string" ? qs.country.trim() : "";
    let elevationMeters: number | undefined;

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        return {
          statusCode: 400,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Invalid latitude or longitude range" }),
        };
      }
      if (!locationName) {
        locationName = `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
      }
    } else if (cityQuery) {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          cityQuery
        )}&count=1&language=${lang}&format=json`
      );
      if (!geoRes.ok) {
        return {
          statusCode: 502,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Geocoding upstream unavailable" }),
        };
      }
      const geoJson = (await geoRes.json()) as any;
      const first = Array.isArray(geoJson?.results) ? geoJson.results[0] : null;
      if (!first) {
        return {
          statusCode: 404,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Location not found" }),
        };
      }
      lat = Number(first.latitude);
      lng = Number(first.longitude);
      locationName = String(first.name || cityQuery);
      region = first.admin1 ? String(first.admin1) : "";
      country = first.country ? String(first.country) : "";
      elevationMeters = typeof first.elevation === "number" ? Math.round(first.elevation) : undefined;
    } else {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Provide valid lat/lon coordinates or city query" }),
      };
    }

    const [omRes, stRes] = await Promise.all([
      fetch(buildOpenMeteoForecastUrl(lat, lng), { signal: AbortSignal.timeout(8000) }),
      fetch(
        `https://www.7timer.info/bin/api.pl?lon=${lng.toFixed(3)}&lat=${lat.toFixed(
          3
        )}&product=astro&output=json`,
        { signal: AbortSignal.timeout(4500) }
      ).catch(() => null),
    ]);

    if (!omRes.ok) {
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Open-Meteo weather upstream unavailable" }),
      };
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
      locationName,
      region,
      country,
      elevationMeters,
      openMeteoData: omData,
      sevenTimerData,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(report),
    };
  } catch {
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to retrieve real-time sky conditions" }),
    };
  }
};
