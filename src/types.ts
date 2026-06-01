/**
 * Type declarations for Luxury Anime Weather Dashboard
 */

export interface WeatherCondition {
  label: string;
  code: number;
  type: 'sunny' | 'rainy' | 'snowy' | 'thunderstorm' | 'cloudy' | 'windy' | 'foggy';
  bgGradient: string;
  themeColor: string;
  accentColor: string;
  glowColor: string;
  mascotReaction: string;
  mascotDialogue: string;
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  visibility: number; // km
  pressure: number; // hPa
  sunrise: string;
  sunset: string;
  condition: WeatherCondition;
  isDay: boolean;
  cloudCover: number;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  uvIndex: number;
  conditionCode: number;
  conditionLabel: string;
}

export interface DailyForecastItem {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  rainProbability: number;
  conditionCode: number;
  conditionLabel: string;
  conditionType: WeatherCondition['type'];
}

export interface AQIInfo {
  index: number; // 1 to 5 (1: Good, 2: Fair, 3: Moderate, 4: Poor, 5: Very Poor)
  label: string;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
}

export interface WeatherStats {
  weeklyAvgTemp: number;
  rainfallTrend: number[]; // 5 items or days
  airQuality: AQIInfo;
  humidityTrend: number[];
  windSpeedTrend: number[];
  hourlyTrend: HourlyForecastItem[];
}

export interface CityInfo {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  isFavorite?: boolean;
}

export interface FullWeatherDataset {
  city: CityInfo;
  current: CurrentWeather;
  daily: DailyForecastItem[];
  stats: WeatherStats;
}
