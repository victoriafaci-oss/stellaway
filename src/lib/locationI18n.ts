import { SupportedLanguage, normalizeLanguage } from './i18nHelpers';
import type { RegionImageInfo } from './regionImages';

const normalizeToken = (str: string): string =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

export const COUNTRY_NAMES_I18N: Record<string, Record<SupportedLanguage, string>> = {
  'España': {
    es: 'España',
    en: 'Spain',
    fr: 'Espagne',
    pt: 'Espanha',
    it: 'Spagna',
    de: 'Spanien',
  },
  Portugal: {
    es: 'Portugal',
    en: 'Portugal',
    fr: 'Portugal',
    pt: 'Portugal',
    it: 'Portogallo',
    de: 'Portugal',
  },
  'Portugal / España': {
    es: 'Portugal / España',
    en: 'Portugal / Spain',
    fr: 'Portugal / Espagne',
    pt: 'Portugal / Espanha',
    it: 'Portogallo / Spagna',
    de: 'Portugal / Spanien',
  },
  Andorra: {
    es: 'Andorra',
    en: 'Andorra',
    fr: 'Andorre',
    pt: 'Andorra',
    it: 'Andorra',
    de: 'Andorra',
  },
  Francia: {
    es: 'Francia',
    en: 'France',
    fr: 'France',
    pt: 'França',
    it: 'Francia',
    de: 'Frankreich',
  },
  Irlanda: {
    es: 'Irlanda',
    en: 'Ireland',
    fr: 'Irlande',
    pt: 'Irlanda',
    it: 'Irlanda',
    de: 'Irland',
  },
  'Reino Unido': {
    es: 'Reino Unido',
    en: 'United Kingdom',
    fr: 'Royaume-Uni',
    pt: 'Reino Unido',
    it: 'Regno Unito',
    de: 'Vereinigtes Königreich',
  },
  'Reino Unido / Antártico': {
    es: 'Reino Unido / Antártico',
    en: 'United Kingdom / Antarctic',
    fr: 'Royaume-Uni / Antarctique',
    pt: 'Reino Unido / Antártico',
    it: 'Regno Unito / Antartico',
    de: 'Vereinigtes Königreich / Antarktis',
  },
  'Reino Unido / Argentina': {
    es: 'Reino Unido / Argentina',
    en: 'United Kingdom / Argentina',
    fr: 'Royaume-Uni / Argentine',
    pt: 'Reino Unido / Argentina',
    it: 'Regno Unito / Argentina',
    de: 'Vereinigtes Königreich / Argentinien',
  },
  'Reino Unido / Territorios Insulares': {
    es: 'Reino Unido / Territorios Insulares',
    en: 'UK / Overseas Islands',
    fr: 'Royaume-Uni / Territoires insulaires',
    pt: 'Reino Unido / Territórios Insulares',
    it: 'Regno Unito / Territori Insulari',
    de: 'Vereinigtes Königreich / Überseegebiete',
  },
  'Reino Unido / Territorios de Ultramar': {
    es: 'Reino Unido / Territorios de Ultramar',
    en: 'UK / Overseas Territories',
    fr: "Royaume-Uni / Territoires d'outre-mer",
    pt: 'Reino Unido / Territórios Ultramarinos',
    it: "Regno Unito / Territori d'Oltremare",
    de: 'Vereinigtes Königreich / Überseegebiete',
  },
  Alemania: {
    es: 'Alemania',
    en: 'Germany',
    fr: 'Allemagne',
    pt: 'Alemanha',
    it: 'Germania',
    de: 'Deutschland',
  },
  'Estados Unidos': {
    es: 'Estados Unidos',
    en: 'United States',
    fr: 'États-Unis',
    pt: 'Estados Unidos',
    it: 'Stati Uniti',
    de: 'Vereinigte Staaten',
  },
  'EE.UU.': {
    es: 'EE.UU.',
    en: 'USA',
    fr: 'États-Unis',
    pt: 'EUA',
    it: 'USA',
    de: 'USA',
  },
  'Estados Unidos / Canadá': {
    es: 'Estados Unidos / Canadá',
    en: 'United States / Canada',
    fr: 'États-Unis / Canada',
    pt: 'Estados Unidos / Canadá',
    it: 'Stati Uniti / Canada',
    de: 'Vereinigte Staaten / Kanada',
  },
  'Canadá': {
    es: 'Canadá',
    en: 'Canada',
    fr: 'Canada',
    pt: 'Canadá',
    it: 'Canada',
    de: 'Kanada',
  },
  'México': {
    es: 'México',
    en: 'Mexico',
    fr: 'Mexique',
    pt: 'México',
    it: 'Messico',
    de: 'Mexiko',
  },
  Chile: {
    es: 'Chile',
    en: 'Chile',
    fr: 'Chili',
    pt: 'Chile',
    it: 'Cile',
    de: 'Chile',
  },
  'Chile / Antártida': {
    es: 'Chile / Antártida',
    en: 'Chile / Antarctica',
    fr: 'Chili / Antarctique',
    pt: 'Chile / Antártida',
    it: 'Cile / Antartide',
    de: 'Chile / Antarktis',
  },
  Argentina: {
    es: 'Argentina',
    en: 'Argentina',
    fr: 'Argentine',
    pt: 'Argentina',
    it: 'Argentina',
    de: 'Argentinien',
  },
  Colombia: {
    es: 'Colombia',
    en: 'Colombia',
    fr: 'Colombie',
    pt: 'Colômbia',
    it: 'Colombia',
    de: 'Kolumbien',
  },
  'Perú': {
    es: 'Perú',
    en: 'Peru',
    fr: 'Pérou',
    pt: 'Peru',
    it: 'Perù',
    de: 'Peru',
  },
  Bolivia: {
    es: 'Bolivia',
    en: 'Bolivia',
    fr: 'Bolivie',
    pt: 'Bolívia',
    it: 'Bolivia',
    de: 'Bolivien',
  },
  Brasil: {
    es: 'Brasil',
    en: 'Brazil',
    fr: 'Brésil',
    pt: 'Brasil',
    it: 'Brasile',
    de: 'Brasilien',
  },
  Namibia: {
    es: 'Namibia',
    en: 'Namibia',
    fr: 'Namibie',
    pt: 'Namíbia',
    it: 'Namibia',
    de: 'Namibia',
  },
  'Sudáfrica': {
    es: 'Sudáfrica',
    en: 'South Africa',
    fr: 'Afrique du Sud',
    pt: 'África do Sul',
    it: 'Sudafrica',
    de: 'Südafrika',
  },
  'Japón': {
    es: 'Japón',
    en: 'Japan',
    fr: 'Japon',
    pt: 'Japão',
    it: 'Giappone',
    de: 'Japan',
  },
  Jordania: {
    es: 'Jordania',
    en: 'Jordan',
    fr: 'Jordanie',
    pt: 'Jordânia',
    it: 'Giordania',
    de: 'Jordanien',
  },
  'Nueva Zelanda': {
    es: 'Nueva Zelanda',
    en: 'New Zealand',
    fr: 'Nouvelle-Zélande',
    pt: 'Nova Zelândia',
    it: 'Nuova Zelanda',
    de: 'Neuseeland',
  },
  Australia: {
    es: 'Australia',
    en: 'Australia',
    fr: 'Australie',
    pt: 'Austrália',
    it: 'Australia',
    de: 'Australien',
  },
  Austria: {
    es: 'Austria',
    en: 'Austria',
    fr: 'Autriche',
    pt: 'Áustria',
    it: 'Austria',
    de: 'Österreich',
  },
  Luxemburgo: {
    es: 'Luxemburgo',
    en: 'Luxembourg',
    fr: 'Luxembourg',
    pt: 'Luxemburgo',
    it: 'Lussemburgo',
    de: 'Luxemburg',
  },
  Grecia: {
    es: 'Grecia',
    en: 'Greece',
    fr: 'Grèce',
    pt: 'Grécia',
    it: 'Grecia',
    de: 'Griechenland',
  },
  'Hungría': {
    es: 'Hungría',
    en: 'Hungary',
    fr: 'Hongrie',
    pt: 'Hungria',
    it: 'Ungheria',
    de: 'Ungarn',
  },
  Polonia: {
    es: 'Polonia',
    en: 'Poland',
    fr: 'Pologne',
    pt: 'Polónia',
    it: 'Polonia',
    de: 'Polen',
  },
  'Países Bajos': {
    es: 'Países Bajos',
    en: 'Netherlands',
    fr: 'Pays-Bas',
    pt: 'Países Baixos',
    it: 'Paesi Bassi',
    de: 'Niederlande',
  },
  Noruega: {
    es: 'Noruega',
    en: 'Norway',
    fr: 'Norvège',
    pt: 'Noruega',
    it: 'Norvegia',
    de: 'Norwegen',
  },
  Suecia: {
    es: 'Suecia',
    en: 'Sweden',
    fr: 'Suède',
    pt: 'Suécia',
    it: 'Svezia',
    de: 'Schweden',
  },
  Finlandia: {
    es: 'Finlandia',
    en: 'Finland',
    fr: 'Finlande',
    pt: 'Finlândia',
    it: 'Finlandia',
    de: 'Finnland',
  },
  Dinamarca: {
    es: 'Dinamarca',
    en: 'Denmark',
    fr: 'Danemark',
    pt: 'Dinamarca',
    it: 'Danimarca',
    de: 'Dänemark',
  },
  Suiza: {
    es: 'Suiza',
    en: 'Switzerland',
    fr: 'Suisse',
    pt: 'Suíça',
    it: 'Svizzera',
    de: 'Schweiz',
  },
  Islandia: {
    es: 'Islandia',
    en: 'Iceland',
    fr: 'Islande',
    pt: 'Islândia',
    it: 'Islanda',
    de: 'Island',
  },
  Groenlandia: {
    es: 'Groenlandia',
    en: 'Greenland',
    fr: 'Groenland',
    pt: 'Gronelândia',
    it: 'Groenlandia',
    de: 'Grönland',
  },
  'Antártida': {
    es: 'Antártida',
    en: 'Antarctica',
    fr: 'Antarctique',
    pt: 'Antártida',
    it: 'Antartide',
    de: 'Antarktis',
  },
  Rusia: {
    es: 'Rusia',
    en: 'Russia',
    fr: 'Russie',
    pt: 'Rússia',
    it: 'Russia',
    de: 'Russland',
  },
  China: {
    es: 'China',
    en: 'China',
    fr: 'Chine',
    pt: 'China',
    it: 'Cina',
    de: 'China',
  },
  'Taiwán': {
    es: 'Taiwán',
    en: 'Taiwan',
    fr: 'Taïwan',
    pt: 'Taiwan',
    it: 'Taiwan',
    de: 'Taiwan',
  },
  India: {
    es: 'India',
    en: 'India',
    fr: 'Inde',
    pt: 'Índia',
    it: 'India',
    de: 'Indien',
  },
  'Corea del Sur': {
    es: 'Corea del Sur',
    en: 'South Korea',
    fr: 'Corée du Sud',
    pt: 'Coreia do Sul',
    it: 'Corea del Sud',
    de: 'Südkorea',
  },
  'Islas Georgias del Sur': {
    es: 'Islas Georgias del Sur',
    en: 'South Georgia Islands',
    fr: 'Géorgie du Sud',
    pt: 'Ilhas Geórgia do Sul',
    it: 'Georgia del Sud',
    de: 'Südgeorgien',
  },
  'Islas Malvinas': {
    es: 'Islas Malvinas',
    en: 'Falkland Islands',
    fr: 'Îles Malouines',
    pt: 'Ilhas Malvinas',
    it: 'Isole Falkland',
    de: 'Falklandinseln',
  },
};

