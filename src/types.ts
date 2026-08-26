export type ActiveTab = 'welcome' | 'dashboard' | 'spots' | 'events' | 'weather' | 'assistant' | 'profile';

export type WeatherType = 'clear' | 'rain' | 'snow' | 'wind' | 'clouds' | 'storm';

export interface WeatherData {
  condition: WeatherType;
  temperatureC: number;
  seeingQuality: 'Excelente' | 'Bueno' | 'Regular' | 'Malo';
  bortleClass: number;
  sqm: number;
  lowCloudsPct: number;
  midCloudsPct: number;
  highCloudsPct: number;
  humidityPct: number;
  windKmH: number;
  windDirection: string;
  transparencyMag: number;
  moonPhaseName: string;
  moonIlluminationPct: number;
}

export interface PlanetaryEnergy {
  id: string;
  planet: string;
  signOrTransit: string;
  title: string;
  symbol: string;
  energySummary: string;
  astronomicalDetail: string;
  stargazingRecommendation: string;
  element: 'Fuego' | 'Tierra' | 'Aire' | 'Agua';
}

export interface CelestialEvent {
  id: string;
  title: string;
  category: 'lluvia_estrellas' | 'alineacion' | 'visualizacion_planetas' | 'eclipse' | 'fase_lunar';
  categoryLabel: string;
  date: string;
  startDateISO: string; // YYYY-MM-DD
  endDateISO: string;   // YYYY-MM-DD
  peakTime: string;
  description: string;
  bestVisibilityZone: string;
  equipmentNeeded: string;
  isMajor?: boolean;
}

export interface GuideItem {
  id: string;
  title: string;
  category: string;
  description: string;
  popular?: boolean;
  imageUrl?: string;
  icon?: string;
  actionText: string;
  content: {
    intro: string;
    highlights: string[];
    steps?: string[];
    tips?: string;
  };
}

export interface EbookItem {
  id: string;
  title: string;
  author: string;
  pages: number;
  format: string;
  description: string;
  downloadUrl?: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  description: string;
  fields: string[];
  type: 'logbook' | 'checklist' | 'astrophotography';
}

export interface DigitalTool {
  id: string;
  name: string;
  description: string;
  type: 'calculator' | 'planetarium' | 'weather';
  icon: string;
}

export interface StarlightSpot {
  id: string;
  name: string;
  region: string;
  country?: string;
  certified?: boolean;
  spotType?: 'certified' | 'optimal_free';
  subAreas?: string[];
  bortleClass: number; // 1-9
  sqm: number; // Sky Quality Meter e.g. 21.85
  elevationMeters: number;
  latitude: number;
  longitude: number;
  description: string;
  facilities: string[];
  bestSeason: string;
  imageUrl: string;
  featured?: boolean;
}

export interface ObservationLog {
  id: string;
  date: string;
  location: string;
  targetObject: string;
  telescopeEquipment: string;
  notes: string;
  rating: number;
  bortle: number;
}

export interface WeatherLocation {
  id: string;
  cityName: string;
  region: string;
  country: string;
  weatherData: WeatherData;
}

export type ModalType = 'settings' | 'quickMenu' | 'hosteleria' | 'emergencias' | 'accesorios' | 'languages' | null;

export interface SettingsTabType {
  activeTab: 'perfil' | 'tarifas' | 'pagos';
}


export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
