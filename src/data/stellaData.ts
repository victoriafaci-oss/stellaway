import { GuideItem, EbookItem, TemplateItem, DigitalTool, StarlightSpot, PlanetaryEnergy, CelestialEvent } from '../types';

export const PLANETARY_ENERGIES: PlanetaryEnergy[] = [
  {
    id: 'mercurio-leo',
    planet: 'Mercurio',
    signOrTransit: 'Mercurio en Leo',
    title: 'Expresión Creativa y Claridad Mental',
    symbol: '☿',
    energySummary: 'Fomenta el liderazgo comunicativo, la pasión por proyectos personales y la valentía para tomar decisiones astronómicas o de vida.',
    astronomicalDetail: 'Mercurio alcanza su máxima elongación oriental a 27.4° del Sol, facilitando su observación en el horizonte oeste tras el atardecer.',
    stargazingRecommendation: 'Excelente momento para iniciar un cuaderno de bitácora o diario de observación astronómica.',
    element: 'Fuego'
  },
  {
    id: 'saturno-piscis',
    planet: 'Saturno',
    signOrTransit: 'Saturno en Piscis',
    title: 'Introspección Profunda y Enfoque Cósmico',
    symbol: '♄',
    energySummary: 'Aporta serenidad, paciencia y estructuración de la intuición. Ayuda a concentrarse pacientemente durante horas al ocular.',
    astronomicalDetail: 'Saturno muestra sus anillos inclinados a 14.2° frente a la constelación de Acuario/Piscis con magnitud +0.5.',
    stargazingRecommendation: 'Dedica la sesión a observar la División de Cassini y las lunas Titán y Encelado.',
    element: 'Agua'
  },
  {
    id: 'jupiter-tauro',
    planet: 'Júpiter',
    signOrTransit: 'Júpiter en Tauro',
    title: 'Abundancia y Conexión con la Naturaleza',
    symbol: '♃',
    energySummary: 'Transmite expansión, estabilidad y disfrute pleno del entorno natural en miradores de montaña.',
    astronomicalDetail: 'Tránsito brillante por la constelación de Tauro, cerca de las Pléyades (M45) con los 4 satélites galileanos alineados.',
    stargazingRecommendation: 'Ideal para sesiones en grupo y observación compartida con prismáticos o telescopios grandes.',
    element: 'Tierra'
  },
  {
    id: 'venus-alba',
    planet: 'Venus',
    signOrTransit: 'Venus Lucero del Alba',
    title: 'Armonía y Sensibilidad Estética',
    symbol: '♀',
    energySummary: 'Despierta la apreciación de la belleza en los detalles del cosmos y estimula la astrofotografía artística.',
    astronomicalDetail: 'Lucero vespertino/matutino resplandeciente con magnitud -4.2, visible justo antes de la salida del Sol.',
    stargazingRecommendation: 'Inmortaliza el crepúsculo dorado junto a paisajes monumentales Starlight.',
    element: 'Aire'
  },
  {
    id: 'marte-geminis',
    planet: 'Marte',
    signOrTransit: 'Marte en Géminis',
    title: 'Dinamismo e Inquietud Científica',
    symbol: '♂',
    energySummary: 'Activa la curiosidad por aprender sobre la composición de los objetos del espacio profundo y astrofísica.',
    astronomicalDetail: 'Disco rojizo de 12.8 segundos de arco que muestra los casquetes polares con filtro rojo/naranja #23A.',
    stargazingRecommendation: 'Prueba la fotografía planetaria mediante captura de video de alta velocidad.',
    element: 'Aire'
  },
  {
    id: 'luna-nueva',
    planet: 'Luna Nueva',
    signOrTransit: 'Fase de Luna Nueva',
    title: 'Máxima Oscuridad y Renovación',
    symbol: '🌑',
    energySummary: 'Momento de siembra interior, silencio estelar y receptividad total al cielo nocturno.',
    astronomicalDetail: '0% de iluminación lunar. Cielo de fondo sin contaminación lumínica natural.',
    stargazingRecommendation: 'Noche cumbre para fotografiar los brazos de la Vía Láctea y nebulosas tenues de magnitud +9.',
    element: 'Agua'
  }
];