export const CONTINENT_NAMES_I18N: Record<string, Record<SupportedLanguage, string>> = {
  Europa: {
    es: 'Europa',
    en: 'Europe',
    fr: 'Europe',
    pt: 'Europa',
    it: 'Europa',
    de: 'Europa',
  },
  'América del Norte': {
    es: 'América del Norte',
    en: 'North America',
    fr: 'Amérique du Nord',
    pt: 'América do Norte',
    it: 'Nord America',
    de: 'Nordamerika',
  },
  'América del Sur': {
    es: 'América del Sur',
    en: 'South America',
    fr: 'Amérique du Sud',
    pt: 'América do Sul',
    it: 'Sud America',
    de: 'Südamerika',
  },
  'África': {
    es: 'África',
    en: 'Africa',
    fr: 'Afrique',
    pt: 'África',
    it: 'Africa',
    de: 'Afrika',
  },
  Asia: {
    es: 'Asia',
    en: 'Asia',
    fr: 'Asie',
    pt: 'Ásia',
    it: 'Asia',
    de: 'Asien',
  },
  'Oceanía': {
    es: 'Oceanía',
    en: 'Oceania',
    fr: 'Océanie',
    pt: 'Oceania',
    it: 'Oceania',
    de: 'Ozeanien',
  },
  'Antártida': {
    es: 'Antártida',
    en: 'Antarctica',
    fr: 'Antarctique',
    pt: 'Antártida',
    it: 'Antartide',
    de: 'Antarktis',
  },
  'Antártida / Océano Austral': {
    es: 'Antártida / Océano Austral',
    en: 'Antarctica / Southern Ocean',
    fr: 'Antarctique / Océan Austral',
    pt: 'Antártida / Oceano Austral',
    it: 'Antartide / Oceano Australe',
    de: 'Antarktis / Südpolarmeer',
  },
};

