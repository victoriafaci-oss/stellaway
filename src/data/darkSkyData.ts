export interface DarkSkyZone {
  id: string;
  name: string;
  category: 'International Dark Sky Sanctuary' | 'International Dark Sky Park' | 'International Dark Sky Reserve' | 'Urban Night Sky Place' | 'Dark Sky Community';
  categoryLabel: string;
  country: string;
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
  // --- ESPAÑA & PENÍNSULA IBÉRICA ---
  {
    id: 'ds-aiguamolls',
    name: 'Parque Natural dels Aiguamolls de l\'Empordà',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'España',
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
    id: 'ds-alqueva',
    name: 'Dark Sky Alqueva (Transfronterizo España - Portugal)',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Portugal / España',
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
      'Miradouro de Ruivas',
      'Parque Fluvial do Rio Tua'
    ],
    bestSeason: 'Primavera - Verano',
    officialUrl: 'https://darksky.org',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80'
  },

  // --- EUROPA ---
  {
    id: 'ds-pic-du-midi',
    name: 'Pic du Midi International Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Francia',
    region: 'Altos Pirineos',
    bortleClass: 1,
    sqm: 21.96,
    designationYear: 2013,
    areaKm2: 3112,
    latitude: 42.9369,
    longitude: 0.1428,
    description: 'En el corazón de los Pirineos franceses a 2.877 metros de altitud. Célebre por albergar el Observatorio Astronómico donde la NASA cartografió la Luna para las misiones Apollo, y por su horizonte alpino cristalino.',
    highlights: [
      'Observatorio histórico a 2.877 m de altitud',
      'Protección de cielo sobre 251 municipios de los Pirineos',
      'Acceso por teleférico de alta montaña desde La Mongie'
    ],
    keyObservingSites: [
      'Cúpula y Terraza panorámica Pic du Midi',
      'Col du Tourmalet',
      'Valle de Campan'
    ],
    bestSeason: 'Verano - Otoño',
    officialUrl: 'https://darksky.org/places/pic-du-midi-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-kerry',
    name: 'Kerry International Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Irlanda',
    region: 'Condado de Kerry (Península de Iveragh)',
    bortleClass: 1,
    sqm: 21.88,
    designationYear: 2014,
    areaKm2: 700,
    latitude: 51.8500,
    longitude: -10.1500,
    description: 'Enclavada entre las montañas de Kerry y el salvaje Océano Atlántico en la célebre Ring of Kerry. Es una de las reservas de cielo más oscuras de toda Europa septentrional, con vistas directas a la Vía Láctea sobre el mar.',
    highlights: [
      'Reserva de Nivel Oro de DarkSky International',
      'Patrimonio arqueológico neolítico alineado con estrellas',
      'Frente costero atlántico protegido'
    ],
    keyObservingSites: [
      'Ballinskelligs Castle & Beach',
      'Coomakista Pass (Mirador panorámico)',
      'Waterville Dark Sky Trail'
    ],
    bestSeason: 'Otoño - Invierno - Primavera',
    officialUrl: 'https://darksky.org/places/kerry-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-exmoor',
    name: 'Exmoor National Park Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Reino Unido',
    region: 'Devon & Somerset (Inglaterra)',
    bortleClass: 2,
    sqm: 21.75,
    designationYear: 2011,
    areaKm2: 692,
    latitude: 51.1390,
    longitude: -3.6470,
    description: 'La primera Reserva Dark Sky designada en Europa en 2011. Paisajes de brezales y acantilados marinos donde se organiza anualmente el afamado Exmoor Dark Skies Festival.',
    highlights: [
      'Primera Reserva DarkSky oficial en suelo europeo',
      'Festival anual de astroturismo y conferencias científicas',
      'Red de guías e instalaciones astronómicas rurales'
    ],
    keyObservingSites: [
      'Dunkery Beacon (Punto más alto)',
      'Wimbleball Lake',
      'Holdstone Down'
    ],
    bestSeason: 'Otoño - Invierno',
    officialUrl: 'https://darksky.org/places/exmoor-national-park-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-cevennes',
    name: 'Parc National des Cévennes Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Francia',
    region: 'Occitania',
    bortleClass: 1,
    sqm: 21.90,
    designationYear: 2018,
    areaKm2: 3560,
    latitude: 44.2000,
    longitude: 3.6000,
    description: 'La mayor Reserva Internacional Dark Sky de Europa, con más de 3.500 km² de naturaleza virgen, profundas gargantas kársticas y una estricta protección de la fauna nocturna.',
    highlights: [
      'Mayor superficie protegida Dark Sky de Europa',
      'Hogar de miles de especies de polillas y murciélagos protegidos',
      'Observaciones públicas regulares en el Monte Lozère'
    ],
    keyObservingSites: [
      'Mont Lozère (1.699 m)',
      'Gargantas del Tarn',
      'Causse Méjean'
    ],
    bestSeason: 'Verano - Otoño',
    officialUrl: 'https://darksky.org/places/cevennes-national-park-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
  },

  // --- AMÉRICA ---
  {
    id: 'ds-atacama-sanctuary',
    name: 'Gabriela Mistral Dark Sky Sanctuary',
    category: 'International Dark Sky Sanctuary',
    categoryLabel: 'Santuario Internacional de Cielo Oscuro',
    country: 'Chile',
    region: 'Valle de Elqui (Coquimbo)',
    bortleClass: 1,
    sqm: 22.00,
    designationYear: 2015,
    areaKm2: 360,
    latitude: -30.0000,
    longitude: -70.7000,
    description: 'El primer Santuario Internacional de Cielo Oscuro del planeta. Ubicado en las cumbres montañosas de los Andes donde operan telescopios de talla mundial como el Cerro Tololo (CTIO) y el Gemini South.',
    highlights: [
      'Primer Dark Sky Sanctuary designado en el mundo',
      'Valores de SQM de 22.00 (oscuridad absoluta natural)',
      'Sede de observatorios de astrofísica global de vanguardia'
    ],
    keyObservingSites: [
      'Observatorio Cerro Tololo (AURA)',
      'Pisco Elqui Mirador Cósmico',
      'Cumbres de Vicuña'
    ],
    bestSeason: 'Todo el año',
    officialUrl: 'https://darksky.org/places/gabriela-mistral-dark-sky-sanctuary/',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-grand-canyon',
    name: 'Grand Canyon National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'EE.UU.',
    region: 'Arizona',
    bortleClass: 1,
    sqm: 21.95,
    designationYear: 2019,
    areaKm2: 4926,
    latitude: 36.0544,
    longitude: -112.1401,
    description: 'Una de las maravillas naturales más icónicas de la Tierra. El parque culminó un proyecto de 5 años reacondicionando más de 1.500 luminarias para cumplir los rigurosos estándares de DarkSky International.',
    highlights: [
      'Más de 1.500 luminarias adaptadas a espectros ámbar',
      'Anfitrión de la afamada Star Party anual del Gran Cañón',
      'Vistas inigualables del arco de la Vía Láctea sobre el cañón'
    ],
    keyObservingSites: [
      'Mather Point & Yavapai Point (South Rim)',
      'Desert View Watchtower',
      'Bright Angel Point (North Rim)'
    ],
    bestSeason: 'Primavera - Verano - Otoño',
    officialUrl: 'https://darksky.org/places/grand-canyon-national-park-dark-sky-park/',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'ds-death-valley',
    name: 'Death Valley National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'EE.UU.',
    region: 'California / Nevada',
    bortleClass: 1,
    sqm: 21.98,
    designationYear: 2013,
    areaKm2: 13700,
    latitude: 36.5323,
    longitude: -116.9325,
    description: 'El mayor Parque Nacional de los 48 estados contiguos de EE.UU. Su aridez extrema y aislamiento geográfico crean uno de los horizontes nocturnos más limpios y silenciosos del planeta.',
    highlights: [
      'Nivel Oro de oscuridad (Bortle 1 en casi toda su extensión)',
      'Formaciones de salinas y dunas para astrofotografía de impacto',
      'Festival anual Dark Sky Festival con astrofísicos invitados'
    ],
    keyObservingSites: [
      'Mesquite Flat Sand Dunes',
      'Badwater Basin (Punto más bajo de Norteamérica)',
      'Dantes View (Panorámica aérea nocturna)'
    ],
    bestSeason: 'Otoño - Invierno - Primavera',
    officialUrl: 'https://darksky.org/places/death-valley-national-park-dark-sky-park/',
    imageUrl: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'ds-mont-megantic',
    name: 'Mont-Mégantic International Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Canadá',
    region: 'Quebec',
    bortleClass: 2,
    sqm: 21.78,
    designationYear: 2007,
    areaKm2: 5300,
    latitude: 45.4560,
    longitude: -71.1528,
    description: 'La primera Reserva Internacional de Cielo Oscuro creada en el mundo (2007). Un esfuerzo pionero liderado por el ASTROLab que inspiró el movimiento global de preservación de los cielos nocturnos.',
    highlights: [
      'Primera Reserva Dark Sky creada en el mundo',
      'Centro de divulgación científica y planetario ASTROLab',
      'Telescopio de 1.6 metros en la cima del macizo'
    ],
    keyObservingSites: [
      'Observatorio ASTROLab Mont-Mégantic',
      'Col des Trois-Sommets',
      'Notre-Dame-des-Bois'
    ],
    bestSeason: 'Verano - Otoño',
    officialUrl: 'https://darksky.org/places/mont-megantic-dark-sky-reserve/',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
  },

  // --- OCEANÍA & ÁFRICA & ASIA ---
  {
    id: 'ds-aoraki-mackenzie',
    name: 'Aoraki Mackenzie Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Nueva Zelanda',
    region: 'Isla Sur (Canterbury)',
    bortleClass: 1,
    sqm: 21.97,
    designationYear: 2012,
    areaKm2: 4367,
    latitude: -43.7333,
    longitude: 170.1000,
    description: 'Ubicada en la meseta de Mackenzie alrededor del monte Aoraki/Mount Cook. Famosa por sus vistas meridionales del Centro Galáctico, las Nubes de Magallanes y la Aurora Austral sobre lagos turquesa.',
    highlights: [
      'Nubes de Magallanes y Cruz del Sur con nitidez suprema',
      'Posibilidad de fotografiar Auroras Australes',
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
    id: 'ds-namib-rand',
    name: 'NamibRand Nature Reserve Dark Sky Reserve',
    category: 'International Dark Sky Reserve',
    categoryLabel: 'Reserva Internacional de Cielo Oscuro',
    country: 'Namibia',
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
    id: 'ds-iriomote-ishigaki',
    name: 'Iriomote-Ishigaki National Park Dark Sky Park',
    category: 'International Dark Sky Park',
    categoryLabel: 'Parque Internacional de Cielo Oscuro',
    country: 'Japón',
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
  }
];