export const CELESTIAL_EVENTS: CelestialEvent[] = [
  // --- EVENTOS PRÓXIMOS 2026 - 2027 ---
  {
    id: 'evt-oposicion-saturno',
    title: 'Oposición de Saturno y Máximo Brillo de sus Anillos',
    category: 'visualizacion_planetas',
    categoryLabel: 'Planetas en Oposición',
    date: '8 de Septiembre, 2026',
    startDateISO: '2026-09-08',
    endDateISO: '2026-09-08',
    peakTime: '00:30h AM (Cénit)',
    description: 'Saturno en su punto más cercano a la Tierra. Anillos visibles con máxima nitidez, división de Cassini y sombras tridimensionales de alta definición.',
    bestVisibilityZone: 'Toda la Península Ibérica y Baleares',
    equipmentNeeded: 'Telescopio de 90mm o superior con oculares de 100x-200x',
    isMajor: false
  },
  {
    id: 'evt-alineacion-5p',
    title: 'Alineación Planetaria Quíntuple (Saturno, Júpiter, Marte, Venus, Mercurio)',
    category: 'alineacion',
    categoryLabel: 'Alineación Planetaria',
    date: '28 de Septiembre, 2026',
    startDateISO: '2026-09-28',
    endDateISO: '2026-09-28',
    peakTime: '05:45h AM (Horizonte Este)',
    description: 'Cinco planetas del sistema solar dispuestos en un arco eclíptico visible simultáneamente de este a oeste antes del amanecer.',
    bestVisibilityZone: 'Horizontes despejados hacia el Este y Sur sin obstáculos',
    equipmentNeeded: 'Prismáticos 10x50 / Telescopio campo amplio o a simple vista',
    isMajor: true
  },
  {
    id: 'evt-orionidas-2026',
    title: 'Lluvia de Meteoros Las Oriónidas (Cometa Halley)',
    category: 'lluvia_estrellas',
    categoryLabel: 'Lluvia de Meteoros',
    date: '21 - 22 de Octubre, 2026',
    startDateISO: '2026-10-21',
    endDateISO: '2026-10-22',
    peakTime: '01:00h - 05:30h AM',
    description: 'Meteoros rápidos procedentes de los restos del célebre Cometa 1P/Halley, con estelas ionizadas persistentes en la constelación de Orión.',
    bestVisibilityZone: 'Cielos limpios y zonas rurales Starlight',
    equipmentNeeded: 'A simple vista (Tumbona y abrigo)',
    isMajor: false
  },
  {
    id: 'evt-superluna-2026',
    title: 'Superluna Llena del Cazador (Perigeo Máximo)',
    category: 'fase_lunar',
    categoryLabel: 'Evento Lunar',
    date: '25 de Octubre, 2026',
    startDateISO: '2026-10-25',
    endDateISO: '2026-10-25',
    peakTime: '21:15h UTC',
    description: 'La Luna llena en perigeo más cercana del otoño se verá un 14% más grande y un 30% más brillante de lo habitual sobre el horizonte este.',
    bestVisibilityZone: 'Salida sobre el mar en el horizonte Este',
    equipmentNeeded: 'Cámara fotográfica con teleobjetivo 300mm+ o prismáticos',
    isMajor: false
  },
  {
    id: 'evt-leonidas-2026',
    title: 'Lluvia de Meteoros Las Leónidas',
    category: 'lluvia_estrellas',
    categoryLabel: 'Lluvia de Meteoros',
    date: '17 - 18 de Noviembre, 2026',
    startDateISO: '2026-11-17',
    endDateISO: '2026-11-18',
    peakTime: '03:00h - 06:00h AM',
    description: 'Meteoros hiperveloces (71 km/s) procedentes del cometa Tempel-Tuttle con bolas de fuego verdosas características.',
    bestVisibilityZone: 'Zonas despejadas con horizonte noreste limpio',
    equipmentNeeded: 'A simple vista',
    isMajor: false
  },
  {
    id: 'evt-geminidas-2026',
    title: 'Gran Lluvia de Estrellas Las Gemínidas (Reina del Invierno)',
    category: 'lluvia_estrellas',
    categoryLabel: 'Lluvia de Meteoros',
    date: '13 - 14 de Diciembre, 2026',
    startDateISO: '2026-12-13',
    endDateISO: '2026-12-14',
    peakTime: '23:00h - 04:30h AM',
    description: 'La lluvia de meteoros más prolífica del año con tasas de hasta 120-150 meteoros/hora procedentes del asteroide (3200) Phaethon.',
    bestVisibilityZone: 'Zonas de montaña Starlight y reservas de cielo oscuro',
    equipmentNeeded: 'Ropa térmica y observación panorámica a simple vista',
    isMajor: true
  },
  {
    id: 'evt-cuadrantidas-2027',
    title: 'Lluvia de Meteoros Las Cuadrántidas 2027',
    category: 'lluvia_estrellas',
    categoryLabel: 'Lluvia de Meteoros',
    date: '3 - 4 de Enero, 2027',
    startDateISO: '2027-01-03',
    endDateISO: '2027-01-04',
    peakTime: '02:00h - 06:00h AM',
    description: 'Intenso pico de actividad con bólidos brillantes en el cielo invernal previo al amanecer.',
    bestVisibilityZone: 'Zonas altas sin niebla ni contaminación urbana',
    equipmentNeeded: 'A simple vista y equipo de abrigo invernal',
    isMajor: false
  },
  {
    id: 'evt-liridas-2027',
    title: 'Lluvia de Estrellas Las Líridas 2027',
    category: 'lluvia_estrellas',
    categoryLabel: 'Lluvia de Meteoros',
    date: '22 - 23 de Abril, 2027',
    startDateISO: '2027-04-22',
    endDateISO: '2027-04-23',
    peakTime: '01:30h - 05:00h AM',
    description: 'Partículas de polvo del cometa Thatcher (C/1861 G1) cruzando la atmósfera cerca de la estrella Vega.',
    bestVisibilityZone: 'Cielos oscuros con cénit despejado',
    equipmentNeeded: 'A simple vista',
    isMajor: false
  },
  {
    id: 'evt-eclipse-2027',
    title: 'El Gran Eclipse del Siglo 2027 (Andalucía & Gibraltar)',
    category: 'eclipse',
    categoryLabel: 'Eclipse Solar Total del Siglo',
    date: '2 de Agosto, 2027',
    startDateISO: '2027-08-02',
    endDateISO: '2027-08-02',
    peakTime: '10:10 UTC (Mediodía)',
    description: 'El eclipse total de Sol más largo del siglo XXI en Europa y norte de África. Más de 4 minutos y medio de totalidad en Tarifa, Cádiz, Costa del Sol, Málaga, Granada y Estrecho de Gibraltar.',
    bestVisibilityZone: 'Andalucía: Cádiz, Tarifa, Costa del Sol, Málaga, Granada, Almería, Ceuta y Melilla',
    equipmentNeeded: 'Gafas de eclipse ISO 12312-2 / Telescopio con filtro solar',
    isMajor: true
  },
  {
    id: 'evt-perseidas-2027',
    title: 'Lluvia de Estrellas Las Perseidas 2027 (Lágrimas de San Lorenzo)',
    category: 'lluvia_estrellas',
    categoryLabel: 'Lluvia de Meteoros',
    date: '11 - 13 de Agosto, 2027',
    startDateISO: '2027-08-11',
    endDateISO: '2027-08-13',
    peakTime: '02:00h - 05:30h AM',
    description: 'El evento estival por excelencia con hasta 100 meteoros/hora procedentes del cometa 109P/Swift-Tuttle en condiciones de luna favorable.',
    bestVisibilityZone: 'Miradores astronómicos y costas oscuras',
    equipmentNeeded: 'A simple vista (Tumbona y esterilla)',
    isMajor: true
  },

  // --- EVENTOS PASADOS (HISTORIAL ARCHIVADO) ---
  {
    id: 'evt-perseidas-2026',
    title: 'Lluvia de Estrellas Las Perseidas 2026 (Lágrimas de San Lorenzo)',
    category: 'lluvia_estrellas',
    categoryLabel: 'Lluvia de Meteoros',
    date: '11 - 13 de Agosto, 2026',
    startDateISO: '2026-08-11',
    endDateISO: '2026-08-13',
    peakTime: '02:00h - 05:00h AM',
    description: 'Tasa horaria cenital (THZ) de hasta 110 meteoros/hora procedentes del cometa 109P/Swift-Tuttle.',
    bestVisibilityZone: 'Cielos oscuros Bortle 1-3 sin luces urbanas',
    equipmentNeeded: 'A simple vista (Tumbona y abrigo recomendable)',
    isMajor: false
  },
  {
    id: 'evt-eclipse-2026',
    title: 'Gran Eclipse Solar Total 2026 (España)',
    category: 'eclipse',
    categoryLabel: 'Eclipse Solar Total',
    date: '12 de Agosto, 2026',
    startDateISO: '2026-08-12',
    endDateISO: '2026-08-12',
    peakTime: '19:32 UTC (Crepúsculo)',
    description: 'El evento astronómico del siglo en la Península Ibérica. La luna cubrió el 100% del disco solar creando un anillo de diamante visible en Castellón y el Arco Mediterráneo.',
    bestVisibilityZone: 'Arco Mediterráneo, Castellón, Teruel y Baleares',
    equipmentNeeded: 'Gafas homologadas ISO 12312-2 / Filtro Solar Mylar',
    isMajor: true
  }
];