export const DARKSKY_CATEGORY_I18N: Record<string, Record<SupportedLanguage, string>> = {
  'Parque Internacional de Cielo Oscuro': {
    es: 'Parque Internacional de Cielo Oscuro',
    en: 'International Dark Sky Park',
    fr: 'Parc International de Ciel Étoilé',
    pt: 'Parque Internacional de Céu Escuro',
    it: 'Parco Internazionale del Cielo Buio',
    de: 'Internationaler Sternenpark',
  },
  'Comunidad Internacional de Cielo Oscuro': {
    es: 'Comunidad Internacional de Cielo Oscuro',
    en: 'International Dark Sky Community',
    fr: 'Communauté Internationale de Ciel Étoilé',
    pt: 'Comunidade Internacional de Céu Escuro',
    it: 'Comunità Internazionale del Cielo Buio',
    de: 'Internationale Sternenstadt',
  },
  'Reserva Internacional de Cielo Oscuro': {
    es: 'Reserva Internacional de Cielo Oscuro',
    en: 'International Dark Sky Reserve',
    fr: 'Réserve Internationale de Ciel Étoilé',
    pt: 'Reserva Internacional de Céu Escuro',
    it: 'Riserva Internazionale del Cielo Buio',
    de: 'Internationales Sternenlicht-Reservat',
  },
  'Santuario Internacional de Cielo Oscuro': {
    es: 'Santuario Internacional de Cielo Oscuro',
    en: 'International Dark Sky Sanctuary',
    fr: 'Sanctuaire International de Ciel Étoilé',
    pt: 'Santuário Internacional de Céu Escuro',
    it: 'Santuario Internazionale del Cielo Buio',
    de: 'Internationales Sternenlicht-Schutzgebiet',
  },
  'Comunidad de Cielo Oscuro': {
    es: 'Comunidad de Cielo Oscuro',
    en: 'Dark Sky Community',
    fr: 'Communauté de Ciel Étoilé',
    pt: 'Comunidade de Céu Escuro',
    it: 'Comunità del Cielo Buio',
    de: 'Sternenlicht-Gemeinde',
  },
  'Espacio Urbano de Cielo Oscuro': {
    es: 'Espacio Urbano de Cielo Oscuro',
    en: 'Urban Night Sky Place',
    fr: 'Lieu Urbain de Ciel Nocturne',
    pt: 'Espaço Urbano de Céu Noturno',
    it: 'Spazio Urbano del Cielo Notturno',
    de: 'Städtischer Nachthimmel-Ort',
  },
};

