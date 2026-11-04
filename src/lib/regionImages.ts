import regionImagesConfig from '../data/regionImagesConfig.json';

export interface RegionImageInfo {
  pais: string;
  region: string;
  nombre_localizacion_principal: string;
  descripcion_imagen_generica: string;
  imagen_referencia: string;
  imageUrl: string;
}

// Normalize text for comparison (lowercase, accent-free, trimmed)
function norm(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

const REGION_CONFIG: RegionImageInfo[] = (regionImagesConfig as any[]).map((item) => ({
  ...item,
  imageUrl: `/images/regions/${item.imagen_referencia}`,
}));

/**
 * Resolves the representative image for a region, country, or location based on the JSON configuration.
 * Accurately routes to Chile, Argentina, Spain, Portugal, USA, etc. without falling back to Andalucía.
 */
export function getRegionImage(item: {
  country?: string;
  region?: string;
  state?: string;
  name?: string;
  category?: string;
  hemisphere?: string;
  isAurora?: boolean;
}): RegionImageInfo | null {
  const itemCountry = norm(item.country);
  const itemRegion = norm(item.region);
  const itemState = norm(item.state);
  const itemName = norm(item.name);
  const combined = `${itemCountry} ${itemRegion} ${itemState} ${itemName}`.trim();

  const isAurora =
    Boolean(item.isAurora) ||
    item.hemisphere !== undefined ||
    (item.category !== undefined && norm(item.category).includes('aurora'));

  // 1. Detect Effective Country from explicit country or text mentions
  let effectiveCountry = itemCountry && itemCountry !== 'todos' ? itemCountry : '';
  if (!effectiveCountry) {
    if (
      combined.includes('chile') ||
      combined.includes('atacama') ||
      combined.includes('paranal') ||
      combined.includes('fray jorge') ||
      combined.includes('llanos de challes') ||
      combined.includes('elqui') ||
      combined.includes('antofagasta') ||
      combined.includes('coquimbo')
    ) {
      effectiveCountry = 'chile';
    } else if (
      combined.includes('argentina') ||
      combined.includes('mendoza') ||
      combined.includes('villavicencio') ||
      combined.includes('leoncito') ||
      combined.includes('san juan') ||
      combined.includes('barreal') ||
      combined.includes('calingasta') ||
      combined.includes('tierra del fuego') ||
      combined.includes('ushuaia')
    ) {
      effectiveCountry = 'argentina';
    } else if (combined.includes('colombia') || combined.includes('tatacoa') || combined.includes('villa de leyva')) {
      effectiveCountry = 'colombia';
    } else if (
      combined.includes('mexico') ||
      combined.includes('san pedro martir') ||
      combined.includes('espiritu santo') ||
      combined.includes('joya-la barreta') ||
      combined.includes('queretaro')
    ) {
      effectiveCountry = 'mexico';
    } else if (combined.includes('peru') || combined.includes('colca')) {
      effectiveCountry = 'peru';
    } else if (combined.includes('bolivia') || combined.includes('uyuni')) {
      effectiveCountry = 'bolivia';
    } else if (combined.includes('brasil') || combined.includes('desengano') || combined.includes('rio de janeiro')) {
      effectiveCountry = 'brasil';
    } else if (
      combined.includes('portugal') ||
      combined.includes('alqueva') ||
      combined.includes('xisto') ||
      combined.includes('tua') ||
      combined.includes('geres')
    ) {
      effectiveCountry = 'portugal';
    } else if (combined.includes('andorra') || combined.includes('sorteny') || combined.includes('ordino') || combined.includes('comapedrosa')) {
      effectiveCountry = 'andorra';
    } else if (
      combined.includes('francia') ||
      combined.includes('france') ||
      combined.includes('pic du midi') ||
      combined.includes('cevennes') ||
      combined.includes('millevaches') ||
      combined.includes('vercors')
    ) {
      effectiveCountry = 'francia';
    } else if (
      combined.includes('estados unidos') ||
      combined.includes('eeuu') ||
      combined.includes('usa') ||
      combined.includes('united states') ||
      combined.includes('grand canyon') ||
      combined.includes('death valley') ||
      combined.includes('arches') ||
      combined.includes('bryce') ||
      combined.includes('cherry springs') ||
      combined.includes('glacier')
    ) {
      effectiveCountry = 'estados unidos';
    } else if (
      combined.includes('canada') ||
      combined.includes('jasper') ||
      combined.includes('wood buffalo') ||
      combined.includes('mont-megantic') ||
      combined.includes('trout point')
    ) {
      effectiveCountry = 'canada';
    } else if (
      combined.includes('nueva zelanda') ||
      combined.includes('new zealand') ||
      combined.includes('aoraki') ||
      combined.includes('tekapo') ||
      combined.includes('rakiura') ||
      combined.includes('mackenzie')
    ) {
      effectiveCountry = 'nueva zelanda';
    } else if (
      combined.includes('australia') ||
      combined.includes('warrumbungle') ||
      combined.includes('cradle mountain') ||
      combined.includes('tasmania')
    ) {
      effectiveCountry = 'australia';
    } else if (combined.includes('japon') || combined.includes('japan') || combined.includes('bisei')) {
      effectiveCountry = 'japon';
    } else if (combined.includes('china') || combined.includes('huanglong') || combined.includes('xichong')) {
      effectiveCountry = 'china';
    } else if (combined.includes('rusia') || combined.includes('russia') || combined.includes('murmansk')) {
      effectiveCountry = 'rusia';
    } else if (
      combined.includes('espana') ||
      combined.includes('spain') ||
      combined.includes('andalucia') ||
      combined.includes('aragon') ||
      combined.includes('zaragoza') ||
      combined.includes('teruel') ||
      combined.includes('canarias') ||
      combined.includes('teide') ||
      combined.includes('la palma') ||
      combined.includes('galicia') ||
      combined.includes('cataluna') ||
      combined.includes('montsec') ||
      combined.includes('culla') ||
      combined.includes('cuenca') ||
      combined.includes('gudar') ||
      combined.includes('monfrague') ||
      combined.includes('gredos')
    ) {
      effectiveCountry = 'espana';
    }
  }

  // 2. Aurora Specific Resolution
  if (isAurora) {
    // Direct matches for special aurora territories
    if (combined.includes('georgia') || combined.includes('georgias')) {
      const g = REGION_CONFIG.find((e) => e.imagen_referencia.includes('georgias'));
      if (g) return g;
    }
    if (combined.includes('malvina') || combined.includes('falkland')) {
      const m = REGION_CONFIG.find((e) => e.imagen_referencia.includes('malvinas'));
      if (m) return m;
    }
    if (combined.includes('rusia') || combined.includes('murmansk') || combined.includes('kola') || combined.includes('siberia')) {
      const r = REGION_CONFIG.find((e) => e.imagen_referencia.includes('murmansk'));
      if (r) return r;
    }
    if (combined.includes('antartida') || combined.includes('ohiggins') || combined.includes('antart')) {
      const ant = REGION_CONFIG.find((e) => e.imagen_referencia.includes('antartida'));
      if (ant) return ant;
    }
    if (combined.includes('chile') || combined.includes('patagonia') || combined.includes('punta arenas')) {
      const ch = REGION_CONFIG.find((e) => e.imagen_referencia.includes('chile_patagonia'));
      if (ch) return ch;
    }
    if (combined.includes('argentina') || combined.includes('ushuaia') || combined.includes('tierra del fuego')) {
      const ar = REGION_CONFIG.find((e) => e.imagen_referencia.includes('argentina_tierradelfuego'));
      if (ar) return ar;
    }
    if (combined.includes('australia') || combined.includes('tasmania') || combined.includes('hobart')) {
      const au = REGION_CONFIG.find((e) => e.imagen_referencia.includes('australia_tasmania'));
      if (au) return au;
    }
    if (combined.includes('nueva zelanda') || combined.includes('rakiura') || combined.includes('stewart')) {
      const nz = REGION_CONFIG.find((e) => e.imagen_referencia.includes('nuevazelanda'));
      if (nz) return nz;
    }
    if (combined.includes('suecia') || combined.includes('abisko') || combined.includes('kiruna')) {
      const se = REGION_CONFIG.find((e) => e.imagen_referencia.includes('abisko'));
      if (se) return se;
    }
    if (combined.includes('finlandia') || combined.includes('laponia') || combined.includes('rovaniemi') || combined.includes('inari')) {
      const fi = REGION_CONFIG.find((e) => e.imagen_referencia.includes('finlandia'));
      if (fi) return fi;
    }
    if (combined.includes('islandia') || combined.includes('reykjavik') || combined.includes('groenlandia') || combined.includes('greenland')) {
      const is = REGION_CONFIG.find((e) => e.imagen_referencia.includes('islandia'));
      if (is) return is;
    }
    if (combined.includes('canada') || combined.includes('yellowknife') || combined.includes('yukon') || combined.includes('churchill')) {
      const ca = REGION_CONFIG.find((e) => e.imagen_referencia.includes('yellowknife'));
      if (ca) return ca;
    }
    if (combined.includes('alaska') || combined.includes('fairbanks') || combined.includes('estados unidos') || combined.includes('eeuu')) {
      const us = REGION_CONFIG.find((e) => e.imagen_referencia.includes('alaska'));
      if (us) return us;
    }
    if (combined.includes('noruega') || combined.includes('tromso') || combined.includes('alta') || combined.includes('lofot') || combined.includes('senja') || combined.includes('svalbard')) {
      const no = REGION_CONFIG.find((e) => e.imagen_referencia.includes('noruega_tromso'));
      if (no) return no;
    }

    const auroraEntries = REGION_CONFIG.filter(
      (e) => e.imagen_referencia.startsWith('aurora') || norm(e.nombre_localizacion_principal).includes('aurora')
    );

    if (effectiveCountry) {
      const match = auroraEntries.find(
        (e) => norm(e.pais).includes(effectiveCountry) || effectiveCountry.includes(norm(e.pais))
      );
      if (match) return match;
    }

    // Default northern or southern aurora fallback
    if (item.hemisphere === 'sur' || combined.includes('austral') || combined.includes('sur')) {
      const southMatch = auroraEntries.find((e) => e.imagen_referencia.includes('austral'));
      if (southMatch) return southMatch;
    }

    const northMatch = auroraEntries.find((e) => e.imagen_referencia.includes('tromso') || e.imagen_referencia.includes('islandia'));
    if (northMatch) return northMatch;
    if (auroraEntries.length > 0) return auroraEntries[0];
  }

  // 3. Country-Scoped Matching (Targeted to Country first)
  if (effectiveCountry) {
    const countryEntries = REGION_CONFIG.filter((e) => {
      const p = norm(e.pais);
      return p && (p.includes(effectiveCountry) || effectiveCountry.includes(p));
    });

    if (countryEntries.length > 0) {
      // Special regional mappings for Chile
      if (effectiveCountry === 'chile') {
        if (combined.includes('paranal') || combined.includes('antofagasta') || combined.includes('valle de la luna') || combined.includes('desierto de atacama') || combined.includes('san pedro')) {
          const paranal = countryEntries.find((c) => c.imagen_referencia.includes('paranal'));
          if (paranal) return paranal;
        }
        if (combined.includes('fray jorge') || combined.includes('coquimbo') || combined.includes('elqui') || combined.includes('tololo')) {
          const fray = countryEntries.find((c) => c.imagen_referencia.includes('frayjorge'));
          if (fray) return fray;
        }
        if (combined.includes('llanos de challes') || combined.includes('challes')) {
          const challes = countryEntries.find((c) => c.imagen_referencia.includes('llanoschalles'));
          if (challes) return challes;
        }
      }

      // Special regional mappings for Argentina
      if (effectiveCountry === 'argentina') {
        if (combined.includes('tierra del fuego') || combined.includes('ushuaia') || combined.includes('austral')) {
          const tdf = countryEntries.find((c) => c.imagen_referencia.includes('tierradelfuego'));
          if (tdf) return tdf;
        }
        if (combined.includes('villavicencio') || combined.includes('mendoza') || combined.includes('leoncito') || combined.includes('san juan') || combined.includes('barreal')) {
          const villa = countryEntries.find((c) => c.imagen_referencia.includes('villavicencio'));
          if (villa) return villa;
        }
      }

      // Meaningful query tokens (minimum 3 chars to prevent false substring matches)
      const queryTokens = [itemRegion, itemState, itemName].filter((t) => Boolean(t && t.length >= 3));

      // Try exact or partial matches within the selected country's regions/locations
      for (const token of queryTokens) {
        const found = countryEntries.find((e) => {
          const r = norm(e.region);
          const l = norm(e.nombre_localizacion_principal);
          return (r && (r.includes(token) || token.includes(r))) || (l && (l.includes(token) || token.includes(l)));
        });
        if (found) return found;
      }

      // If country is España, check autonomous community mapping
      if (effectiveCountry === 'espana') {
        const spanishCommunities = [
          { token: 'andalucia', key: 'andalucia' },
          { token: 'aragon', key: 'aragon' },
          { token: 'zaragoza', key: 'aragon' },
          { token: 'teruel', key: 'aragon' },
          { token: 'huesca', key: 'aragon' },
          { token: 'canarias', key: 'canarias' },
          { token: 'teide', key: 'canarias' },
          { token: 'palma', key: 'canarias' },
          { token: 'tenerife', key: 'canarias' },
          { token: 'mancha', key: 'castilla-la mancha' },
          { token: 'cuenca', key: 'castilla-la mancha' },
          { token: 'leon', key: 'castilla y leon' },
          { token: 'gredos', key: 'castilla y leon' },
          { token: 'catal', key: 'cataluna' },
          { token: 'montsec', key: 'cataluna' },
          { token: 'valenc', key: 'valencia' },
          { token: 'culla', key: 'valencia' },
          { token: 'extremadura', key: 'extremadura' },
          { token: 'monfrague', key: 'extremadura' },
          { token: 'galicia', key: 'galicia' },
          { token: 'cies', key: 'galicia' },
          { token: 'trevinca', key: 'galicia' },
          { token: 'baleares', key: 'baleares' },
          { token: 'menorca', key: 'baleares' },
          { token: 'rioja', key: 'la rioja' },
          { token: 'navarra', key: 'navarra' },
        ];

        for (const comm of spanishCommunities) {
          if (combined.includes(comm.token)) {
            const found = countryEntries.find((c) => norm(c.region).includes(comm.key));
            if (found) return found;
          }
        }
      }

      // Default to the first (and most prominent) representative image for that country
      return countryEntries[0];
    }
  }

  // 4. Global match on specific region, state, or location name if country wasn't detected
  const tokens = [itemRegion, itemState, itemName].filter((t) => Boolean(t && t.length >= 3));
  for (const token of tokens) {
    const found = REGION_CONFIG.find((entry) => {
      const r = norm(entry.region);
      const l = norm(entry.nombre_localizacion_principal);
      return (r && (r.includes(token) || token.includes(r))) || (l && (l.includes(token) || token.includes(l)));
    });
    if (found) return found;
  }

  // 5. Default Fallbacks by category
  if (item.category && norm(item.category).includes('darksky')) {
    const darkSkyDefault = REGION_CONFIG.find((e) => e.imagen_referencia.includes('deathvalley') || e.imagen_referencia.includes('paranal'));
    if (darkSkyDefault) return darkSkyDefault;
  }

  // Overall default
  return REGION_CONFIG[0] || null;
}

export { REGION_CONFIG };