export const GUIDES: GuideItem[] = [
  {
    id: 'guias-observacion',
    title: 'Guías de Observación',
    category: 'Manuales y Mapas',
    description: 'Manuales detallados para identificar constelaciones, planetas y fenómenos celestes en tiempo real.',
    popular: true,
    icon: 'visibility',
    actionText: 'EXPLORAR',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8pjItWu5o9YPTEPus8qFJ7Krd-JicIn_-X3XcZJ2OVULs3UwwmEoHYHdGxYCmiiWxySC_MxpS17taJqX3XQFrN1z2Ohr_HwswZbUnrRaijnx4aOSP51FZ4Z8gL5VCNLWcjuTr_ah3q91dL0vC1Vvd7o-68Z59bSriUonjDvTHNZWDWfFq1v2Ji0q8EU_qNioAeCdIqFmxvYePNHvUNX8qj-RsFf4h90SlSFziHZevx2YjvMQfy9HZPw',
    content: {
      intro: 'Guía práctica para planificar tus noches de observación en la costa del Mediterráneo y el interior castellonense.',
      highlights: [
        'Identificación de constelaciones de verano: El Triángulo de Verano (Vega, Deneb, Altair).',
        'Cielo nocturno de agosto: La Vía Láctea visible a simple vista en zonas Bortle 2-3.',
        'Localización de planetas: Saturno y sus anillos con telescopios a partir de 70mm.',
        'Preparación específica para la franja de totalidad del Eclipse Solar Total 2026.'
      ],
      steps: [
        'Aclimata tus ojos a la oscuridad durante al menos 20 minutos sin pantallas blancas.',
        'Utiliza luz roja (activando el modo Visión Nocturna en StellaWay).',
        'Usa un mapa estelar orientado con el Norte cardinal.',
        'Comienza con objetos brillantes antes de buscar nebulosas tenues.'
      ],
      tips: 'En verano, las mejores horas de seeing en Castellón son entre las 23:30h y las 03:00h.'
    }
  },
  {
    id: 'herramientas-digitales',
    title: 'Herramientas Digitales',
    category: 'Software y Simuladores',
    description: 'Software recomendado, calculadoras astronómicas y simuladores del cielo profundo para planificar tus sesiones.',
    icon: 'devices',
    actionText: 'ACCEDER',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBj5o1b_7iQIqiNW7xGuY8DdxOcOdXva5C2ly4IztIkaD6xpJWhP43JirMEMeiVgf1AC0nVdQ0TBoHX5zJ15G67tutAX0AvBwrbfMjZnghCWmNI_0zWOfOZEUU37Dd6E0haMH4Q146BCJS8KDl9fNwrszAJn8wTlbvtiKMxAbZ4CYztj52i4_tWUofmxf9viKZjoMjCyRiuj61ix_EaikY4N441QG-yiSjORxtK_4lZSFgOTo2dznDn-w',
    content: {
      intro: 'Suite interactiva de calculadoras astronómicas y simuladores digitales integrados en StellaWay.',
      highlights: [
        'Calculadora de aumento de ocular (Distancia Focal / Ocular)',
        'Simulador de campo de visión para astrofotografía (Sensor + Objetivo)',
        'Previsión de cobertura nubosa y Seeing en 3 capas',
        'Simulador de eclipse solar total en Castellón'
      ]
    }
  }
];