export const AURORA_FREQUENCY_I18N: Record<string, Record<SupportedLanguage, string>> = {
  'NÚCLEO AURORAL': {
    es: 'NÚCLEO AURORAL',
    en: 'AURORAL CORE',
    fr: 'CŒUR AURORAL',
    pt: 'NÚCLEO AURORAL',
    it: 'NUCLEO AURORALE',
    de: 'POLARLICHT-KERNZONE',
  },
  'FRECUENTE / VARIABLE': {
    es: 'FRECUENTE / VARIABLE',
    en: 'FREQUENT / VARIABLE',
    fr: 'FRÉQUENT / VARIABLE',
    pt: 'FREQUENTE / VARIÁVEL',
    it: 'FREQUENTE / VARIABILE',
    de: 'HÄUFIG / VARIABEL',
  },
  'NÚCLEO AURORAL / VARIABLE': {
    es: 'NÚCLEO AURORAL / VARIABLE',
    en: 'AURORAL CORE / VARIABLE',
    fr: 'CŒUR AURORAL / VARIABLE',
    pt: 'NÚCLEO AURORAL / VARIÁVEL',
    it: 'NUCLEO AURORALE / VARIABILE',
    de: 'POLARLICHT-KERN / VARIABEL',
  },
  'OCASIONAL / VARIABLE': {
    es: 'OCASIONAL / VARIABLE',
    en: 'OCCASIONAL / VARIABLE',
    fr: 'OCCASIONNEL / VARIABLE',
    pt: 'OCASIONAL / VARIÁVEL',
    it: 'OCCASIONALE / VARIABILE',
    de: 'GELEGENTLICH / VARIABEL',
  },
  'NÚCLEO AURORAL AUSTRAL': {
    es: 'NÚCLEO AURORAL AUSTRAL',
    en: 'SOUTHERN AURORAL CORE',
    fr: 'CŒUR AURORAL AUSTRAL',
    pt: 'NÚCLEO AURORAL AUSTRAL',
    it: 'NUCLEO AURORALE AUSTRALE',
    de: 'SÜDLICHE AURORA-KERNZONE',
  },
  'OCASIONAL - FRECUENTE (Tormentas Solares)': {
    es: 'OCASIONAL - FRECUENTE (Tormentas Solares)',
    en: 'OCCASIONAL - FREQUENT (Solar Storms)',
    fr: 'OCCASIONNEL - FRÉQUENT (Tempêtes Solaires)',
    pt: 'OCASIONAL - FREQUENTE (Tempestades Solares)',
    it: 'OCCASIONALE - FREQUENTE (Tempeste Solari)',
    de: 'GELEGENTLICH - HÄUFIG (Sonnenstürme)',
  },
  'OCASIONAL - FRECUENTE': {
    es: 'OCASIONAL - FRECUENTE',
    en: 'OCCASIONAL - FREQUENT',
    fr: 'OCCASIONNEL - FRÉQUENT',
    pt: 'OCASIONAL - FREQUENTE',
    it: 'OCCASIONAL - FREQUENTE',
    de: 'GELEGENTLICH - HÄUFIG',
  },
  'ZONA FRECUENTE': {
    es: 'ZONA FRECUENTE',
    en: 'FREQUENT ZONE',
    fr: 'ZONE FRÉQUENTE',
    pt: 'ZONA FREQUENTE',
    it: 'ZONA FREQUENTE',
    de: 'HÄUFIGE ZONE',
  },
  'ZONA OCASIONAL': {
    es: 'ZONA OCASIONAL',
    en: 'OCCASIONAL ZONE',
    fr: 'ZONE OCCASIONNELLE',
    pt: 'ZONA OCASIONAL',
    it: 'ZONA OCCASIONALE',
    de: 'GELEGENTLICHE ZONE',
  },
  'EXPEDICIÓN POLAR': {
    es: 'EXPEDICIÓN POLAR',
    en: 'POLAR EXPEDITION',
    fr: 'EXPÉDITION POLAIRE',
    pt: 'EXPEDIÇÃO POLAR',
    it: 'SPEDIZIONE POLARE',
    de: 'POLAREXPEDITION',
  },
  'EVENTOS EXTRAORDINARIOS': {
    es: 'EVENTOS EXTRAORDINARIOS',
    en: 'EXTRAORDINARY EVENTS',
    fr: 'ÉVÉNEMENTS EXTRAORDINAIRES',
    pt: 'EVENTOS EXTRAORDINÁRIOS',
    it: 'EVENTI STRAORDINARI',
    de: 'AUSSERGEWÖHNLICHE EREIGNISSE',
  },
};

