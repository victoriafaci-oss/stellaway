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
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/Miradouro_do_Ujo.jpg/960px-Miradouro_do_Ujo.jpg'
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
    imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80'
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
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/65/Derrynane_Bay.jpg/960px-Derrynane_Bay.jpg'
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
    id: 'ds-big-bend',
    name: 'Greater Big Bend International Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Texas / Coahuila & Chihuahua',
    bortleClass: 1,
    sqm: 21.98,
    designationYear: 2022,
    areaKm2: 38850,
    latitude: 29.2498,
    longitude: -103.2502,
    description: 'La mayor Reserva de Cielo Oscuro del planeta (más de 38.800 km²), abarcando el Parque Nacional Big Bend, el Parque Estatal Big Bend Ranch, el Observatorio McDonald y áreas protegidas de México a lo largo del Río Grande.',
    highlights: [
      'La Reserva Dark Sky más extensa del mundo (>38.000 km²)',
      'Sede del histórico Observatorio McDonald de la Universidad de Texas',
      'Cielos desérticos puros Bortle 1 sobre el cañón de Santa Elena'
    ],
    keyObservingSites: [
      'Santa Elena Canyon',
      'Chisos Basin',
      'McDonald Observatory Visitor Center',
      'Sotol Vista Overlook'
    ],
    bestSeason: 'Otoño, Invierno y Primavera',
    officialUrl: 'https://darksky.org/places/greater-big-bend-international-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-natural-bridges',
    name: 'Natural Bridges National Monument Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Utah',
    bortleClass: 1,
    sqm: 21.96,
    designationYear: 2007,
    areaKm2: 31,
    latitude: 37.6014,
    longitude: -110.0136,
    description: 'El primer Parque Internacional de Cielo Oscuro certificado en la historia mundial por DarkSky International (2007). Sus tres majestuosos puentes naturales de arenisca (Owachomo, Sipapu y Kachina) enmarcan la Vía Láctea.',
    highlights: [
      'El primer Parque Dark Sky del mundo (designado en 2007)',
      'Puente natural Owachomo encuadrando el río de estrellas de la Vía Láctea',
      'Atmósfera de gran altitud (2.000 m) con oscuridad Bortle 1 casi perfecta'
    ],
    keyObservingSites: [
      'Owachomo Bridge Viewpoint',
      'Sipapu Bridge Overlook',
      'Visitor Center Astronomy Patio'
    ],
    bestSeason: 'Primavera, Verano y Otoño',
    officialUrl: 'https://darksky.org/places/natural-bridges-national-monument-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/be/Owachomo_laban.jpg/960px-Owachomo_laban.jpg',
    featured: true
  },
  {
    id: 'ds-arches',
    name: 'Arches National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Utah (Moab)',
    bortleClass: 2,
    sqm: 21.88,
    designationYear: 2019,
    areaKm2: 310,
    latitude: 38.7331,
    longitude: -109.5925,
    description: 'Más de 2.000 arcos naturales de piedra arenisca roja esculpidos por el viento y el agua. Famoso por astrofotógrafos de todo el mundo que capturan la Vía Láctea a través del emblemático Delicate Arch y Windows Section.',
    highlights: [
      'El icónico Delicate Arch y Double Arch bajo el arco galáctico',
      'Reconversión modélica de luminarias de parque al 100% de corte ámbar',
      'Ubicación privilegiada en la meseta del Colorado con aire seco y limpio'
    ],
    keyObservingSites: [
      'The Windows Section & Turret Arch',
      'Delicate Arch Viewpoint',
      'Garden of Eden',
      'Panorama Point'
    ],
    bestSeason: 'Primavera y Otoño',
    officialUrl: 'https://darksky.org/places/arches-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Delicate_arch_sunset.jpg/960px-Delicate_arch_sunset.jpg',
    featured: true
  },
  {
    id: 'ds-bryce-canyon',
    name: 'Bryce Canyon National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Utah',
    bortleClass: 1,
    sqm: 21.95,
    designationYear: 2019,
    areaKm2: 145,
    latitude: 37.5930,
    longitude: -112.1871,
    description: 'Conocido como "el hogar del cielo nocturno", Bryce Canyon es legendario por su festival anual de astronomía y sus más de 7.500 estrellas visibles a simple vista sobre el laberinto de anfiteatros de agujas rojas (hoodoos) a 2.700 m de altitud.',
    highlights: [
      'Altitud de entre 2.400 y 2.700 metros sobre el nivel del mar',
      'Paisaje de hoodoos rojos esculpidos bajo una bóveda estelar sin igual',
      'Pionero en programas públicos de astronomía desde 1969'
    ],
    keyObservingSites: [
      'Inspiration Point',
      'Sunrise Point',
      'Rainbow Point (2.778 m)',
      'Paria View'
    ],
    bestSeason: 'Mayo a Octubre',
    officialUrl: 'https://darksky.org/places/bryce-canyon-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c3/Inspiration_Point_Bryce_Canyon_November_2018_panorama.jpg/960px-Inspiration_Point_Bryce_Canyon_November_2018_panorama.jpg',
    featured: true
  },
  {
    id: 'ds-canyonlands',
    name: 'Canyonlands National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Utah (Moab)',
    bortleClass: 1,
    sqm: 21.97,
    designationYear: 2015,
    areaKm2: 1366,
    latitude: 38.3269,
    longitude: -109.8783,
    description: 'Laberinto salvaje de cañones esculpidos por los ríos Colorado y Green. En la meseta "Island in the Sky", el arco de piedra Mesa Arch y los miradores de The Needles ofrecen horizontes de más de 160 kilómetros de pura oscuridad.',
    highlights: [
      'Mesa Arch con vistas panorámicas abismales hacia la Vía Láctea',
      'Cielos de altísima pureza Bortle 1 en los sectores The Needles y The Maze',
      'Reconocimiento Dark Sky de nivel oro por sus horizontes vírgenes'
    ],
    keyObservingSites: [
      'Mesa Arch',
      'Grand View Point',
      'Green River Overlook',
      'Elephant Hill'
    ],
    bestSeason: 'Primavera y Otoño',
    officialUrl: 'https://darksky.org/places/canyonlands-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/99/Green_River_Overlook_Ekker_Butte.jpg/960px-Green_River_Overlook_Ekker_Butte.jpg'
  },
  {
    id: 'ds-zion',
    name: 'Zion National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Utah',
    bortleClass: 2,
    sqm: 21.82,
    designationYear: 2021,
    areaKm2: 593,
    latitude: 37.2982,
    longitude: -113.0263,
    description: 'El quinto parque de los "Mighty 5" de Utah en lograr la certificación Dark Sky. Sus colosales acantilados monolíticos de arenisca roja Navajo, como The Watchman y Towers of the Virgin, contrastan con un cielo estrellado impoluto.',
    highlights: [
      'Completa la red estelar de los 5 Parques Nacionales de Utah certificados',
      'Monolito The Watchman recortado contra constelaciones y satélites',
      'Observación estelar protegida en el cañón de Kolob Canyons'
    ],
    keyObservingSites: [
      'Watchman Campground Amphitheater',
      'Kolob Canyons Viewpoint',
      'Lava Point Overlook (2.400 m)',
      'Pa’rus Trail'
    ],
    bestSeason: 'Primavera, Verano y Otoño',
    officialUrl: 'https://darksky.org/places/zion-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Zion_angels_landing_view.jpg/960px-Zion_angels_landing_view.jpg'
  },
  {
    id: 'ds-capitol-reef',
    name: 'Capitol Reef National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Utah',
    bortleClass: 1,
    sqm: 21.94,
    designationYear: 2015,
    areaKm2: 979,
    latitude: 38.3670,
    longitude: -111.2615,
    description: 'Custodio del Waterpocket Fold, una gigantesca deformación geológica de casi 160 kilómetros de longitud. Sus domos blancos que recuerdan al Capitolio y los monolitos de Cathedral Valley gozan de una atmósfera sin polución lumínica.',
    highlights: [
      'Monolitos del Templo del Sol y la Luna en Cathedral Valley',
      'Transparencia atmosférica desértica en el corazón de Utah',
      'Programas semanales de telescopios con guardaparques'
    ],
    keyObservingSites: [
      'Panorama Point & Goosenecks Overlook',
      'Cathedral Valley',
      'Fruita Campground Area',
      'Slickrock Divide'
    ],
    bestSeason: 'Primavera, Verano y Otoño',
    officialUrl: 'https://darksky.org/places/capitol-reef-national-park-dark-sky-park/',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-joshua-tree',
    name: 'Joshua Tree National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'California (Desierto de Mojave)',
    bortleClass: 2,
    sqm: 21.75,
    designationYear: 2017,
    areaKm2: 3218,
    latitude: 33.8734,
    longitude: -115.9010,
    description: 'Donde confluyen los desiertos de Mojave y Colorado. Célebre por los extraños árboles de Josué (Yucca brevifolia) y las formaciones de rocas redondeadas de monzogranito que crean siluetas mágicas bajo la Vía Láctea.',
    highlights: [
      'Siluetas icónicas de árboles de Josué bajo lluvia de meteoros',
      'Festival anual Night Sky Festival con cientos de telescopios',
      'Sector este (Cottonwood) con una oscuridad sublime de Bortle 2'
    ],
    keyObservingSites: [
      'Cottonwood Campground & Visitor Center',
      'Keys View (1.581 m)',
      'Hidden Valley',
      'Pinto Basin'
    ],
    bestSeason: 'Octubre a Mayo',
    officialUrl: 'https://darksky.org/places/joshua-tree-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Joshua_Tree_-_Cyclops_%2B_Potato_Head_-_Sunrise.jpg/960px-Joshua_Tree_-_Cyclops_%2B_Potato_Head_-_Sunrise.jpg',
    featured: true
  },
  {
    id: 'ds-great-basin',
    name: 'Great Basin National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Nevada',
    bortleClass: 1,
    sqm: 21.98,
    designationYear: 2016,
    areaKm2: 312,
    latitude: 38.9833,
    longitude: -114.3000,
    description: 'Uno de los parques más remotos y vírgenes del territorio continental de EE.UU. Coronador del pico Wheeler Peak (3.982 m) y hogar de los pinos longevos bristlecone de más de 4.000 años, alberga el Great Basin Star Train.',
    highlights: [
      'Uno de los cielos más oscuros y transparentes de EE.UU. (SQM 21.98)',
      'Observatorio astronómico de investigación permanente en el parque',
      'Tren histórico "Star Train" guiado por astrónomos del Servicio de Parques'
    ],
    keyObservingSites: [
      'Wheeler Peak Overlook (3.000 m)',
      'Great Basin Observatory',
      'Mather Overlook',
      'Baker Creek'
    ],
    bestSeason: 'Junio a Octubre',
    officialUrl: 'https://darksky.org/places/great-basin-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/WheelerPeakNevadaMarch2010.jpg/960px-WheelerPeakNevadaMarch2010.jpg'
  },
  {
    id: 'ds-chaco-culture',
    name: 'Chaco Culture National Historical Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Nuevo México',
    bortleClass: 1,
    sqm: 21.96,
    designationYear: 2013,
    areaKm2: 137,
    latitude: 36.0600,
    longitude: -107.9700,
    description: 'Epicentro milenario de la arqueoastronomía ancestral de la cultura pueblo (siglos IX al XII). Sus grandes casas de piedra como Pueblo Bonito y Casa Rinconada se alinean con los solsticios, equinoccios y ciclos lunares mayores.',
    highlights: [
      'Alineaciones arqueoastronómicas solares y lunares milenarias',
      'Primer Parque Histórico Nacional certificado por DarkSky en el mundo',
      'Observatorio público propio de 25 pulgadas para visitantes'
    ],
    keyObservingSites: [
      'Chaco Observatory',
      'Pueblo Bonito Plaza',
      'Fajada Butte',
      'Gallo Campground'
    ],
    bestSeason: 'Primavera y Otoño',
    officialUrl: 'https://darksky.org/places/chaco-culture-national-historical-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/48/Chaco_Culture_NHP_%288023723138%29.jpg/960px-Chaco_Culture_NHP_%288023723138%29.jpg'
  },
  {
    id: 'ds-cosmic-campground',
    name: 'Cosmic Campground International Dark Sky Sanctuary',
    category: 'International Dark Sky Sanctuary',
    categoryLabel: 'Santuario Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Nuevo México (Bosque Nacional Gila)',
    bortleClass: 1,
    sqm: 21.99,
    designationYear: 2016,
    areaKm2: 15,
    latitude: 33.4795,
    longitude: -108.9228,
    description: 'El primer Santuario Internacional de Cielo Oscuro designado en América del Norte (2016). Enclavado en el Bosque Nacional de Gila, a 65 km de la fuente lumínica artificial más cercana, dispone de 4 plataformas de hormigón para telescopios.',
    highlights: [
      'Primer Santuario Dark Sky certificado en Norteamérica',
      'Cero contaminación lumínica en un radio de más de 65 kilómetros',
      'Plataformas fijas de observación para telescopios y astrofotografía'
    ],
    keyObservingSites: [
      'Cosmic Observation Pads',
      'Gila Wilderness Overlook',
      'Saliz Pass'
    ],
    bestSeason: 'Todo el año',
    officialUrl: 'https://darksky.org/places/cosmic-campground-dark-sky-sanctuary/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a3/Gila_Wilderness_0608.jpg/960px-Gila_Wilderness_0608.jpg'
  },
  {
    id: 'ds-massacre-rim',
    name: 'Massacre Rim Wilderness Study Area Sanctuary',
    category: 'International Dark Sky Sanctuary',
    categoryLabel: 'Santuario Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Nevada',
    bortleClass: 1,
    sqm: 22.00,
    designationYear: 2019,
    areaKm2: 412,
    latitude: 41.7333,
    longitude: -119.6833,
    description: 'Uno de los territorios más aislados y vírgenes del planeta, en la esquina noroeste de Nevada. Designado Santuario Dark Sky Nivel Oro en 2019, sus mediciones alcanzan el umbral de oscuridad natural perfecta (SQM 22.00).',
    highlights: [
      'Mediciones de oscuridad en el límite físico natural (SQM 22.00)',
      'Paisaje de mesetas volcánicas y cañones vírgenes sin caminos asfaltados',
      'Vía Láctea arrojando sombras nítidas sobre el terreno'
    ],
    keyObservingSites: [
      'Massacre Rim Escarpment',
      'Long Valley Viewpoint',
      'Massacre Lake Basin'
    ],
    bestSeason: 'Verano y Principios de Otoño',
    officialUrl: 'https://darksky.org/places/massacre-rim-wsa-dark-sky-sanctuary/',
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-cherry-springs',
    name: 'Cherry Springs State Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Pensilvania (Susquehannock)',
    bortleClass: 2,
    sqm: 21.80,
    designationYear: 2008,
    areaKm2: 0.33,
    latitude: 41.6628,
    longitude: -77.8239,
    description: 'El segundo Parque Internacional de Cielo Oscuro del mundo y el gran templo astronómico de la Costa Este de EE.UU. Situado en lo alto de una meseta de 700 metros rodeada por el inmenso bosque de Susquehannock, con campo de observación de 360°.',
    highlights: [
      'El lugar de observación más oscuro y concurrido de la Costa Este',
      'Astronomy Observation Field equipado con tomas eléctricas para telescopios',
      'Reconocimiento Nivel Oro por la conservación de la noche natural'
    ],
    keyObservingSites: [
      'Astronomy Observation Field',
      'Night Sky Public Viewing Area',
      'Susquehannock Forest Vista'
    ],
    bestSeason: 'Primavera, Verano y Otoño',
    officialUrl: 'https://darksky.org/places/cherry-springs-state-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Cherry_Springs_State_Park_panorama.jpg/960px-Cherry_Springs_State_Park_panorama.jpg',
    featured: true
  },
  {
    id: 'ds-black-canyon',
    name: 'Black Canyon of the Gunnison National Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Colorado',
    bortleClass: 1,
    sqm: 21.92,
    designationYear: 2015,
    areaKm2: 124,
    latitude: 38.5754,
    longitude: -107.7416,
    description: 'Acantilados verticales de granito precámbrico que caen hasta 800 metros en picado hacia el río Gunnison. La estrechez y verticalidad del cañón, unida a la altitud de 2.500 metros, crea una atmósfera limpia de mínima turbulencia.',
    highlights: [
      'Paredes de roca milenaria del "Painted Wall" bajo cielo estrellado',
      'Gran altitud en las Rocosas con baja humedad atmosférica',
      'Festival anual Black Canyon Astronomy Festival'
    ],
    keyObservingSites: [
      'Chasm View',
      'Dragon Point',
      'South Rim Campground Amphitheater',
      'North Rim Overlook'
    ],
    bestSeason: 'Mayo a Octubre',
    officialUrl: 'https://darksky.org/places/black-canyon-of-the-gunnison-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0b/Black_Canyon_and_Gunnison_River_2008.jpg/960px-Black_Canyon_and_Gunnison_River_2008.jpg'
  },
  {
    id: 'ds-mesa-verde',
    name: 'Mesa Verde National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Colorado',
    bortleClass: 1,
    sqm: 21.93,
    designationYear: 2021,
    areaKm2: 212,
    latitude: 37.2309,
    longitude: -108.4618,
    description: 'Patrimonio de la Humanidad por la UNESCO y centinela de las asombrosas viviendas excavadas en los acantilados por los ancestros pueblo. El parque protege más de 5.000 yacimientos arqueológicos bajo un cielo nocturno prístino.',
    highlights: [
      'Viviendas en acantilados de Cliff Palace bajo una Vía Láctea centenaria',
      'Conexión cultural profunda de las 26 tribus nativas asociadas con el cosmos',
      'Horizontes infinitos sobre el Four Corners del sudoeste americano'
    ],
    keyObservingSites: [
      'Morefield Campground Amphitheater',
      'Mancos Valley Overlook',
      'Montezuma Valley Overlook',
      'Park Point (2.613 m)'
    ],
    bestSeason: 'Mayo a Octubre',
    officialUrl: 'https://darksky.org/places/mesa-verde-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Cliff_Palace-Colorado-Mesa_Verde_NP.jpg/960px-Cliff_Palace-Colorado-Mesa_Verde_NP.jpg'
  },
  {
    id: 'ds-voyageurs',
    name: 'Voyageurs National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Minnesota (Frontera con Canadá)',
    bortleClass: 1,
    sqm: 21.94,
    designationYear: 2020,
    areaKm2: 882,
    latitude: 48.5000,
    longitude: -92.8833,
    description: 'Parque acuático boreal fronterizo con Canadá. Famoso por sus islas de bosque de pino blanco, sus lagos glaciares accesibles solo por agua y su ubicación boreal ideal para contemplar la Aurora Boreal reflejada en las aguas.',
    highlights: [
      'Frecuentes avistamientos de auroras boreales en temporada fría',
      'Reflejos estelares sobre las aguas calmas de Rainy Lake y Kabetogama',
      'Acampada en islas remotas bajo oscuridad absoluta Bortle 1'
    ],
    keyObservingSites: [
      'Rainy Lake Visitor Center',
      'Ash River Visitor Center',
      'Meadowood Day Use Area',
      'Kabetogama Lake'
    ],
    bestSeason: 'Todo el año (Otoño e Invierno para Auroras)',
    officialUrl: 'https://darksky.org/places/voyageurs-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/Rainy_Lake_from_Tango_Channel.jpg/960px-Rainy_Lake_from_Tango_Channel.jpg'
  },
  {
    id: 'ds-boundary-waters',
    name: 'Boundary Waters Canoe Area Wilderness Sanctuary',
    category: 'International Dark Sky Sanctuary',
    categoryLabel: 'Santuario Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Minnesota',
    bortleClass: 1,
    sqm: 21.98,
    designationYear: 2020,
    areaKm2: 4400,
    latitude: 47.9500,
    longitude: -91.5000,
    description: 'El Santuario de Cielo Oscuro más grande del mundo (4.400 km²). Más de 1.100 lagos glaciares conectados sin carreteras ni motores motorizados, donde se viaja solo en canoa bajo cielos nórdicos impolutos y auroras boreales.',
    highlights: [
      'El mayor Santuario Dark Sky certificado en el planeta',
      'Acceso exclusivo en canoa sin ningún tipo de contaminación acústica o lumínica',
      'Teatro boreal por excelencia para observar la aurora boreal en Norteamérica'
    ],
    keyObservingSites: [
      'Gunflint Trail Outposts',
      'Basswood Lake',
      'Sawbill Canoe Access',
      'Echo Trail Overlooks'
    ],
    bestSeason: 'Mayo a Octubre',
    officialUrl: 'https://darksky.org/places/boundary-waters-canoe-area-wilderness-dark-sky-sanctuary/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Pose_lake_Minnesota.jpg/960px-Pose_lake_Minnesota.jpg'
  },
  {
    id: 'ds-waterton-glacier',
    name: 'Waterton-Glacier International Peace Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos / Canadá',
    continent: 'América del Norte',
    region: 'Montana & Alberta',
    bortleClass: 1,
    sqm: 21.95,
    designationYear: 2021,
    areaKm2: 4572,
    latitude: 48.7596,
    longitude: -113.7870,
    description: 'El primer Parque Internacional de Cielo Oscuro transfronterizo del mundo, uniendo el Parque Nacional Glacier (Montana, EE.UU.) y el Parque Nacional Waterton Lakes (Alberta, Canadá) a lo largo de la cordillera de las Rocosas.',
    highlights: [
      'Primer Parque Transfronterizo Dark Sky en la historia (EE.UU. y Canadá)',
      'Cumbres glaciares imponentes y la icónica carretera Going-to-the-Sun Road',
      'Observación estelar sobre los lagos McDonald y Saint Mary'
    ],
    keyObservingSites: [
      'Lake McDonald Lodge Foreshore',
      'Apgar Lookout',
      'Logan Pass (2.026 m)',
      'Waterton Cameron Bay'
    ],
    bestSeason: 'Junio a Septiembre',
    officialUrl: 'https://darksky.org/places/waterton-glacier-international-peace-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Mountain_Goat_at_Hidden_Lake.jpg/960px-Mountain_Goat_at_Hidden_Lake.jpg'
  },
  {
    id: 'ds-mammoth-cave',
    name: 'Mammoth Cave National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Kentucky',
    bortleClass: 3,
    sqm: 21.65,
    designationYear: 2021,
    areaKm2: 214,
    latitude: 37.1867,
    longitude: -86.1000,
    description: 'Hogar del sistema de cuevas más largo conocido del planeta (más de 680 km explorados). El parque culminó un ambicioso programa de protección de la oscuridad exterior para beneficiar a las poblaciones de murciélagos y la fauna nocturna.',
    highlights: [
      'Unión de las maravillas subterráneas con una cúpula estelar protegida',
      'Conservación crucial para murciélagos cavernícolas amenazados',
      'Talleres y paseos nocturnos guiados con guardaparques'
    ],
    keyObservingSites: [
      'Campground Amphitheater',
      'Cedar Sink Trailhead',
      'Maple Springs Day Use Area'
    ],
    bestSeason: 'Primavera, Verano y Otoño',
    officialUrl: 'https://darksky.org/places/mammoth-cave-national-park-dark-sky-park/',
    imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-flagstaff',
    name: 'Flagstaff Dark Sky Community',
    category: 'Dark Sky Community',
    categoryLabel: 'Comunidad Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Arizona',
    bortleClass: 3,
    sqm: 21.55,
    designationYear: 2001,
    areaKm2: 168,
    latitude: 35.1983,
    longitude: -111.6513,
    description: 'La PRIMERA Comunidad Internacional de Cielo Oscuro designada en la historia (2001). Cuna de la preservación celeste moderna, a más de 2.100 m de altitud, alberga el Observatorio Lowell donde se descubrió el planeta Plutón en 1930.',
    highlights: [
      'La primera Dark Sky Community de la historia mundial (designada en 2001)',
      'Sede del Observatorio Lowell y el telescopio Clark de 24 pulgadas',
      'Pionera mundial en ordenanzas de protección de alumbrado desde 1958'
    ],
    keyObservingSites: [
      'Lowell Observatory (Mars Hill)',
      'Buffalo Park',
      'Fort Tuthill County Park',
      'San Francisco Peaks Vista'
    ],
    bestSeason: 'Todo el año',
    officialUrl: 'https://darksky.org/places/flagstaff-dark-sky-community/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/Clark_dome.jpg/960px-Clark_dome.jpg',
    featured: true
  },
  {
    id: 'ds-sedona',
    name: 'Sedona Dark Sky Community',
    category: 'Dark Sky Community',
    categoryLabel: 'Comunidad Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Arizona',
    bortleClass: 3,
    sqm: 21.50,
    designationYear: 2014,
    areaKm2: 49,
    latitude: 34.8697,
    longitude: -111.7610,
    description: 'Famosa mundialmente por sus monumentales catedrales de piedra arenisca roja. La ciudad de Sedona adoptó una estricta normativa de alumbrado exterior de corte total para proteger su mágico horizonte estelar.',
    highlights: [
      'Monolitos rojizos de Cathedral Rock y Bell Rock bajo la Vía Láctea',
      'Comunidad Dark Sky certificada con alumbrado 100% atenuado',
      'Tours de astroturismo y meditación astronómica al aire libre'
    ],
    keyObservingSites: [
      'Bell Rock Vista',
      'Cathedral Rock Trailhead',
      'Sedona Cultural Park',
      'Two Trees Viewing Area'
    ],
    bestSeason: 'Primavera, Verano y Otoño',
    officialUrl: 'https://darksky.org/places/sedona-dark-sky-community/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b0/Cathedral_Rock_-_Sedona_AZ-1.jpg/960px-Cathedral_Rock_-_Sedona_AZ-1.jpg'
  },
  {
    id: 'ds-borrego-springs',
    name: 'Borrego Springs Dark Sky Community',
    category: 'Dark Sky Community',
    categoryLabel: 'Comunidad Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'California',
    bortleClass: 2,
    sqm: 21.75,
    designationYear: 2009,
    areaKm2: 112,
    latitude: 33.2559,
    longitude: -116.3750,
    description: 'La primera Comunidad Dark Sky de California (2009). Completamente rodeada por el inmenso Parque Estatal del Desierto de Anza-Borrego (2.400 km²), goza de una protección natural única frente a las luces de la costa californiana.',
    highlights: [
      'Primera Dark Sky Community de California (designada en 2009)',
      'Esculturas gigantes de metal de Ricardo Breceda bajo el cielo nocturno',
      'Rodeada al 100% por el Parque Estatal Anza-Borrego'
    ],
    keyObservingSites: [
      'Galleta Meadows Metal Sculptures',
      'Font’s Point Overlook',
      'Christmas Circle Community Park',
      'Culp Valley Primitive Camp'
    ],
    bestSeason: 'Noviembre a Abril',
    officialUrl: 'https://darksky.org/places/borrego-springs-dark-sky-community/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Fontspoint02262006.JPG/960px-Fontspoint02262006.JPG'
  },
  {
    id: 'ds-badlands',
    name: 'Badlands National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Dakota del Sur',
    bortleClass: 1,
    sqm: 21.93,
    designationYear: 2020,
    areaKm2: 982,
    latitude: 43.8554,
    longitude: -102.3397,
    description: 'Laberinto de agujas geológicas, cañones de arcilla estratificada y pradera de hierba mixta. Sus cielos nocturnos permiten contemplar más de 7.500 estrellas y el relieve de la Vía Láctea arrojando sombras tenues.',
    highlights: [
      'Pinnáculos de arcilla esculpidos bajo una Vía Láctea deslumbrante',
      'Festival anual Badlands Astronomy Festival en Cedar Pass',
      'Cielos casi sin interferencia lumínica en cientos de kilómetros'
    ],
    keyObservingSites: [
      'Cedar Pass Amphitheater',
      'Pinnacles Overlook',
      'Big Foot Pass',
      'Hay Butte Overlook'
    ],
    bestSeason: 'Junio a Septiembre',
    officialUrl: 'https://darksky.org/places/badlands-national-park-dark-sky-park/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/MK00609_Badlands.jpg/960px-MK00609_Badlands.jpg'
  },
  {
    id: 'ds-rainbow-bridge',
    name: 'Rainbow Bridge National Monument Sanctuary',
    category: 'International Dark Sky Sanctuary',
    categoryLabel: 'Santuario Internacional de Cielo Oscuro',
    country: 'Estados Unidos',
    continent: 'América del Norte',
    region: 'Utah (Lago Powell)',
    bortleClass: 1,
    sqm: 21.96,
    designationYear: 2018,
    areaKm2: 0.65,
    latitude: 37.0775,
    longitude: -110.9642,
    description: 'Uno de los puentes naturales más grandes del mundo (88 m de altura). Sagrado para cinco naciones indígenas americanas (Navajo, Hopi, Kaibab Paiute, San Juan Southern Paiute y White Mesa Ute), certificado como Santuario Dark Sky en 2018.',
    highlights: [
      'Santuario de enorme significado cultural y espiritual indígena',
      'Acceso remoto en barco a través del cañón del Lago Powell o a pie',
      'Arco de piedra natural colosal enmarcando la Vía Láctea'
    ],
    keyObservingSites: [
      'Rainbow Bridge Trailhead Viewing Platform',
      'Forbidding Canyon Approach',
      'Bridge Canyon Overlook'
    ],
    bestSeason: 'Primavera y Otoño',
    officialUrl: 'https://darksky.org/places/rainbow-bridge-national-monument-dark-sky-sanctuary/',
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Utah_Rainbow_Arch.jpg/960px-Utah_Rainbow_Arch.jpg'
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
    imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Stanley_Lake.JPG/960px-Stanley_Lake.JPG'
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
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
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
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
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
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
    featured: true
  }
];