export const EBOOKS: EbookItem[] = [
  {
    id: 'ebook-1',
    title: 'Astrofísica Práctica para Observadores',
    author: 'Dr. Marc Vilar',
    pages: 184,
    format: 'PDF / EPUB',
    description: 'Comprende la física de las estrellas, supernovas y agujeros negros mientras los observas desde tu telescopio.'
  },
  {
    id: 'ebook-2',
    title: 'Guía del Gran Eclipse Solar 2026',
    author: 'Equipo StellaWay Starlight',
    pages: 96,
    format: 'PDF',
    description: 'Todo lo que necesitas saber sobre el eclipse total del 12 de agosto de 2026: tiempos de totalidad, filtros solares y mejores miradores.'
  },
  {
    id: 'ebook-3',
    title: 'Iniciación a la Astrofotografía de Paisaje',
    author: 'Elena Sanchis',
    pages: 142,
    format: 'PDF / EPUB',
    description: 'Aprende a capturar la Vía Láctea con tu cámara reflex o mirrorless paso a paso.'
  }
];

export const TEMPLATES: TemplateItem[] = [
  {
    id: 'tpl-1',
    title: 'Cuaderno de Campo Nocturno',
    description: 'Plantilla completa con mapa de coordenadas, escala Bortle, índice de Seeing y boceto de ocular.',
    fields: ['Fecha y Hora', 'Lugar de Observación', 'Condiciones Atmosféricas', 'Objeto Messier/NGC', 'Ocular y Aumento', 'Dibujo del Campo'],
    type: 'logbook'
  },
  {
    id: 'tpl-2',
    title: 'Checklist de Salida de Observación',
    description: 'Lista imprescindible para no olvidar pesas, alineación polar, baterías ni abrigo térmico.',
    fields: ['Telescopio y Montura', 'Oculares y Barlow', 'Lámpara de Luz Roja', 'Baterías y Alimentación', 'Filtros Solares/UHC'],
    type: 'checklist'
  },
  {
    id: 'tpl-3',
    title: 'Hoja de Captura de Astrofotografía',
    description: 'Registro de tomas light, dark, flat y bias con tiempos de exposición y ganancia ISO.',
    fields: ['Objeto', 'Tiempo Exposición', 'Nº de Lights', 'Nº de Darks', 'Temperatura Sensor', 'Ganancia/ISO'],
    type: 'astrophotography'
  }
];