export const SPANISH_PROVINCE_LABELS_I18N: Record<string, Record<SupportedLanguage, string>> = {
  todas: {
    es: 'Todas las Provincias / Comunidades',
    en: 'All Provinces / Autonomous Regions',
    fr: 'Toutes les Provinces / Communautés',
    pt: 'Todas as Províncias / Comunidades',
    it: 'Tutte le Province / Comunità',
    de: 'Alle Provinzen / Regionen',
  },
  zaragoza: {
    es: 'Zaragoza (3 Certificados Starlight + Moncayo)',
    en: 'Zaragoza (3 Starlight Certified + Moncayo)',
    fr: 'Saragosse (3 Certifiés Starlight + Moncayo)',
    pt: 'Saragoça (3 Certificados Starlight + Moncayo)',
    it: 'Saragozza (3 Certificati Starlight + Moncayo)',
    de: 'Saragossa (3 Starlight-Zertifikate + Moncayo)',
  },
  teruel: {
    es: 'Teruel (Javalambre, Albarracín, Galáctica)',
    en: 'Teruel (Javalambre, Albarracín, Galáctica)',
    fr: 'Teruel (Javalambre, Albarracín, Galáctica)',
    pt: 'Teruel (Javalambre, Albarracín, Galáctica)',
    it: 'Teruel (Javalambre, Albarracín, Galáctica)',
    de: 'Teruel (Javalambre, Albarracín, Galáctica)',
  },
  huesca: {
    es: 'Huesca (Ordesa y Monte Perdido)',
    en: 'Huesca (Ordesa & Monte Perdido)',
    fr: 'Huesca (Ordesa et Mont-Perdu)',
    pt: 'Huesca (Ordesa e Monte Perdido)',
    it: 'Huesca (Ordesa e Monte Perdido)',
    de: 'Huesca (Ordesa & Monte Perdido)',
  },
  castellon: {
    es: 'Castellón (Penyagolosa, Culla, Peñíscola)',
    en: 'Castellón (Penyagolosa, Culla, Peñíscola)',
    fr: 'Castellón (Penyagolosa, Culla, Peñíscola)',
    pt: 'Castellón (Penyagolosa, Culla, Peñíscola)',
    it: 'Castellón (Penyagolosa, Culla, Peñíscola)',
    de: 'Castellón (Penyagolosa, Culla, Peñíscola)',
  },
  valencia: {
    es: 'Valencia (Alto Turia / Aras de los Olmos)',
    en: 'Valencia (Alto Turia / Aras de los Olmos)',
    fr: 'Valence (Alto Turia / Aras de los Olmos)',
    pt: 'Valência (Alto Turia / Aras de los Olmos)',
    it: 'Valencia (Alto Turia / Aras de los Olmos)',
    de: 'Valencia (Alto Turia / Aras de los Olmos)',
  },
  galicia: {
    es: 'Galicia (7 Destinos: Trevinca, Cíes, Muras, Costa da Morte...)',
    en: 'Galicia (7 Destinations: Trevinca, Cíes, Muras, Costa da Morte...)',
    fr: 'Galice (7 Destinations : Trevinca, Cíes, Muras, Costa da Morte...)',
    pt: 'Galiza (7 Destinos: Trevinca, Cíes, Muras, Costa da Morte...)',
    it: 'Galizia (7 Destinazioni: Trevinca, Cíes, Muras, Costa da Morte...)',
    de: 'Galicien (7 Reiseziele: Trevinca, Cíes, Muras, Costa da Morte...)',
  },
  andalucia: {
    es: 'Andalucía (Sierra Morena, Pedroches, Cazorla, Torcal, Calar Alto, Nevada)',
    en: 'Andalusia (Sierra Morena, Pedroches, Cazorla, Torcal, Calar Alto, Nevada)',
    fr: 'Andalousie (Sierra Morena, Pedroches, Cazorla, Torcal, Calar Alto, Nevada)',
    pt: 'Andaluzia (Sierra Morena, Pedroches, Cazorla, Torcal, Calar Alto, Nevada)',
    it: 'Andalusia (Sierra Morena, Pedroches, Cazorla, Torcal, Calar Alto, Nevada)',
    de: 'Andalusien (Sierra Morena, Pedroches, Cazorla, Torcal, Calar Alto, Nevada)',
  },
  'castilla-la mancha': {
    es: 'Castilla-La Mancha (Cuenca, Sierra del Segura/Nerpio, Alcudia, Cabañeros)',
    en: 'Castilla-La Mancha (Cuenca, Sierra del Segura/Nerpio, Alcudia, Cabañeros)',
    fr: 'Castille-La Manche (Cuenca, Sierra del Segura/Nerpio, Alcudia, Cabañeros)',
    pt: 'Castela-La Mancha (Cuenca, Sierra del Segura/Nerpio, Alcudia, Cabañeros)',
    it: 'Castiglia-La Mancia (Cuenca, Sierra del Segura/Nerpio, Alcudia, Cabañeros)',
    de: 'Kastilien-La Mancha (Cuenca, Sierra del Segura/Nerpio, Alcudia, Cabañeros)',
  },
  'castilla y leon': {
    es: 'Castilla y León (Babia/León, Gredos, Soria, Sierra de Francia)',
    en: 'Castile and León (Babia/León, Gredos, Soria, Sierra de Francia)',
    fr: 'Castille-et-León (Babia/León, Gredos, Soria, Sierra de Francia)',
    pt: 'Castela e Leão (Babia/Leão, Gredos, Soria, Sierra de Francia)',
    it: 'Castiglia e León (Babia/León, Gredos, Soria, Sierra de Francia)',
    de: 'Kastilien und León (Babia/León, Gredos, Soria, Sierra de Francia)',
  },
  canarias: {
    es: 'Canarias (La Palma, Teide, Fuerteventura, Gran Canaria)',
    en: 'Canary Islands (La Palma, Teide, Fuerteventura, Gran Canaria)',
    fr: 'Îles Canaries (La Palma, Teide, Fuerteventura, Gran Canaria)',
    pt: 'Ilhas Canárias (La Palma, Teide, Fuerteventura, Gran Canaria)',
    it: 'Isole Canarie (La Palma, Teide, Fuerteventura, Gran Canaria)',
    de: 'Kanarische Inseln (La Palma, Teide, Fuerteventura, Gran Canaria)',
  },
  baleares: {
    es: 'Islas Baleares (Menorca Reserva y Destino Starlight)',
    en: 'Balearic Islands (Menorca Starlight Reserve & Destination)',
    fr: 'Îles Baléares (Minorque Réserve et Destination Starlight)',
    pt: 'Ilhas Baleares (Menorca Reserva e Destino Starlight)',
    it: 'Isole Baleari (Minorca Riserva e Destinazione Starlight)',
    de: 'Balearen (Menorca Starlight-Reservat & Reiseziel)',
  },
  extremadura: {
    es: 'Extremadura (Monfragüe, Gata, Hurdes, Tajo Internacional, Alqueva)',
    en: 'Extremadura (Monfragüe, Gata, Hurdes, International Tagus, Alqueva)',
    fr: 'Estrémadure (Monfragüe, Gata, Hurdes, Tage International, Alqueva)',
    pt: 'Estremadura (Monfragüe, Gata, Hurdes, Tejo Internacional, Alqueva)',
    it: 'Estremadura (Monfragüe, Gata, Hurdes, Tago Internazionale, Alqueva)',
    de: 'Extremadura (Monfragüe, Gata, Hurdes, Internationaler Tajo, Alqueva)',
  },
  navarra: {
    es: 'Navarra (Valle de Roncal Pirenaico)',
    en: 'Navarre (Pyrenean Roncal Valley)',
    fr: 'Navarre (Vallée pyrénéenne de Roncal)',
    pt: 'Navarra (Vale Pirenaico de Roncal)',
    it: 'Navarra (Valle Pirenaica di Roncal)',
    de: 'Navarra (Pyrenäental von Roncal)',
  },
  'la rioja': {
    es: 'La Rioja (Valles del Leza, Jubera, Cidacos y Alhama)',
    en: 'La Rioja (Leza, Jubera, Cidacos & Alhama Valleys)',
    fr: 'La Rioja (Vallées du Leza, Jubera, Cidacos et Alhama)',
    pt: 'La Rioja (Vales do Leza, Jubera, Cidacos e Alhama)',
    it: 'La Rioja (Valli del Leza, Jubera, Cidacos e Alhama)',
    de: 'La Rioja (Täler von Leza, Jubera, Cidacos und Alhama)',
  },
  cataluna: {
    es: 'Cataluña (Aigüestortes, Montsec Lleida, Prades y Montsant)',
    en: 'Catalonia (Aigüestortes, Montsec Lleida, Prades & Montsant)',
    fr: 'Catalogne (Aigüestortes, Montsec Lérida, Prades et Montsant)',
    pt: 'Catalunha (Aigüestortes, Montsec Lleida, Prades e Montsant)',
    it: 'Catalogna (Aigüestortes, Montsec Lleida, Prades e Montsant)',
    de: 'Katalonien (Aigüestortes, Montsec Lleida, Prades & Montsant)',
  },
  'pais vasco': {
    es: 'País Vasco (Valderejo, Izki, Santa Catalina)',
    en: 'Basque Country (Valderejo, Izki, Santa Catalina)',
    fr: 'Pays Basque (Valderejo, Izki, Santa Catalina)',
    pt: 'País Basco (Valderejo, Izki, Santa Catalina)',
    it: 'Paesi Baschi (Valderejo, Izki, Santa Catalina)',
    de: 'Baskenland (Valderejo, Izki, Santa Catalina)',
  },
  asturias: {
    es: 'Asturias / Cantabria (Picos de Europa)',
    en: 'Asturias / Cantabria (Picos de Europa)',
    fr: 'Asturies / Cantabrie (Pics d’Europe)',
    pt: 'Astúrias / Cantábria (Picos de Europa)',
    it: 'Asturie / Cantabria (Picos de Europa)',
    de: 'Asturien / Kantabrien (Picos de Europa)',
  },
};

