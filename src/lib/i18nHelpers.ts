export const SUPPORTED_LANGUAGES = ['es', 'en', 'fr', 'pt', 'it', 'de'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export function normalizeLanguage(lang?: unknown): SupportedLanguage {
  if (typeof lang === 'string') {
    const clean = lang.trim().toLowerCase().slice(0, 2);
    if ((SUPPORTED_LANGUAGES as readonly string[]).includes(clean)) {
      return clean as SupportedLanguage;
    }
  }
  return 'es';
}

export function getLocaleTag(lang: SupportedLanguage): string {
  switch (lang) {
    case 'en':
      return 'en-GB';
    case 'fr':
      return 'fr-FR';
    case 'pt':
      return 'pt-PT';
    case 'it':
      return 'it-IT';
    case 'de':
      return 'de-DE';
    case 'es':
    default:
      return 'es-ES';
  }
}

export function getStripeLocale(lang: SupportedLanguage): SupportedLanguage {
  return normalizeLanguage(lang);
}

export function withStripeLocale(url: string, lang: SupportedLanguage): string {
  const locale = getStripeLocale(lang);
  try {
    const parsed = new URL(url);
    parsed.searchParams.set('locale', locale);
    return parsed.toString();
  } catch {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}locale=${locale}`;
  }
}

export function getLocalizedPlanName(planId: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  const names: Record<SupportedLanguage, Record<string, string>> = {
    es: {
      free2days: 'Acceso Prueba Gratuita (48h)',
      mensual: 'StellaWay Pro Mensual',
      anual: 'StellaWay Anual VIP',
      promocion: 'Promoción Especial StellaWay',
      free: 'Plan Gratuito',
    },
    en: {
      free2days: 'Free Trial Access (48h)',
      mensual: 'StellaWay Pro Monthly',
      anual: 'StellaWay Annual VIP',
      promocion: 'StellaWay Special Offer',
      free: 'Free Plan',
    },
    fr: {
      free2days: 'Accès Essai Gratuit (48h)',
      mensual: 'StellaWay Pro Mensuel',
      anual: 'StellaWay Annuel VIP',
      promocion: 'Offre Spéciale StellaWay',
      free: 'Plan Gratuit',
    },
    pt: {
      free2days: 'Acesso Teste Gratuito (48h)',
      mensual: 'StellaWay Pro Mensal',
      anual: 'StellaWay Anual VIP',
      promocion: 'Promoção Especial StellaWay',
      free: 'Plano Gratuito',
    },
    it: {
      free2days: 'Accesso Prova Gratuita (48h)',
      mensual: 'StellaWay Pro Mensile',
      anual: 'StellaWay Annuale VIP',
      promocion: 'Offerta Speciale StellaWay',
      free: 'Piano Gratuito',
    },
    de: {
      free2days: 'Kostenloser Testzugang (48h)',
      mensual: 'StellaWay Pro Monatlich',
      anual: 'StellaWay Jahres-VIP',
      promocion: 'StellaWay Sonderangebot',
      free: 'Kostenloser Plan',
    },
  };
  return names[l][planId] || names[l].mensual;
}

export function translateSeeingQuality(value: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  const key = value.trim().toLowerCase();
  const map: Record<string, Record<SupportedLanguage, string>> = {
    excelente: {
      es: 'Excelente',
      en: 'Excellent',
      fr: 'Excellent',
      pt: 'Excelente',
      it: 'Eccellente',
      de: 'Ausgezeichnet',
    },
    bueno: {
      es: 'Bueno',
      en: 'Good',
      fr: 'Bon',
      pt: 'Bom',
      it: 'Buono',
      de: 'Gut',
    },
    regular: {
      es: 'Regular',
      en: 'Fair',
      fr: 'Moyen',
      pt: 'Regular',
      it: 'Discreto',
      de: 'Mäßig',
    },
    malo: {
      es: 'Malo',
      en: 'Poor',
      fr: 'Mauvais',
      pt: 'Fraco',
      it: 'Scarso',
      de: 'Schlecht',
    },
  };
  return map[key]?.[l] || value;
}

export function translateMoonPhase(value: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  const key = value.trim().toLowerCase();
  const map: Record<string, Record<SupportedLanguage, string>> = {
    'luna nueva': {
      es: 'Luna Nueva',
      en: 'New Moon',
      fr: 'Nouvelle Lune',
      pt: 'Lua Nova',
      it: 'Luna Nuova',
      de: 'Neumond',
    },
    'luna creciente': {
      es: 'Luna Creciente',
      en: 'Waxing Crescent',
      fr: 'Premier Croissant',
      pt: 'Lua Crescente',
      it: 'Luna Crescente',
      de: 'Zunehmender Sichelmond',
    },
    'cuarto creciente': {
      es: 'Cuarto Creciente',
      en: 'First Quarter',
      fr: 'Premier Quartier',
      pt: 'Quarto Crescente',
      it: 'Primo Quarto',
      de: 'Erstes Viertel',
    },
    'luna llena': {
      es: 'Luna Llena',
      en: 'Full Moon',
      fr: 'Pleine Lune',
      pt: 'Lua Cheia',
      it: 'Luna Piena',
      de: 'Vollmond',
    },
    'cuarto menguante': {
      es: 'Cuarto Menguante',
      en: 'Last Quarter',
      fr: 'Dernier Quartier',
      pt: 'Quarto Minguante',
      it: 'Ultimo Quarto',
      de: 'Letztes Viertel',
    },
    'luna menguante': {
      es: 'Luna Menguante',
      en: 'Waning Crescent',
      fr: 'Dernier Croissant',
      pt: 'Lua Minguante',
      it: 'Luna Calante',
      de: 'Abnehmender Sichelmond',
    },
    'gibosa creciente': {
      es: 'Gibosa Creciente',
      en: 'Waxing Gibbous',
      fr: 'Gibbeuse Croissante',
      pt: 'Gibosa Crescente',
      it: 'Gibbosa Crescente',
      de: 'Zunehmender Dreiviertelmond',
    },
    'gibosa menguante': {
      es: 'Gibosa Menguante',
      en: 'Waning Gibbous',
      fr: 'Gibbeuse Décroissante',
      pt: 'Gibosa Minguante',
      it: 'Gibbosa Calante',
      de: 'Abnehmender Dreiviertelmond',
    },
  };
  return map[key]?.[l] || value;
}

export function translateWeatherCondition(value: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  const key = value.trim().toLowerCase();
  const map: Record<string, Record<SupportedLanguage, string>> = {
    clear: { es: 'Despejado', en: 'Clear', fr: 'Dégagé', pt: 'Céu Limpo', it: 'Sereno', de: 'Klar' },
    rain: { es: 'Lluvia', en: 'Rain', fr: 'Pluie', pt: 'Chuva', it: 'Pioggia', de: 'Regen' },
    snow: { es: 'Nieve', en: 'Snow', fr: 'Neige', pt: 'Neve', it: 'Neve', de: 'Schnee' },
    wind: { es: 'Viento', en: 'Wind', fr: 'Vent', pt: 'Vento', it: 'Vento', de: 'Wind' },
    clouds: { es: 'Nublado', en: 'Cloudy', fr: 'Nuageux', pt: 'Nublado', it: 'Nuvoloso', de: 'Bewölkt' },
    cloudy: { es: 'Nublado', en: 'Cloudy', fr: 'Nuageux', pt: 'Nublado', it: 'Nuvoloso', de: 'Bewölkt' },
    storm: { es: 'Tormenta', en: 'Storm', fr: 'Orage', pt: 'Tempestade', it: 'Temporale', de: 'Sturm' },
  };
  return map[key]?.[l] || value;
}

export function translateElement(value: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  const key = value.trim().toLowerCase();
  const map: Record<string, Record<SupportedLanguage, string>> = {
    agua: { es: 'Agua', en: 'Water', fr: 'Eau', pt: 'Água', it: 'Acqua', de: 'Wasser' },
    aire: { es: 'Aire', en: 'Air', fr: 'Air', pt: 'Ar', it: 'Aria', de: 'Luft' },
    fuego: { es: 'Fuego', en: 'Fire', fr: 'Feu', pt: 'Fogo', it: 'Fuoco', de: 'Feuer' },
    tierra: { es: 'Tierra', en: 'Earth', fr: 'Terre', pt: 'Terra', it: 'Terra', de: 'Erde' },
  };
  return map[key]?.[l] || value;
}

export function translateEventCategory(value: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  const key = value.trim().toLowerCase();
  const map: Record<string, Record<SupportedLanguage, string>> = {
    eclipse: { es: 'Eclipse', en: 'Eclipse', fr: 'Éclipse', pt: 'Eclipse', it: 'Eclissi', de: 'Finsternis' },
    'eclipse solar total': {
      es: 'Eclipse Solar Total',
      en: 'Total Solar Eclipse',
      fr: 'Éclipse Solaire Totale',
      pt: 'Eclipse Solar Total',
      it: 'Eclissi Solare Totale',
      de: 'Totale Sonnenfinsternis',
    },
    'eclipse solar total del siglo': {
      es: 'Eclipse Solar Total del Siglo',
      en: 'Total Solar Eclipse of the Century',
      fr: 'Éclipse Solaire Totale du Siècle',
      pt: 'Eclipse Solar Total do Século',
      it: 'Eclissi Solare Totale del Secolo',
      de: 'Totale Sonnenfinsternis des Jahrhunderts',
    },
    'lluvia de meteoros': {
      es: 'Lluvia de Meteoros',
      en: 'Meteor Shower',
      fr: 'Pluie de Météores',
      pt: 'Chuva de Meteoros',
      it: 'Sciame Meteorico',
      de: 'Meteorstrom',
    },
    'tránsito / ocultación': {
      es: 'Tránsito / Ocultación',
      en: 'Transit / Occultation',
      fr: 'Transit / Occultation',
      pt: 'Trânsito / Ocultação',
      it: 'Transito / Occultazione',
      de: 'Transit / Bedeckung',
    },
    'visualización de planetas': {
      es: 'Visualización de Planetas',
      en: 'Planet Viewing',
      fr: 'Observation des Planètes',
      pt: 'Observação de Planetas',
      it: 'Osservazione Pianeti',
      de: 'Planetenbeobachtung',
    },
    'conjunción planetaria': {
      es: 'Conjunción Planetaria',
      en: 'Planetary Conjunction',
      fr: 'Conjonction Planétaire',
      pt: 'Conjunção Planetária',
      it: 'Congiunzione Planetaria',
      de: 'Planetenkonjunktion',
    },
    'planetas en oposición': {
      es: 'Planetas en Oposición',
      en: 'Planets in Opposition',
      fr: 'Planètes en Opposition',
      pt: 'Planetas em Oposição',
      it: 'Pianeti in Opposizione',
      de: 'Planeten in Opposition',
    },
    'alineación planetaria': {
      es: 'Alineación Planetaria',
      en: 'Planetary Alignment',
      fr: 'Alignement Planétaire',
      pt: 'Alinhamento Planetário',
      it: 'Allineamento Planetario',
      de: 'Planetenausrichtung',
    },
    'fases lunares': {
      es: 'Fases Lunares',
      en: 'Lunar Phases',
      fr: 'Phases Lunaires',
      pt: 'Fases da Lua',
      it: 'Fasi Lunari',
      de: 'Mondphasen',
    },
    'fase lunar & cielo profundo': {
      es: 'Fase Lunar & Cielo Profundo',
      en: 'Lunar Phase & Deep Sky',
      fr: 'Phase Lunaire & Ciel Profond',
      pt: 'Fase Lunar & Céu Profundo',
      it: 'Fase Lunare & Profondo Cielo',
      de: 'Mondphase & Deep Sky',
    },
    superluna: {
      es: 'Superluna',
      en: 'Supermoon',
      fr: 'Super Lune',
      pt: 'Superlua',
      it: 'Superluna',
      de: 'Supermond',
    },
    'solsticio & efemérides': {
      es: 'Solsticio & Efemérides',
      en: 'Solstice & Ephemeris',
      fr: 'Solstice & Éphémérides',
      pt: 'Solstício & Efemérides',
      it: 'Solstizio & Effemeridi',
      de: 'Sonnenwende & Ephemeriden',
    },
  };
  return map[key]?.[l] || value;
}

export function formatCountdownLabel(diffDays: number, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  if (diffDays < 0) {
    return {
      es: 'Finalizado',
      en: 'Ended',
      fr: 'Terminé',
      pt: 'Encerrado',
      it: 'Concluso',
      de: 'Beendet',
    }[l];
  }
  if (diffDays === 0) {
    return {
      es: '¡HOY!',
      en: 'TODAY!',
      fr: "AUJOURD'HUI !",
      pt: 'HOJE!',
      it: 'OGGI!',
      de: 'HEUTE!',
    }[l];
  }
  if (diffDays === 1) {
    return {
      es: 'Mañana',
      en: 'Tomorrow',
      fr: 'Demain',
      pt: 'Amanhã',
      it: 'Domani',
      de: 'Morgen',
    }[l];
  }
  return {
    es: `En ${diffDays} días`,
    en: `In ${diffDays} days`,
    fr: `Dans ${diffDays} jours`,
    pt: `Em ${diffDays} dias`,
    it: `Tra ${diffDays} giorni`,
    de: `In ${diffDays} Tagen`,
  }[l];
}