export const DIGITAL_TOOLS: DigitalTool[] = [
  {
    id: 'tool-1',
    name: 'Calculadora de Aumentos y Campo Visión',
    description: 'Calcula los aumentos exactos y pupila de salida de tus oculares.',
    type: 'calculator',
    icon: 'calculate'
  },
  {
    id: 'tool-2',
    name: 'Simulador de Trayectoria del Eclipse 2026',
    description: 'Visualiza la franja de totalidad y hora exacta según tu posición.',
    type: 'planetarium',
    icon: 'flare'
  },
  {
    id: 'tool-3',
    name: 'Meteorología Estelar en Tiempo Real',
    description: 'Previsión de nubes bajas, medias, altas y transparencia del aire.',
    type: 'weather',
    icon: 'air'
  }
];

export const STARLIGHT_SPOTS: StarlightSpot[] = [
  // 1. ESPAÑA - CERTIFICADOS STARLIGHT
  {
    id: 'spot-1',
    name: 'Observatorio de Penyagolosa',
    region: 'Castellón (Parque Natural Penyagolosa)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 2,
    sqm: 21.85,
    elevationMeters: 1280,
    latitude: 40.2241,
    longitude: -0.3524,
    description: 'Uno de los cielos más limpios y oscuros de la Comunitat Valenciana, certificado como Destino Turístico Starlight.',
    facilities: ['Parking habilitado', 'Mesas de observación', 'Paneles informativos', 'Aparcamiento autocaravanas'],
    bestSeason: 'Primavera - Verano - Otoño',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'spot-2',
    name: 'Mirador de Culla Starlight',
    region: 'Castellón (Alt Maestrat)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 3,
    sqm: 21.62,
    elevationMeters: 1120,
    latitude: 40.3375,
    longitude: -0.1658,
    description: 'Pueblo histórico de Culla, rodeado de campos con horizonte despejado en 360 grados para astrofotografía.',
    facilities: ['Hoteles rurales Starlight', 'Visitas guiadas', 'Restaurantes astronómicos'],
    bestSeason: 'Todo el año',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'spot-3',
    name: 'Centro Galáctica y Javalambre',
    region: 'Teruel (Sierra de Javalambre)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 1,
    sqm: 21.98,
    elevationMeters: 1950,
    latitude: 40.0412,
    longitude: -1.0261,
    description: 'Epicentro nacional de divulgación y observación astronómica profesional, junto al Observatorio Astrofísico de Javalambre.',
    facilities: ['Observatorio visitante', 'Cúpulas semiautomáticas', 'Cursos de astrofotografía'],
    bestSeason: 'Verano',
    imageUrl: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'spot-la-palma',
    name: 'Reserva Starlight Isla de La Palma',
    region: 'La Palma (Canarias)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 1,
    sqm: 21.99,
    elevationMeters: 2426,
    latitude: 28.7636,
    longitude: -17.8947,
    description: 'Referente mundial para la observación astronómica con la Ley del Cielo. Sede del Gran Telescopio Canarias (GTC).',
    facilities: ['Red de miradores astronómicos', 'Telescopios profesionales', 'Rutas guiadas Starlight'],
    bestSeason: 'Todo el año',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'spot-teide',
    name: 'Parque Nacional del Teide',
    region: 'Tenerife (Canarias)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 1,
    sqm: 21.95,
    elevationMeters: 2350,
    latitude: 28.2723,
    longitude: -16.6425,
    description: 'Destino Starlight de primera clase sobre el mar de nubes del piso alpino con visibilidad extraordinaria.',
    facilities: ['Observatorio del Teide', 'Aparcamientos de montaña', 'Rutas nocturnas'],
    bestSeason: 'Primavera - Verano',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'spot-montsec',
    name: 'Parc Astronòmic Montsec (PAM)',
    region: 'Lleida (Cataluña)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 2,
    sqm: 21.78,
    elevationMeters: 820,
    latitude: 42.0247,
    longitude: 0.7294,
    description: 'Reserva y Destino Turístico Starlight con planetario 3D 3DOpen y telescopio de investigación de 80cm.',
    facilities: ['Planetario 3D', 'Aulas taller', 'Telescopios interactivos'],
    bestSeason: 'Todo el año',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-sierra-morena',
    name: 'Reserva Starlight Sierra Morena',
    region: 'Córdoba / Jaén / Sevilla (Andalucía)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 2,
    sqm: 21.70,
    elevationMeters: 750,
    latitude: 38.1250,
    longitude: -4.8210,
    description: 'La reserva Starlight continental más grande del mundo, abarcando más de 400 km de sierras sin contaminación lumínica.',
    facilities: ['Red de 35 miradores', 'Alojamientos starlight', 'Senda nocturna'],
    bestSeason: 'Otoño - Invierno - Primavera',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-cuenca',
    name: 'Serranía de Cuenca Starlight',
    region: 'Cuenca (Castilla-La Mancha)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 2,
    sqm: 21.80,
    elevationMeters: 1400,
    latitude: 40.2312,
    longitude: -1.9845,
    description: 'Cielos cristalinos protegidos entre pinares y hoces cársticas de la Serranía de Cuenca.',
    facilities: ['Mirador del Tormo', 'Paneles explicativos', 'Aparcamiento'],
    bestSeason: 'Primavera - Verano',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-gudar',
    name: 'Comarca Gúdar-Javalambre Starlight',
    region: 'Teruel (Aragón)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 1,
    sqm: 21.90,
    elevationMeters: 1600,
    latitude: 40.3541,
    longitude: -0.6832,
    description: 'Destino astronómico de alta montaña en los montes de Teruel con aire sumamente seco e idóneo para astrofotografía.',
    facilities: ['Red de senderos nocturnos', 'Puntos de agua', 'Información en vivo'],
    bestSeason: 'Verano - Otoño',
    imageUrl: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-trevinca',
    name: 'A Veiga - Trevinca Starlight',
    region: 'Ourense (Galicia)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 2,
    sqm: 21.75,
    elevationMeters: 1350,
    latitude: 42.2478,
    longitude: -7.0258,
    description: 'Primer destino Starlight de Galicia en el Macizo de Trevinca con la cumbre más alta de la comunidad.',
    facilities: ['Centro astronómico A Veiga', 'Miradores de Taboadela', 'Casa rural estelar'],
    bestSeason: 'Primavera - Verano',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-monfrague',
    name: 'Reserva Starlight Parque Nacional Monfragüe',
    region: 'Cáceres (Extremadura)',
    country: 'España',
    certified: true,
    spotType: 'certified',
    bortleClass: 2,
    sqm: 21.68,
    elevationMeters: 450,
    latitude: 39.8458,
    longitude: -6.0412,
    description: 'Combinación perfecta entre ornitología diurna y turismo astronómico nocturno con horizonte sur despejado.',
    facilities: ['Observatorio de Torrejón el Rubio', 'Mirador del Salto del Gitano'],
    bestSeason: 'Primavera - Otoño - Invierno',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
  },

  // 2. ESPAÑA - ÓPTIMOS NO CERTIFICADOS (PUNTOS LIBRES ÓPTIMOS Y ÁREAS ACCESIBLES)
  {
    id: 'spot-peniscola-castillo',
    name: 'Peñíscola - Castillo del Papa Luna y Baluarte',
    region: 'Castellón (Baix Maestrat - Peñíscola)',
    country: 'España',
    certified: false,
    spotType: 'optimal_free',
    bortleClass: 4,
    sqm: 20.90,
    elevationMeters: 64,
    latitude: 40.3588,
    longitude: 0.4072,
    description: 'Área libre e icónica en la península rocosa de Peñíscola. El Baluarte de Santa María, la Plaza de Armas del Castillo y los acantilados marinos ofrecen vistas despejadas de 180° sobre el horizonte del Mar Mediterráneo.',
    subAreas: ['Castillo del Papa Luna (Plaza de Armas)', 'Baluarte y Batería de Santa María', 'Faro de Peñíscola', 'Paseo de los Acantilados del Istmo'],
    facilities: ['Acceso asfaltado y peatonal', 'Parking a 200m en el Puerto', 'Banquillos y miradores', 'Restaurantes y cafeterías cercanas'],
    bestSeason: 'Todo el año (Especialmente Primavera, Verano y Otoño)',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'spot-peniscola-irta',
    name: 'Peñíscola - Sierra de Irta y Ermita de Sant Antoni',
    region: 'Castellón (Parque Natural Serra d\'Irta - Peñíscola)',
    country: 'España',
    certified: false,
    spotType: 'optimal_free',
    bortleClass: 2,
    sqm: 21.72,
    elevationMeters: 320,
    latitude: 40.3295,
    longitude: 0.3658,
    description: 'Paraje natural virgen a pocos minutos de Peñíscola. La Ermita de Sant Antoni de Pàdua y el Mirador de la Mola proporcionan una oscuridad excelente sin contaminación lumínica sobre el mar y las cumbres.',
    subAreas: ['Ermita de Sant Antoni de Pàdua', 'Mirador de la Mola', 'Torre Badum (Atalaya Costera)', 'Cala Argilaga y Playa de la Basseta'],
    facilities: ['Pista forestal apta para turismos', 'Parking amplio en la Ermita', 'Mesas de picnic', 'Paneles informativos del Parque Natural'],
    bestSeason: 'Verano - Primavera - Otoño',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'spot-peniscola-playa',
    name: 'Peñíscola - Playa Norte y Marjal',
    region: 'Castellón (Peñíscola Costa)',
    country: 'España',
    certified: false,
    spotType: 'optimal_free',
    bortleClass: 4,
    sqm: 20.60,
    elevationMeters: 5,
    latitude: 40.3721,
    longitude: 0.4012,
    description: 'Ubicación llana y 100% accesible en el tramo norte de la Playa de Peñíscola y la Marjal. Perfecta para observación con telescopio portátil o tumbona a pie de arena mirando al horizonte oriental.',
    subAreas: ['Playa Norte (Tramo Dunas/Marjal)', 'Paseo de la Marjal de Peñíscola', 'Espigón del Puerto'],
    facilities: ['Acceso 100% libre y adaptado', 'Aparcamiento en el paseo marítimo', 'Iluminación atenuada tras la medianoche'],
    bestSeason: 'Noches de Verano y Primavera',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-4',
    name: 'Desierto de las Palmas y Bartolo',
    region: 'Benicàssim / Castellón',
    country: 'España',
    certified: false,
    spotType: 'optimal_free',
    bortleClass: 4,
    sqm: 20.85,
    elevationMeters: 450,
    latitude: 40.0821,
    longitude: 0.0412,
    description: 'Mirador de fácil acceso muy cercano a la costa mediterránea, óptimo para observación nocturna espontánea y vistas sobre el mar.',
    facilities: ['Acceso asfaltado', 'Miradores fotográficos'],
    bestSeason: 'Primavera - Verano',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-cabo-gata',
    name: 'Cabo de Gata - Mónsul y Genoveses',
    region: 'Almería (Andalucía)',
    country: 'España',
    certified: false,
    spotType: 'optimal_free',
    bortleClass: 3,
    sqm: 21.45,
    elevationMeters: 20,
    latitude: 36.7312,
    longitude: -2.1458,
    description: 'Playas vírgenes y acantilados volcánicos en Almería sin contaminación lumínica sobre el horizonte marítimo del Mediterráneo.',
    facilities: ['Aparcamiento natural', 'Accesos a pie'],
    bestSeason: 'Verano - Otoño',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-picos-europa',
    name: 'Picos de Europa - Lago Enol y Sotres',
    region: 'Asturias / Cantabria',
    country: 'España',
    certified: false,
    spotType: 'optimal_free',
    bortleClass: 2,
    sqm: 21.65,
    elevationMeters: 1100,
    latitude: 43.2712,
    longitude: -4.9812,
    description: 'Valles alpinos y cumbres calizas en el norte de España con velos nocturnos oscuros alejados de núcleos urbanos.',
    facilities: ['Refugios de montaña', 'Senderos señalizados'],
    bestSeason: 'Verano',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-ordesa',
    name: 'Parque Nacional de Ordesa y Monte Perdido',
    region: 'Huesca (Aragón)',
    country: 'España',
    certified: false,
    spotType: 'optimal_free',
    bortleClass: 2,
    sqm: 21.82,
    elevationMeters: 1750,
    latitude: 42.6312,
    longitude: -0.0512,
    description: 'Cielos de alta montaña pirenaica con atmósfera de escasa humedad relativa e ideal para capturas de cielo profundo.',
    facilities: ['Refugio de Góriz', 'Aparcamiento en Torla'],
    bestSeason: 'Verano - Otoño',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spot-bardenas',
    name: 'Bardenas Reales de Navarra',
    region: 'Navarra',
    country: 'España',
    certified: false,
    spotType: 'optimal_free',
    bortleClass: 3,
    sqm: 21.30,
    elevationMeters: 380,
    latitude: 42.1812,
    longitude: -1.4512,
    description: 'Paraje semidesértico impresionante con formaciones de arcilla y horizontes limpios de luces urbanas.',
    facilities: ['Pistas de tierra transitables', 'Puntos de información'],
    bestSeason: 'Primavera - Otoño',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
  },

  // 3. PORTUGAL - CERTIFICADOS Y ÓPTIMOS
  {
    id: 'spot-alqueva',
    name: 'Reserva Starlight Dark Sky Alqueva',
    region: 'Alentejo',
    country: 'Portugal',
    certified: true,
    spotType: 'certified',
    bortleClass: 1,
    sqm: 21.92,
    elevationMeters: 220,
    latitude: 38.2120,
    longitude: -7.4812,
    description: 'El primer sitio del mundo certificado como Starlight Tourism Destination a orillas del gran lago Alqueva.',
    facilities: ['Observatorio de Cumeada', 'Paseos nocturnos en barco', 'Telescopios de alta gama'],
    bestSeason: 'Todo el año',
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'spot-geres',
    name: 'Parque Nacional Peneda-Gerês',
    region: 'Norte de Portugal',
    country: 'Portugal',
    certified: false,
    spotType: 'optimal_free',
    bortleClass: 2,
    sqm: 21.60,
    elevationMeters: 900,
    latitude: 41.7312,
    longitude: -8.1512,
    description: 'Sierra montañosa atlántica protegida con amplias áreas oscuras para astrónomos aficionados.',
    facilities: ['Ecoalojamientos', 'Aparcamientos de montaña'],
    bestSeason: 'Primavera - Verano',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
  },

  // 4. CHILE & INTERNACIONAL
  {
    id: 'spot-atacama',
    name: 'Desierto de Atacama (San Pedro)',
    region: 'Antofagasta / Atacama',
    country: 'Chile',
    certified: true,
    spotType: 'certified',
    bortleClass: 1,
    sqm: 22.00,
    elevationMeters: 2400,
    latitude: -22.9087,
    longitude: -68.1997,
    description: 'La capital mundial indiscutible de la astronomía. Cielo más seco del planeta con más de 300 noches despejadas al año.',
    facilities: ['Tours astronómicos en vivo', 'Observatorios ALMA / Paranal', 'Telescopios gigantes'],
    bestSeason: 'Todo el año',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    id: 'spot-mauna-kea',
    name: 'Observatorio Mauna Kea',
    region: 'Hawái',
    country: 'EE.UU.',
    certified: true,
    spotType: 'certified',
    bortleClass: 1,
    sqm: 21.98,
    elevationMeters: 4207,
    latitude: 19.8207,
    longitude: -155.4681,
    description: 'Cumbre volcánica pacífica por encima del 40% de la atmósfera terrestre, sede de los telescopios Keck.',
    facilities: ['Visitor Information Station (VIS)', 'Guías de montaña'],
    bestSeason: 'Verano - Otoño',
    imageUrl: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=800&q=80'
  }
];