export function translateCountry(country: string | undefined, lang: SupportedLanguage): string {
  const raw = country || 'España';
  const l = normalizeLanguage(lang);
  if (COUNTRY_NAMES_I18N[raw]) {
    return COUNTRY_NAMES_I18N[raw][l];
  }
  const norm = normalizeToken(raw);
  for (const [k, translations] of Object.entries(COUNTRY_NAMES_I18N)) {
    if (normalizeToken(k) === norm) {
      return translations[l];
    }
  }
  return raw;
}

export function translateContinent(continent: string | undefined, lang: SupportedLanguage): string {
  const raw = continent || 'Europa';
  const l = normalizeLanguage(lang);
  if (CONTINENT_NAMES_I18N[raw]) {
    return CONTINENT_NAMES_I18N[raw][l];
  }
  const norm = normalizeToken(raw);
  for (const [k, translations] of Object.entries(CONTINENT_NAMES_I18N)) {
    if (normalizeToken(k) === norm) {
      return translations[l];
    }
  }
  return raw;
}

export function translateDarkSkyCategory(categoryLabel: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  if (DARKSKY_CATEGORY_I18N[categoryLabel]) {
    return DARKSKY_CATEGORY_I18N[categoryLabel][l];
  }
  return categoryLabel;
}

export function translateAuroraFrequency(freqLabel: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  if (AURORA_FREQUENCY_I18N[freqLabel]) {
    return AURORA_FREQUENCY_I18N[freqLabel][l];
  }
  return freqLabel;
}

