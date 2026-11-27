import binocularsImg from '../assets/images/shop_binoculars_astro_1795767976022.jpg';
import telescopeBeginnerImg from '../assets/images/shop_telescope_beginner_1795767977603.jpg';
import telescopeProImg from '../assets/images/shop_telescope_pro_astro_1795767978207.jpg';
import starTrackerImg from '../assets/images/shop_star_tracker_photo_1795767977498.jpg';
import eclipseAccImg from '../assets/images/shop_eclipse_accessories_1795767978297.jpg';

export type ShopLevel = 'iniciacion' | 'aficionado' | 'profesional';

export type ShopCategory =
  | 'telescopios'
  | 'prismaticos'
  | 'astrofotografia'
  | 'eclipses_auroras'
  | 'accesorios';

export interface ShopProduct {
  id: string;
  title: string;
  level: ShopLevel;
  category: ShopCategory;
  specs: string;
  description: string;
  recommendedFor: string;
  image: string;
  /**
   * Pega aquí tu enlace oficial de Afiliada de Amazon (ej: "https://amzn.to/xxxxxxx")
   * cuando tengas el producto elegido. Si está vacío, el botón abre la búsqueda en Amazon.
   */
  amazonUrl?: string;
  searchQuery: string;
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 'prod-eclipse-glasses-iso',
    title: 'Gafas Filtro Solar ISO 12312-2 Homologadas',
    level: 'iniciacion',
    category: 'eclipses_auroras',
    specs: 'Norma ISO 12312-2 · Bloqueo UV/IR 100%',
    description:
      'Imprescindibles para observar con total seguridad las fases parciales del Eclipse Solar Total 2026–2027 y manchas solares sin dañar la vista.',
    recommendedFor: 'Eclipse Solar 2026–2027',
    image: eclipseAccImg,
    searchQuery: 'gafas eclipse solar ISO 12312-2 homologadas',
  },
  {
    id: 'prod-red-headlamp',
    title: 'Linterna Frontal LED Luz Roja Astronómica (~650 nm)',
    level: 'iniciacion',
    category: 'accesorios',
    specs: 'Luz roja regulable · Manos libres · IPX4',
    description:
      'Ilumina tus mapas estelares y el trípode sin romper la adaptación nocturna de tus pupilas en reservas Starlight o DarkSky.',
    recommendedFor: 'Cualquier salida nocturna',
    image: eclipseAccImg,
    searchQuery: 'linterna frontal luz roja astronomia regulable',
  },
  {
    id: 'prod-binoculars-15x70',
    title: 'Prismáticos Astronómicos 15x70 BaK-4 + Adaptador Trípode',
    level: 'iniciacion',
    category: 'prismaticos',
    specs: 'Aumento 15x · Apertura 70 mm · Prismas BaK-4',
    description:
      'El punto de entrada más agradecido para recorrer la Vía Láctea, Pléyades, Galaxia de Andrómeda y cráteres lunares desde miradores oscuros.',
    recommendedFor: 'Vía Láctea y cielo amplio',
    image: binocularsImg,
    searchQuery: 'prismaticos astronomicos 15x70 BaK-4 adaptador tripode',
  },
  {
    id: 'prod-telescope-refractor-90',
    title: 'Telescopio Refractor 90/900 Altazimutal con Trípode',
    level: 'iniciacion',
    category: 'telescopios',
    specs: 'Apertura 90 mm · Focal 900 mm · Oculares 25/10 mm',
    description:
      'Ligero, fácil de alinear en minutos y sin colimación. Ideal para observar la Luna, los anillos de Saturno y las lunas galileanas de Júpiter.',
    recommendedFor: 'Luna, planetas y familias',
    image: telescopeBeginnerImg,
    searchQuery: 'telescopio refractor 90/900 altazimutal',
  },
  {
    id: 'prod-binoculars-10x50-ed',
    title: 'Prismáticos Gran Campo 10x50 Óptica ED',
    level: 'aficionado',
    category: 'prismaticos',
    specs: 'Aumento 10x · Lentes ED · Campo 6.5°',
    description:
      'Observación cómoda a pulso sin trípode obligatorio. Excelente transmisión luminosa para cometas, cúmulos abiertos y auroras boreales.',
    recommendedFor: 'Viajes, cometas y auroras',
    image: binocularsImg,
    searchQuery: 'prismaticos 10x50 astronomia ED gran campo',
  },
  {
    id: 'prod-dobson-150',
    title: 'Telescopio Dobsonian 150/750 de Mesa o Suelo',
    level: 'aficionado',
    category: 'telescopios',
    specs: 'Espejo 150 mm · Focal f/5 · Buscador punto rojo',
    description:
      'Gran captación de luz en formato portátil para adentrarse en nebulosas, cúmulos globulares y galaxias bajo cielos Bortle 1–3.',
    recommendedFor: 'Cielo profundo visual',
    image: telescopeBeginnerImg,
    searchQuery: 'telescopio dobson 150/750 newton',
  },
  {
    id: 'prod-star-tracker-equatorial',
    title: 'Montura Rastreadora Portátil (Star Tracker) + Cabezal Polar',
    level: 'aficionado',
    category: 'astrofotografia',
    specs: 'Carga útil 5 kg · Seguimiento sideral · USB-C',
    description:
      'Compensa la rotación terrestre para fotografiar la Vía Láctea y arcos de auroras con cámara DSLR o sin espejo en exposiciones largas sin trazos.',
    recommendedFor: 'Astrofotografía de paisaje',
    image: starTrackerImg,
    searchQuery: 'star tracker montura ecuatorial portatil astrofotografia',
  },
  {
    id: 'prod-apo-triplet-pro',
    title: 'Refractor Apocromático Triplete ED + Montura GoTo Ecuatorial',
    level: 'profesional',
    category: 'telescopios',
    specs: 'Óptica triplete FPL-53 · Montura GoTo motorizada',
    description:
      'Corrección cromática de referencia y seguimiento automatizado de precisión para observación avanzada y captura de cielo profundo.',
    recommendedFor: 'Astrofotografía avanzada',
    image: telescopeProImg,
    searchQuery: 'telescopio refractor apocromatico triplete montura goto',
  },
  {
    id: 'prod-pro-carbon-tripod-tracker',
    title: 'Sistema de Seguimiento Dual + Trípode de Carbono Alta Rigidez',
    level: 'profesional',
    category: 'astrofotografia',
    specs: 'Fibra carbono · Autoguiado ST-4 · Nivelación fina',
    description:
      'Estabilidad milimétrica frente al viento en cumbres y reservas oscuras para teleobjetivos luminosos o refractores compactos.',
    recommendedFor: 'Cumbres, viento y teleobjetivos',
    image: starTrackerImg,
    searchQuery: 'tripode carbono astrofotografia cabezal ecuatorial',
  },
];