export const AMAZON_EQUIPMENT = [
  {
    id: 'eq-1',
    title: 'Celestron AstroMaster 130EQ',
    category: 'Telescopios Reflectores',
    rating: '4.8 ⭐',
    price: '289,00 €',
    description: 'Telescopio reflector ecuatorial de 130mm ideal para principiantes y observación planetaria y de espacio profundo.',
    image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=500&q=80',
    amazonUrl: 'https://www.amazon.es/s?k=telescopio+celestron+astromaster+130eq'
  },
  {
    id: 'eq-2',
    title: 'Binoculares Celestron SkyMaster 15x70',
    category: 'Prismáticos Astronómicos',
    rating: '4.7 ⭐',
    price: '119,50 €',
    description: 'Enorme apertura de 70mm para captar campos amplios de la Vía Láctea y cráteres lunares.',
    image: 'https://images.unsplash.com/photo-1527842891421-42eec6e703ea?auto=format&fit=crop&w=500&q=80',
    amazonUrl: 'https://www.amazon.es/s?k=celestron+skymaster+15x70'
  },
  {
    id: 'eq-3',
    title: 'Gafas Homologadas Eclipse Solar ISO 12312-2',
    category: 'Protección Eclipse 2026',
    rating: '4.9 ⭐',
    price: '14,99 € (Pack 5u)',
    description: 'Filtro polímero solar seguro y certificado CE / ISO para la observación segura del Eclipse Total 2026.',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=500&q=80',
    amazonUrl: 'https://www.amazon.es/s?k=gafas+eclipse+solar+iso+12312-2'
  },
  {
    id: 'eq-4',
    title: 'Linterna Frontal de Luz Roja Estelar LED',
    category: 'Accesorios Nocturnos',
    rating: '4.8 ⭐',
    price: '18,90 €',
    description: 'Luz roja regulable con modo suave para preservar la visión nocturna en el campo.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=500&q=80',
    amazonUrl: 'https://www.amazon.es/s?k=linterna+luz+roja+astronomia'
  }
];