export function translateProvinceLabel(provValue: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  return SPANISH_PROVINCE_LABELS_I18N[provValue]?.[l] || SPANISH_PROVINCE_LABELS_I18N[provValue]?.es || provValue;
}

export function translateBortleText(text: string, lang: SupportedLanguage): string {
  const l = normalizeLanguage(lang);
  if (l === 'es' || !text) return text;
  const labels: Record<SupportedLanguage, { bortleClass: string; urban: string; suburban: string; rural: string; pristine: string }> = {
    es: { bortleClass: 'Bortle Clase', urban: 'Urbano', suburban: 'Suburbano', rural: 'Rural', pristine: 'Virgen' },
    en: { bortleClass: 'Bortle Class', urban: 'Urban', suburban: 'Suburban', rural: 'Rural', pristine: 'Pristine' },
    fr: { bortleClass: 'Classe Bortle', urban: 'Urbain', suburban: 'Périurbain', rural: 'Rural', pristine: 'Pur' },
    pt: { bortleClass: 'Classe Bortle', urban: 'Urbano', suburban: 'Suburbano', rural: 'Rural', pristine: 'Puro' },
    it: { bortleClass: 'Classe Bortle', urban: 'Urbano', suburban: 'Suburbano', rural: 'Rurale', pristine: 'Puro' },
    de: { bortleClass: 'Bortle-Klasse', urban: 'Städtisch', suburban: 'Vorstädtisch', rural: 'Ländlich', pristine: 'Unberührt' },
  };
  const d = labels[l];
  return text
    .replace(/Bortle Clase/gi, d.bortleClass)
    .replace(/Cielo Urbano/gi, d.urban)
    .replace(/Urbano/gi, d.urban)
    .replace(/Suburbano/gi, d.suburban)
    .replace(/Rural/gi, d.rural)
    .replace(/Virgen/gi, d.pristine);
}

export function translateRegionInfo(info: RegionImageInfo, lang: SupportedLanguage): RegionImageInfo {
  const l = normalizeLanguage(lang);
  if (l === 'es') return info;
  const translatedCountry = translateCountry(info.pais, l);
  const descIntro: Record<SupportedLanguage, string> = {
    es: info.descripcion_imagen_generica,
    en: `Daylight reference view of ${info.nombre_localizacion_principal} in ${info.region || translatedCountry} (${translatedCountry}), showing the terrain and open horizons of this astronomical observation area.`,
    fr: `Vue diurne de référence de ${info.nombre_localizacion_principal} (${info.region || translatedCountry}, ${translatedCountry}), illustrant le relief et les horizons dégagés de ce territoire astronomique.`,
    pt: `Vista diurna de referência de ${info.nombre_localizacion_principal} (${info.region || translatedCountry}, ${translatedCountry}), destacando o relevo e os horizontes abertos desta zona astronómica.`,
    it: `Vista diurna di riferimento di ${info.nombre_localizacion_principal} (${info.region || translatedCountry}, ${translatedCountry}), che mostra il territorio e gli orizzonti aperti di quest'area astronomica.`,
    de: `Tageslicht-Referenzansicht von ${info.nombre_localizacion_principal} (${info.region || translatedCountry}, ${translatedCountry}) mit der Topografie und den offenen Horizonten dieses Astronomie-Gebiets.`,
  };

  return {
    ...info,
    pais: translatedCountry,
    descripcion_imagen_generica: descIntro[l],
  };
}

