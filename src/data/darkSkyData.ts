export interface DarkSkyZone {
  id: string;
  name: string;
  category: 'International Dark Sky Sanctuary' | 'International Dark Sky Park' | 'International Dark Sky Reserve' | 'Urban Night Sky Place' | 'Dark Sky Community';
  categoryLabel: string;
  country: string;
  continent: 'Europa' | 'América del Norte' | 'América del Sur' | 'África' | 'Asia' | 'Oceanía';
  region: string;
  bortleClass: number; // 1-3
  sqm: number;
  designationYear: number;
  areaKm2?: number;
  latitude: number;
  longitude: number;
  description: string;
  highlights: string[];
  keyObservingSites: string[];
  bestSeason: string;
  officialUrl?: string;
  imageUrl: string;
  featured?: boolean;
}

export const DARKSKY_ZONES: DarkSkyZone[] = [
  // ══════════════════════════════════════════════════════════════
  // 🇪🇺 EUROPA
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ds-aiguamolls',
    name: 'Parque Natural dels Aiguamolls de l\'Empordà',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'España',
    continent: 'Europa',
    region: 'Girona (Cataluña)',
    bortleClass: 3,
    sqm: 21.65,
    designationYear: 2022,
    areaKm2: 48,
    latitude: 42.2289,
    longitude: 3.1072,
    description: 'Humedal de renombre mundial reconocido por DarkSky International por su estricto plan de reducción y apantallamiento de iluminación costera, preservando tanto la biodiversidad de aves migratorias como el cielo nocturno.',
    highlights: [
      'Primer Parque de Cielo Oscuro certificado en Cataluña',
      'Refugio ornitológico con más de 300 especies de aves nocturnas',
      'Ordenanza pionera de protección contra el resplandor de la Costa Brava'
    ],
    keyObservingSites: [
      'Mirador del Cortalet (Observatorio Central)',
      'Torre Senillosa (Panorámica 360°)',
      'Itinerario de la Ribereta'
    ],
    bestSeason: 'Otoño - Invierno - Primavera',
    officialUrl: 'https://darksky.org/places/aiguamolls-de-lemporda-natural-park/',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-albanya',
    name: 'Parc d\'Albanyà & Alt Empordà',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'España',
    continent: 'Europa',
    region: 'Pirineo de Girona (Cataluña)',
    bortleClass: 2,
    sqm: 21.82,
    designationYear: 2017,
    areaKm2: 94,
    latitude: 42.3045,
    longitude: 2.7208,
    description: 'Primer enclave de la Península Ibérica en recibir el estatus Dark Sky Park por la IDA. Cuenta con un observatorio astronómico automatizado de última generación en el valle protegido del río Muga.',
    highlights: [
      'Primer Parque Dark Sky certificado en España por la IDA',
      'Observatorio Astronómico de Albanyà con telescopio de 400 mm',
      'Valle prepirenaico aislado de cualquier contaminación lumínica urbana'
    ],
    keyObservingSites: [
      'Observatori Astronòmic d\'Albanyà',
      'Bassegoda Park Astro-Camp',
      'Mirador del Santuario de la Mare de Déu del Mont'
    ],
    bestSeason: 'Primavera - Verano - Otoño',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-aras-olmos',
    name: 'Aras de los Olmos & Alto Turia',
    category: 'Dark Sky Community',
    categoryLabel: 'Comunidad Internacional de Cielo Oscuro',
    country: 'España',
    continent: 'Europa',
    region: 'Valencia / Serranía de Cuenca',
    bortleClass: 2,
    sqm: 21.78,
    designationYear: 2021,
    areaKm2: 160,
    latitude: 39.9272,
    longitude: -1.1342,
    description: 'Comunidad astronómica de referencia en España. Municipio que ha adaptado el 100% de su iluminación pública y alberga múltiples observatorios profesionales y amateurs a más de 1.300 metros de altitud.',
    highlights: [
      'Albergue de los observatorios de la Universidad de Valencia',
      'Ordenanza municipal ejemplar contra la dispersión lumínica',
      'Cielo transparente con baja humedad y excelente seeing'
    ],
    keyObservingSites: [
      'Observatorio de La Cambra',
      'Centro Astronómico del Alto Turia (CAAT)',
      'Mirador del Muela de Santa Catalina'
    ],
    bestSeason: 'Todo el año',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-alqueva',
    name: 'Dark Sky Alqueva (Transfronterizo España - Portugal)',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Portugal / España',
    continent: 'Europa',
    region: 'Alentejo & Extremadura',
    bortleClass: 1,
    sqm: 21.94,
    designationYear: 2011,
    areaKm2: 3000,
    latitude: 38.4167,
    longitude: -7.5333,
    description: 'El primer enclave del mundo en obtener la doble certificación Starlight y DarkSky International. Un área de 3.000 km² alrededor del gran lago de Alqueva con más de 286 noches despejadas al año y nula contaminación lumínica.',
    highlights: [
      'Primera Reserva de Cielo Oscuro transfronteriza del mundo',
      'Atmósfera con un promedio de 286 noches despejadas anuales',
      'Observaciones en catamarán silencioso en aguas del embalse'
    ],
    keyObservingSites: [
      'Observatório Oficial Dark Sky Alqueva (Cumeada)',
      'Castelo de Monsaraz',
      'Margen fronteriza de Cheles y Olivenza (Badajoz)'
    ],
    bestSeason: 'Todo el año',
    officialUrl: 'https://darksky.org/places/alqueva-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-aldeia-ruivas',
    name: 'Aldeia das Ruivas (Vale do Tua)',
    category: 'Dark Sky Community',
    categoryLabel: 'Comunidad Internacional de Cielo Oscuro',
    country: 'Portugal',
    continent: 'Europa',
    region: 'Trás-os-Montes',
    bortleClass: 2,
    sqm: 21.80,
    designationYear: 2023,
    areaKm2: 12,
    latitude: 41.3524,
    longitude: -7.2185,
    description: 'Comunidad rural modelo en la cuenca del Duero portugués que reconvirtió el 100% de su alumbrado público a tecnología ámbar de corte total (0% de emisión superior), convirtiéndose en faro de conservación europea.',
    highlights: [
      'Iluminación pública 100% ecológica ámbar monocromática',
      'Punto de encuentro para astrofotógrafos de la Península',
      'Rutas guiadas por los viñedos y cañones del río Tua'
    ],
    keyObservingSites: [
      'Miradouro da Senhora da Assunção',
      'Centro Comunitário das Ruivas',
      'Margens do Rio Tua'
    ],
    bestSeason: 'Primavera y Verano',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-pic-du-midi',
    name: 'Pic du Midi de Bigorre Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Francia',
    continent: 'Europa',
    region: 'Hautes-Pyrénées (Occitania)',
    bortleClass: 2,
    sqm: 21.88,
    designationYear: 2013,
    areaKm2: 3112,
    latitude: 42.9369,
    longitude: 0.1411,
    description: 'Una de las reservas astronómicas más legendarias del planeta. Situada en la alta montaña pirenaica francesa a 2.877 m de altitud, con 3.112 km² de territorio protegido que limitan al sur con el Parque Nacional de Ordesa y Monte Perdido en España.',
    highlights: [
      'Observatorio histórico de alta montaña a 2.877 m de altitud',
      'Planeterio y museo astronómico más alto de Europa',
      'Seeing atmosférico excepcional probado desde el siglo XIX'
    ],
    keyObservingSites: [
      'Terrasses du Pic du Midi (2.877 m)',
      'Col du Tourmalet',
      'Cirque de Gavarnie'
    ],
    bestSeason: 'Verano y Otoño',
    officialUrl: 'https://darksky.org/places/pic-du-midi-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-cevennes',
    name: 'Cévennes National Park Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Francia',
    continent: 'Europa',
    region: 'Lozère / Gard',
    bortleClass: 2,
    sqm: 21.84,
    designationYear: 2018,
    areaKm2: 3560,
    latitude: 44.3333,
    longitude: 3.6667,
    description: 'La Reserva Dark Sky más extensa de Europa continental (3.560 km²). Ubicada en el Macizo Central francés, protege cañones de caliza profunda y cumbres graníticas donde la Vía Láctea brilla con un relieve sobrecogedor.',
    highlights: [
      'La mayor Reserva Dark Sky de Europa Continental',
      'Más de 250 municipios adheridos a la ordenanza de cielo puro',
      'Refugio de especies nocturnas amenazadas (murciélagos y búhos)'
    ],
    keyObservingSites: [
      'Mont Lozère (Sommet de Finiels, 1.699 m)',
      'Col de Prat Peyrot (Mont Aigoual)',
      'Gorges du Tarn'
    ],
    bestSeason: 'Mayo a Octubre',
    officialUrl: 'https://darksky.org/places/cevennes-national-park-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-kerry',
    name: 'Kerry International Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Irlanda',
    continent: 'Europa',
    region: 'Condado de Kerry (Península de Iveragh)',
    bortleClass: 1,
    sqm: 21.90,
    designationYear: 2014,
    areaKm2: 700,
    latitude: 51.8333,
    longitude: -10.1667,
    description: 'Acreditada como Nivel Oro por DarkSky International. Encajada entre los montes MacGillycuddy\'s Reeks y el salvaje Océano Atlántico, goza de horizontes oceánicos oscuros libres de luz artificial.',
    highlights: [
      'Reserva Nivel Oro en el hemisferio norte',
      'Vistas hacia el horizonte atlántico completamente deshabitado',
      'Ruta costera Ring of Kerry libre de alumbrado intrusivo'
    ],
    keyObservingSites: [
      'Ballinskelligs Castle & Beach',
      'Coomanaspig Pass',
      'Derrynane National Historic Park'
    ],
    bestSeason: 'Septiembre a Abril',
    officialUrl: 'https://darksky.org/places/kerry-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-exmoor',
    name: 'Exmoor National Park Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Reino Unido',
    continent: 'Europa',
    region: 'Devon & Somerset (Inglaterra)',
    bortleClass: 3,
    sqm: 21.72,
    designationYear: 2011,
    areaKm2: 692,
    latitude: 51.1333,
    longitude: -3.6500,
    description: 'La primera Reserva Dark Sky de Europa. Famosa por sus colinas de brezales costeros y acantilados marinos, con festivales anuales de astroturismo y senderismo estelar nocturno.',
    highlights: [
      'Primera Reserva de Cielo Oscuro designada en Europa (2011)',
      'Organización del prestigioso Exmoor Dark Skies Festival',
      'Rutas guiadas de observación de fauna nocturna y ciervos'
    ],
    keyObservingSites: [
      'Dunkery Beacon (Punto más alto de Exmoor)',
      'Wimbleball Lake',
      'Holdstone Down'
    ],
    bestSeason: 'Otoño e Invierno',
    officialUrl: 'https://darksky.org/places/exmoor-national-park-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-westhavelland',
    name: 'Westhavelland Nature Park Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Alemania',
    continent: 'Europa',
    region: 'Brandeburgo',
    bortleClass: 3,
    sqm: 21.68,
    designationYear: 2014,
    areaKm2: 750,
    latitude: 52.6833,
    longitude: 12.3500,
    description: 'A tan solo 70 km al oeste de Berlín, este parque fluvial del río Havel constituye un milagro ecológico: un oasis de noche oscura en medio de la densa cuenca metropolitana de Centroeuropa.',
    highlights: [
      'El lugar más oscuro de Alemania a corta distancia de Berlín',
      'Ecosistema fluvial protegido con rica avifauna migratoria',
      'Puntos de observación equipados con postes de soporte para telescopios'
    ],
    keyObservingSites: [
      'Gülpe (El punto más oscuro)',
      'Parey am Havel',
      'Sternenblick Kolonie Zootzen'
    ],
    bestSeason: 'Otoño e Invierno',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
  },

  // ══════════════════════════════════════════════════════════════
  // 🌎 AMÉRICA DEL NORTE
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ds-grand-canyon',
    name: 'Grand Canyon National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Arizona',
    bortleClass: 2,
    sqm: 21.92,
    designationYear: 2016,
    areaKm2: 4926,
    latitude: 36.0544,
    longitude: -112.1401,
    description: 'Uno de los monumentos naturales más sobrecogedores de la Tierra. El parque culminó un plan de reacondicionamiento masivo de más de 1.500 luminarias históricas para certificar sus casi 5.000 km² de cañón geológico.',
    highlights: [
      'El Gran Cañón del Colorado bajo una Vía Láctea escultórica',
      'Grand Canyon Star Party (uno de los mayores eventos astronómicos del mundo)',
      'Cielos desérticos de alta meseta a más de 2.100 m de altitud'
    ],
    keyObservingSites: [
      'Mather Point & Yavapai Point (South Rim)',
      'Desert View Watchtower',
      'Bright Angel Point (North Rim)'
    ],
    bestSeason: 'Mayo a Octubre',
    officialUrl: 'https://darksky.org/places/grand-canyon-national-park-dark-sky-park/',
    imageUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-death-valley',
    name: 'Death Valley National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'California / Nevada',
    bortleClass: 1,
    sqm: 21.96,
    designationYear: 2013,
    areaKm2: 13650,
    latitude: 36.5323,
    longitude: -116.9325,
    description: 'El mayor Parque de Cielo Oscuro de los Estados Unidos (más de 13.600 km²). Certificado como Nivel Oro por DarkSky International gracias a la ausencia casi total de humedad atmosférica y la inmensidad desértica.',
    highlights: [
      'Nivel Oro de oscuridad con SQM cercano a 22.00',
      'Paisaje marciano de dunas y cuencas salinas bajo millones de estrellas',
      'Humedad relativa extremadamente baja que maximiza la transparencia'
    ],
    keyObservingSites: [
      'Badwater Basin (86 metros bajo el nivel del mar)',
      'Mesquite Flat Sand Dunes',
      'Zabriskie Point'
    ],
    bestSeason: 'Noviembre a Marzo (invierno desértico suave)',
    officialUrl: 'https://darksky.org/places/death-valley-national-park-dark-sky-park/',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-central-idaho',
    name: 'Central Idaho Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Idaho (Sawtooth Mountains)',
    bortleClass: 1,
    sqm: 21.95,
    designationYear: 2017,
    areaKm2: 3668,
    latitude: 44.1500,
    longitude: -114.9333,
    description: 'La primera Reserva de Cielo Oscuro certificada en los Estados Unidos y clasificada como Nivel Oro. Enclavada en el corazón de las majestuosas montañas Sawtooth y los ríos salvajes de Idaho.',
    highlights: [
      'Primera Reserva Dark Sky de EE. UU. (Nivel Oro)',
      'Cumbres nevadas alpinas y lagos glaciares cristalinos',
      'Comunidad de Ketchum y Sun Valley con normativas pioneras'
    ],
    keyObservingSites: [
      'Redfish Lake & Stanley Basin',
      'Galena Summit Overlook (2.652 m)',
      'Sun Valley / Bald Mountain'
    ],
    bestSeason: 'Verano y Principios de Otoño',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-mont-megantic',
    name: 'Mont-Mégantic International Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Canadá',
    continent: 'América del Norte',
    region: 'Quebec (Cantons-de-l\'Est)',
    bortleClass: 2,
    sqm: 21.75,
    designationYear: 2007,
    areaKm2: 5490,
    latitude: 45.4556,
    longitude: -71.1528,
    description: 'La primera Reserva Internacional de Cielo Oscuro designada en la historia por la IDA (2007). Alberga el Observatorio del Mont Mégantic y un modelo pionero de reconversión de alumbrado en 34 municipios de Quebec.',
    highlights: [
      'La primera Reserva Dark Sky de la historia mundial (2007)',
      'Observatorio profesional con telescopio Ritchey-Chrétien de 1.6 m',
      'Centro de astrofísica ASTROLab con divulgación multimedia'
    ],
    keyObservingSites: [
      'Sommet du Mont-Mégantic (1.105 m)',
      'Observatoire populaire de l\'ASTROLab',
      'Secteur de Franceville'
    ],
    bestSeason: 'Verano y Otoño',
    officialUrl: 'https://darksky.org/places/mont-megantic-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-san-pedro-martir',
    name: 'Sierra de San Pedro Mártir',
    category: 'International Dark Sky Sanctuary',
    categoryLabel: 'Santuario Internacional de Cielo Oscuro',
    country: 'México',
    continent: 'América del Norte',
    region: 'Baja California',
    bortleClass: 1,
    sqm: 21.98,
    designationYear: 2021,
    areaKm2: 729,
    latitude: 31.0450,
    longitude: -115.4640,
    description: 'Sede del Observatorio Astronómico Nacional de la UNAM a 2.800 m de altitud. Uno de los cuatro mejores sitios astronómicos del hemisferio norte junto con Hawái, La Palma y el suroeste de EE.UU.',
    highlights: [
      'Más de 80% de noches despejadas al año',
      'Atmósfera laminar sin turbulencias (seeing extraordinario)',
      'Bosque de coníferas de alta montaña en la península de Baja California'
    ],
    keyObservingSites: [
      'Observatorio Astronómico Nacional (OAN-SPM)',
      'Mirador de Picacho del Diablo',
      'Campamento Vallecitos'
    ],
    bestSeason: 'Primavera, Verano y Otoño',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    featured: true
  },

  // ══════════════════════════════════════════════════════════════
  // 🌎 AMÉRICA DEL SUR
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ds-gabriela-mistral',
    name: 'Gabriela Mistral Dark Sky Sanctuary',
    category: 'International Dark Sky Sanctuary',
    categoryLabel: 'Santuario Internacional de Cielo Oscuro',
    country: 'Chile',
    continent: 'América del Sur',
    region: 'Valle del Elqui (Región de Coquimbo)',
    bortleClass: 1,
    sqm: 21.98,
    designationYear: 2015,
    areaKm2: 360,
    latitude: -30.2500,
    longitude: -70.7333,
    description: 'El primer Santuario Internacional de Cielo Oscuro del mundo. Alberga los telescopios de AURA, incluyendo Cerro Tololo y Gemini Sur, bajo uno de los cielos más secos y transparentes del planeta.',
    highlights: [
      'Primer Santuario Dark Sky certificado en la historia mundial',
      'Sede de los observatorios astronómicos de vanguardia de AURA',
      'Más de 300 noches despejadas al año con atmósfera inmóvil'
    ],
    keyObservingSites: [
      'Cerro Tololo Inter-American Observatory',
      'Cerro Pachón (Gemini Sur y Vera C. Rubin)',
      'Vicuña & Quebrada de Paihuano'
    ],
    bestSeason: 'Todo el año (especialmente Primavera y Verano austral)',
    officialUrl: 'https://darksky.org/places/gabriela-mistral-dark-sky-sanctuary/',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-atacama',
    name: 'Desierto de Atacama & Valle de la Luna',
    category: 'International Dark Sky Sanctuary',
    categoryLabel: 'Santuario Internacional de Cielo Oscuro',
    country: 'Chile',
    continent: 'América del Sur',
    region: 'Región de Antofagasta',
    bortleClass: 1,
    sqm: 22.00,
    designationYear: 2019,
    areaKm2: 8500,
    latitude: -23.8634,
    longitude: -69.1328,
    description: 'La meca indiscutible de la astronomía mundial. Con 0 mm de lluvia en décadas y altitudes de hasta 5.000 metros, el cielo nocturno permite ver las Nubes de Magallanes y la Vía Láctea arrojando sombras sobre el suelo.',
    highlights: [
      'Oscuridad absoluta en el límite teórico (SQM 22.00)',
      'Vecindad con los observatorios ALMA, Paranal (VLT) y el futuro ELT',
      'Transparencia infrarroja y visible inigualable en la Tierra'
    ],
    keyObservingSites: [
      'Llano de Chajnantor (Meseta de ALMA, 5.000 m)',
      'Valle de la Muerte & Cordillera de la Sal',
      'Salar de Atacama & Laguna Cejar'
    ],
    bestSeason: 'Todo el año',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-el-leoncito',
    name: 'Parque Nacional El Leoncito',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Argentina',
    continent: 'América del Sur',
    region: 'San Juan (Cordillera de los Andes)',
    bortleClass: 1,
    sqm: 21.95,
    designationYear: 2020,
    areaKm2: 897,
    latitude: -31.8000,
    longitude: -69.2333,
    description: 'En el piedemonte andino de San Juan. Un paraíso de casi 900 km² protegido por ley nacional donde operan los complejos astronómicos CASLEO y CESCO gracias a más de 300 noches despejadas al año.',
    highlights: [
      'Alberga el telescopio Jorge Sahade de 2.15 m (CASLEO)',
      'Excelente estabilidad del aire andino sin vientos turbulentos',
      'Senderismo nocturno entre guanacos y cardones gigantes'
    ],
    keyObservingSites: [
      'Complejo Astronómico El Leoncito (CASLEO)',
      'Estación de Altura Carlos U. Cesco',
      'Barreal Blanco (Pampa del Leoncito)'
    ],
    bestSeason: 'Todo el año',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
  },

  // ══════════════════════════════════════════════════════════════
  // 🌍 ÁFRICA
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ds-namib-rand',
    name: 'NamibRand Nature Reserve Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Namibia',
    continent: 'África',
    region: 'Desierto de Namib',
    bortleClass: 1,
    sqm: 22.00,
    designationYear: 2012,
    areaKm2: 2022,
    latitude: -24.9500,
    longitude: 15.9833,
    description: 'En el desierto más antiguo del planeta. Una de las zonas más despobladas y secas de la Tierra, clasificada como Dark Sky de Nivel Oro con mediciones de SQM en el límite teórico de la oscuridad natural.',
    highlights: [
      'Nivel Oro absoluto de DarkSky International',
      'Desierto sin contaminación lumínica en cientos de kilómetros',
      'Centro educativo Namib Desert Environmental Education Trust'
    ],
    keyObservingSites: [
      'Sossusvlei & Deadvlei Sand Dunes',
      'Wolwedans Plateau Camp',
      'Kudu Plains'
    ],
    bestSeason: 'Mayo a Septiembre (Invierno seco)',
    officialUrl: 'https://darksky.org/places/namibrand-nature-reserve-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-sutherland-karoo',
    name: 'Great Karoo & Sutherland Observatory',
    category: 'International Dark Sky Sanctuary',
    categoryLabel: 'Santuario Internacional de Cielo Oscuro',
    country: 'Sudáfrica',
    continent: 'África',
    region: 'Northern Cape (Gran Karoo)',
    bortleClass: 1,
    sqm: 21.97,
    designationYear: 2019,
    areaKm2: 4500,
    latitude: -32.3967,
    longitude: 20.6617,
    description: 'La capital de la astronomía en el continente africano. En la meseta semiárida del Karoo a 1.760 m de altitud se erige el telescopio SALT (Southern African Large Telescope) con espejo de 11 metros.',
    highlights: [
      'Sede del mayor telescopio óptico individual del hemisferio sur (SALT)',
      'Altitud de 1.760 metros con nula nubosidad e invierno helado y puro',
      'Observación de la Nebulosa de Carina y el Centro Galáctico en el cenit'
    ],
    keyObservingSites: [
      'South African Astronomical Observatory (SAAO Plateau)',
      'Sterland Astro Land',
      'Rooi Kloof Wilderness'
    ],
    bestSeason: 'Abril a Septiembre (Invierno austral)',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=800&q=80',
    featured: true
  },

  // ══════════════════════════════════════════════════════════════
  // 🌏 ASIA & ORIENTE MEDIO
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ds-iriomote-ishigaki',
    name: 'Iriomote-Ishigaki National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Japón',
    continent: 'Asia',
    region: 'Prefectura de Okinawa (Islas Yaeyama)',
    bortleClass: 1,
    sqm: 21.85,
    designationYear: 2018,
    areaKm2: 406,
    latitude: 24.3333,
    longitude: 124.1500,
    description: 'El primer Parque Dark Sky certificado en Japón. Gracias a su baja latitud (24°N), es uno de los pocos lugares de Japón donde se pueden contemplar 84 de las 88 constelaciones oficiales de la Unión Astronómica Internacional.',
    highlights: [
      'Visibilidad de 84 de las 88 constelaciones celestes',
      'Primera designación oficial DarkSky en Japón',
      'Observación nocturna entre playas de coral y selva subtropical'
    ],
    keyObservingSites: [
      'Mirador Hirakubozaki (Cabo Norte de Ishigaki)',
      'Playa de Kabira Bay',
      'Parque Natural de Iriomote'
    ],
    bestSeason: 'Todo el año',
    officialUrl: 'https://darksky.org/places/iriomote-ishigaki-national-park-dark-sky-park/',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-wadi-rum',
    name: 'Wadi Rum Protected Area',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Jordania',
    continent: 'Asia',
    region: 'Desierto de Aqaba',
    bortleClass: 1,
    sqm: 21.94,
    designationYear: 2022,
    areaKm2: 720,
    latitude: 29.5736,
    longitude: 35.4206,
    description: 'El Valle de la Luna jordano. Paisaje protegido por la UNESCO de monolitos de arenisca roja y cañones profundos habitados por beduinos, con una de las atmósferas más secas de Oriente Próximo.',
    highlights: [
      'Cañones de roca rojiza y arena cobriza bajo millones de estrellas',
      'Tradición astronómica milenaria beduina de navegación celeste',
      'Campamentos ecológicos equipados con domos geodésicos transparentes'
    ],
    keyObservingSites: [
      'Jebel Umm ad Dami (Cima más alta de Jordania, 1.854 m)',
      'Burdah Rock Bridge Camp',
      'Lawrence\'s Spring Canyon'
    ],
    bestSeason: 'Octubre a Abril',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    featured: true
  },

  // ══════════════════════════════════════════════════════════════
  // 🌏 OCEANÍA
  // ══════════════════════════════════════════════════════════════
  {
    id: 'ds-aoraki-mackenzie',
    name: 'Aoraki Mackenzie Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Nueva Zelanda',
    continent: 'Oceanía',
    region: 'Canterbury (Isla Sur)',
    bortleClass: 1,
    sqm: 21.97,
    designationYear: 2012,
    areaKm2: 4367,
    latitude: -43.7333,
    longitude: 170.1000,
    description: 'Ubicada en la meseta de Mackenzie alrededor del monte Aoraki/Mount Cook. Famosa por sus vistas meridionales del Centro Galáctico, las Nubes de Magallanes y la Aurora Austral sobre lagos turquesa.',
    highlights: [
      'Nubes de Magallanes y Cruz del Sur con nitidez suprema',
      'Posibilidad de fotografiar Auroras Australes sobre glaciares',
      'Sede del Observatorio Mount John de la Universidad de Canterbury'
    ],
    keyObservingSites: [
      'Mount John Observatory & Lake Tekapo',
      'Lake Pukaki Shoreline',
      'Aoraki/Mount Cook National Park Village'
    ],
    bestSeason: 'Todo el año (Especialmente Otoño e Invierno austral)',
    officialUrl: 'https://darksky.org/places/aoraki-mackenzie-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-warrumbungle',
    name: 'Warrumbungle National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Australia',
    continent: 'Oceanía',
    region: 'Nueva Gales del Sur',
    bortleClass: 1,
    sqm: 21.94,
    designationYear: 2016,
    areaKm2: 233,
    latitude: -31.2833,
    longitude: 148.9833,
    description: 'El primer Parque Dark Sky certificado en Australia. Enclavado en una cordillera volcánica escarpada que alberga el Observatorio Siding Spring, el principal observatorio óptico de investigación de Australia.',
    highlights: [
      'Primer Parque de Cielo Oscuro certificado en el continente australiano',
      'Sede del Anglo-Australian Telescope de 3.9 metros',
      'Agujas volcánicas espectaculares (The Breadknife) bajo la Vía Láctea austral'
    ],
    keyObservingSites: [
      'Siding Spring Observatory Visitors Centre',
      'Canyon Camp & Belougery Split Rock',
      'Whitegum Lookout'
    ],
    bestSeason: 'Marzo a Noviembre',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    featured: true
  }
];
