import regionImagesConfig from '../data/regionImagesConfig.json';

export interface RegionImageInfo {
  pais: string;
  region: string;
  nombre_localizacion_principal: string;
  descripcion_imagen_generica: string;
  imagen_referencia: string;
  imageUrl: string;
}

// Normalize text for comparison
function norm(str?: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

const REGION_CONFIG: RegionImageInfo[] = regionImagesConfig.map((item) => ({
  ...item,
  imageUrl: `/images/regions/${item.imagen_referencia}`,
}));

/**
 * Resolves the representative image for a region, country, or state based on the JSON configuration.
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
  const isAurora =
    item.isAurora ||
    item.hemisphere !== undefined ||
    (item.category && norm(item.category).includes('aurora'));

  // 1. If it's an aurora, look for matching aurora-specific entries first
  if (isAurora) {
    const auroraEntries = REGION_CONFIG.filter(
      (e) => e.imagen_referencia.startsWith('aurora') || norm(e.nombre_localizacion_principal).includes('aurora')
    );

    // Check by region/name first among aurora entries
    for (const entry of auroraEntries) {
      const entryRegion = norm(entry.region);
      const entryLoc = norm(entry.nombre_localizacion_principal);
      if (
        (entryRegion && (itemRegion.includes(entryRegion) || entryRegion.includes(itemRegion))) ||
        (entryLoc && (itemName.includes(entryLoc) || entryLoc.includes(itemName) || itemRegion.includes(entryLoc)))
      ) {
        return entry;
      }
    }

    // Check by country among aurora entries
    for (const entry of auroraEntries) {
      const entryCountry = norm(entry.pais);
      if (entryCountry && itemCountry && (itemCountry.includes(entryCountry) || entryCountry.includes(itemCountry))) {
        return entry;
      }
    }
  }

  // 2. Exact match on region or state or principal location name
  for (const entry of REGION_CONFIG) {
    const entryRegion = norm(entry.region);
    const entryLoc = norm(entry.nombre_localizacion_principal);

    if (entryRegion && (itemRegion.includes(entryRegion) || entryRegion.includes(itemRegion))) {
      return entry;
    }
    if (itemState && entryRegion && (itemState.includes(entryRegion) || entryRegion.includes(itemState))) {
      return entry;
    }
    if (entryLoc && (itemName.includes(entryLoc) || entryLoc.includes(itemName) || itemRegion.includes(entryLoc))) {
      return entry;
    }
  }

  // 3. Specific match for Spain autonomous communities
  if (itemCountry.includes('espana')) {
    const spanishCommunities = [
      { key: 'andalucia', token: 'andalucia' },
      { key: 'aragon', token: 'aragon' },
      { key: 'canarias', token: 'canarias' },
      { key: 'castilla-la mancha', token: 'mancha' },
      { key: 'castilla y leon', token: 'leon' },
      { key: 'cataluna', token: 'catal' },
      { key: 'valencia', token: 'valenc' },
      { key: 'extremadura', token: 'extremadura' },
      { key: 'galicia', token: 'galicia' },
      { key: 'baleares', token: 'baleares' },
      { key: 'la rioja', token: 'rioja' },
      { key: 'navarra', token: 'navarra' },
    ];

    for (const comm of spanishCommunities) {
      if (itemRegion.includes(comm.token) || itemName.includes(comm.token)) {
        const found = REGION_CONFIG.find((c) => norm(c.pais).includes('espana') && norm(c.region).includes(comm.token));
        if (found) return found;
      }
    }
  }

  // 4. Match on country if region not found
  for (const entry of REGION_CONFIG) {
    const entryCountry = norm(entry.pais);
    if (entryCountry && itemCountry && (itemCountry.includes(entryCountry) || entryCountry.includes(itemCountry))) {
      return entry;
    }
  }

  // 5. Default fallback: first available entry
  return REGION_CONFIG[0] || null;
}

export { REGION_CONFIG };