// Bidirectional cross-language token aliases -> canonical Spanish tokens present in datasets
const CROSS_LANG_TOKEN_MAP: Record<string, string[]> = {
  spain: ['espana'],
  espagne: ['espana'],
  spanien: ['espana'],
  spagna: ['espana'],
  espanha: ['espana'],
  portogallo: ['portugal'],
  andorre: ['andorra'],
  france: ['francia'],
  frankreich: ['francia'],
  franca: ['francia'],
  ireland: ['irlanda'],
  irlande: ['irlanda'],
  irland: ['irlanda'],
  uk: ['reino unido'],
  'united kingdom': ['reino unido'],
  royaume: ['reino unido'],
  vereinigtes: ['reino unido'],
  regno: ['reino unido'],
  england: ['inglaterra'],
  angleterre: ['inglaterra'],
  inghilterra: ['inglaterra'],
  scotland: ['escocia'],
  ecosse: ['escocia'],
  schottland: ['escocia'],
  scozia: ['escocia'],
  wales: ['gales'],
  galles: ['gales'],
  germany: ['alemania'],
  allemagne: ['alemania'],
  deutschland: ['alemania'],
  germania: ['alemania'],
  alemanha: ['alemania'],
  usa: ['estados unidos', 'ee.uu.'],
  eeuu: ['estados unidos', 'ee.uu.'],
  united: ['estados unidos', 'reino unido'],
  etats: ['estados unidos'],
  vereinigte: ['estados unidos'],
  stati: ['estados unidos'],
  canada: ['canada'],
  kanada: ['canada'],
  mexico: ['mexico'],
  mexique: ['mexico'],
  mexiko: ['mexico'],
  messico: ['mexico'],
  chili: ['chile'],
  cile: ['chile'],
  argentine: ['argentina'],
  argentinien: ['argentina'],
  colombia: ['colombia'],
  colombie: ['colombia'],
  kolumbien: ['colombia'],
  peru: ['peru'],
  perou: ['peru'],
  brazil: ['brasil'],
  bresil: ['brasil'],
  brasilien: ['brasil'],
  brasile: ['brasil'],
  japan: ['japon'],
  japon: ['japon'],
  giappone: ['japon'],
  japao: ['japon'],
  jordan: ['jordania'],
  jordanie: ['jordania'],
  giordania: ['jordania'],
  jordanien: ['jordania'],
  zealand: ['nueva zelanda'],
  zelande: ['nueva zelanda'],
  neuseeland: ['nueva zelanda'],
  zelanda: ['nueva zelanda'],
  australia: ['australia'],
  australie: ['australia'],
  australien: ['australia'],
  austria: ['austria'],
  autriche: ['austria'],
  osterreich: ['austria'],
  luxembourg: ['luxemburgo'],
  luxemburg: ['luxemburgo'],
  greece: ['grecia'],
  grece: ['grecia'],
  griechenland: ['grecia'],
  hungary: ['hungria'],
  hongrie: ['hungria'],
  ungarn: ['hungria'],
  ungheria: ['hungria'],
  poland: ['polonia'],
  pologne: ['polonia'],
  polen: ['polonia'],
  netherlands: ['paises bajos'],
  niederlande: ['paises bajos'],
  paesi: ['paises bajos'],
  norway: ['noruega'],
  norvege: ['noruega'],
  norwegen: ['noruega'],
  norvegia: ['noruega'],
  sweden: ['suecia'],
  suede: ['suecia'],
  schweden: ['suecia'],
  svezia: ['suecia'],
  finland: ['finlandia'],
  finlande: ['finlandia'],
  finnland: ['finlandia'],
  denmark: ['dinamarca'],
  danemark: ['dinamarca'],
  danemarko: ['dinamarca'],
  danimarca: ['dinamarca'],
  switzerland: ['suiza'],
  suisse: ['suiza'],
  schweiz: ['suiza'],
  svizzera: ['suiza'],
  suica: ['suiza'],
  iceland: ['islandia'],
  islande: ['islandia'],
  island: ['islandia'],
  islanda: ['islandia'],
  greenland: ['groenlandia'],
  groenland: ['groenlandia'],
  gronland: ['groenlandia'],
  antarctica: ['antartida'],
  antarctique: ['antartida'],
  antartide: ['antartida'],
  antarktis: ['antartida'],
  russia: ['rusia'],
  russie: ['rusia'],
  russland: ['rusia'],
  china: ['china'],
  chine: ['china'],
  cina: ['china'],
  taiwan: ['taiwan'],
  india: ['india'],
  inde: ['india'],
  indien: ['india'],
  korea: ['corea'],
  coree: ['corea'],
  canary: ['canarias'],
  canaries: ['canarias'],
  kanaren: ['canarias'],
  andalusia: ['andalucia'],
  andalousie: ['andalucia'],
  andalusien: ['andalucia'],
  galice: ['galicia'],
  galiza: ['galicia'],
  galizia: ['galicia'],
  catalonia: ['cataluna'],
  catalogne: ['cataluna'],
  katalonien: ['cataluna'],
  catalunha: ['cataluna'],
  catalogna: ['cataluna'],
  saragossa: ['zaragoza'],
  saragosse: ['zaragoza'],
  saragoza: ['zaragoza'],
  lapland: ['laponia'],
  laponie: ['laponia'],
  lappland: ['laponia'],
  lapponia: ['laponia'],
  tromso: ['tromso'],
  europe: ['europa'],
  america: ['america'],
  africa: ['africa'],
  afrique: ['africa'],
  asia: ['asia'],
  asie: ['asia'],
  asien: ['asia'],
  oceania: ['oceania'],
  oceanie: ['oceania'],
  ozeanien: ['oceania'],
  north: ['norte'],
  nord: ['norte'],
  south: ['sur', 'austral'],
  sud: ['sur', 'austral'],
  southern: ['sur', 'austral'],
  northern: ['norte', 'boreal'],
  falkland: ['malvinas'],
  malouines: ['malvinas'],
  sanctuary: ['santuario'],
  sanctuaire: ['santuario'],
  reserve: ['reserva'],
  riserva: ['reserva'],
  park: ['parque'],
  parc: ['parque'],
  parco: ['parque'],
  community: ['comunidad'],
  communaute: ['comunidad'],
  darksky: ['darksky', 'cielo oscuro'],
};

export function expandMultilingualToken(token: string): string[] {
  const norm = normalizeToken(token);
  if (!norm) return [];
  const candidates = new Set<string>([norm]);
  if (CROSS_LANG_TOKEN_MAP[norm]) {
    CROSS_LANG_TOKEN_MAP[norm].forEach((alt) => candidates.add(alt));
  }
  return Array.from(candidates);
}

export function matchesMultilingualSearch(query: string, fields: Array<string | undefined>): boolean {
  const cleanQuery = query.trim();
  if (!cleanQuery) return true;

  const tokens = cleanQuery
    .split(/[\s,;/\-]+/)
    .map(normalizeToken)
    .filter((tok) => tok.length > 0);

  if (tokens.length === 0) return true;

  const normalizedHaystack = normalizeToken(fields.filter(Boolean).join(' '));
  return tokens.every((tok) => {
    const alts = expandMultilingualToken(tok);
    return alts.some((alt) => normalizedHaystack.includes(alt));
  });
}
