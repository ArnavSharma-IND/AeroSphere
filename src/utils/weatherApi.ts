/**
 * Weather API utility using Open-Meteo & Open-Meteo Air Quality
 * Fully responsive and keyless, with smart fallback datasets for Neo-Tokyo.
 */

import { CityInfo, FullWeatherDataset, WeatherCondition, WeatherStats, DailyForecastItem, HourlyForecastItem, AQIInfo } from '../types';

// Map WMO codes to our Luxury Anime Custom Weather Conditions
export function getWeatherCondition(code: number, isDay: boolean = true): WeatherCondition {
  // WMO Weather interpretation codes (WW)
  if (code === 0) {
    // Clear Sky
    return {
      label: isDay ? "Prismatic Sun" : "Cosmic Moonlight",
      code,
      type: "sunny",
      bgGradient: isDay 
        ? "from-[#081120] via-[#2F144F] to-[#EFA034]" 
        : "from-[#050B14] via-[#120F36] to-[#392473]",
      themeColor: "#FFD700", // Gold
      accentColor: "#FFECA3",
      glowColor: "rgba(255, 215, 0, 0.45)",
      mascotReaction: isDay ? "Happy & Radiant" : "Mystical & Calm",
      mascotDialogue: isDay 
        ? "The quantum atmospheric particles are beautifully transparent today, Senpai! A pristine day to calibrate solar cells or walk in the visual parks."
        : "The stellar alignments are clear, Senpai. The cool night thermal current is perfect for running stargazing diagnostics."
    };
  } else if (code >= 1 && code <= 3) {
    // Mainly clear, partly cloudy, overcast
    return {
      label: code === 1 ? "Stardust Veil" : code === 2 ? "Nebula Clouds" : "Overcast Matrix",
      code,
      type: "cloudy",
      bgGradient: isDay
        ? "from-[#091326] via-[#1F265C] to-[#5C70A0]"
        : "from-[#050912] via-[#0E1533] to-[#25325C]",
      themeColor: "#4DEBFF", // Neon Cyan
      accentColor: "#B19CFF", // Soft Lavender
      glowColor: "rgba(77, 235, 255, 0.3)",
      mascotReaction: "Curious & Focused",
      mascotDialogue: "A soft cloud-cover matrix is absorbing excess stellar radiation. Still, atmospheric moisture parameters are stable. Quite comfy!"
    };
  } else if (code === 45 || code === 48) {
    // Fog
    return {
      label: "Hologram Nebula (Fog)",
      code,
      type: "foggy",
      bgGradient: "from-[#0A0D1A] via-[#21273D] to-[#3B465E]",
      themeColor: "#B19CFF",
      accentColor: "#DEE5FF",
      glowColor: "rgba(177, 156, 255, 0.25)",
      mascotReaction: "Puzzled",
      mascotDialogue: "The localized refractive index has surged. It feels like walking through an unrendered visual card! Be careful of collision indices out there!"
    };
  } else if ((code >= 51 && code <= 57) || (code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
    // Drizzle, Rain, Rain showers
    return {
      label: code >= 80 ? "Hydra Torrent" : "Liquid Crystal Rain",
      code,
      type: "rainy",
      bgGradient: "from-[#050C16] via-[#0E1B33] to-[#0A4D68]",
      themeColor: "#00D4FF", // Electric Cyan
      accentColor: "#4DEBFF", // Neon Blue
      glowColor: "rgba(0, 212, 255, 0.4)",
      mascotReaction: "Playful & Prepared",
      mascotDialogue: "H2O particulate precipitation is performing an atmospheric sweep, Senpai! Don't let your primary circuitry get wet—bring a hydro-deflector umbrella!"
    };
  } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    // Snowfall
    return {
      label: "Glacial Crystals (Snow)",
      code,
      type: "snowy",
      bgGradient: "from-[#060814] via-[#171E3D] to-[#7F9BCB]",
      themeColor: "#B19CFF", // Soft Lavender
      accentColor: "#E0E7FF",
      glowColor: "rgba(177, 156, 255, 0.35)",
      mascotReaction: "Excited & Cooled",
      mascotDialogue: "Absolute zero is far away, but nano-crystal snowfall is gorgeous! Cozy up in your high-thermal nanothread coat, Senpai! Let's drink hot matcha!"
    };
  } else if (code >= 95) {
    // Thunderstorm
    return {
      label: "Hyperion Volt Storm",
      code,
      type: "thunderstorm",
      bgGradient: "from-[#02050E] via-[#1C0D2E] to-[#4A154B]",
      themeColor: "#5B3DF5", // Royal Purple
      accentColor: "#FFD700", // Gold Accent
      glowColor: "rgba(91, 61, 245, 0.45)",
      mascotReaction: "Surprised & Protective",
      mascotDialogue: "Critical! Severe electromagnetic discharges detected in the troposphere. Keep your digital systems grounded. I'll stay close to protect you from the voltage surges!"
    };
  } else {
    // Default / Windy / Other
    return {
      label: "Aether Stream (Windy)",
      code,
      type: "windy",
      bgGradient: "from-[#070F1C] via-[#1A1A3A] to-[#344E6B]",
      themeColor: "#4DEBFF",
      accentColor: "#DEE5FF",
      glowColor: "rgba(77, 235, 255, 0.2)",
      mascotReaction: "Energized",
      mascotDialogue: "The tropospheric wind speed is whistling beautifully, Senpai! Feel the dynamic pressure of the world stream!"
    };
  }
}

// Fallback Neo-Tokyo Dataset if network fails or on initial load
export const FALLBACK_CITY: CityInfo = {
  name: "Neo-Tokyo",
  country: "JP",
  state: "Kanto",
  lat: 35.6895,
  lon: 139.6917
};

export const POPULAR_CITIES: CityInfo[] = [
  { name: "Neo-Tokyo", country: "JP", state: "Tokyo", lat: 35.6895, lon: 139.6917 },
  { name: "Neo-Seoul", country: "KR", state: "Seoul", lat: 37.5665, lon: 126.9780 },
  { name: "Aether-Paris", country: "FR", state: "Île-de-France", lat: 48.8566, lon: 2.3522 },
  { name: "Cyber-London", country: "GB", state: "England", lat: 51.5074, lon: -0.1278 },
  { name: "Synth-New York", country: "US", state: "NY", lat: 40.7128, lon: -74.0060 },
  { name: "Glacier-Reykjavik", country: "IS", state: "Capital", lat: 64.1466, lon: -21.9426 },
  { name: "Cosmic-Sydney", country: "AU", state: "NSW", lat: -33.8688, lon: 151.2093 }
];

export function getMockDataset(city: CityInfo): FullWeatherDataset {
  const currentHour = new Date().getHours();
  const isDay = currentHour > 5 && currentHour < 19;
  
  const weatherCode = 0; // Sunny/moonlight
  const cond = getWeatherCondition(weatherCode, isDay);
  
  // Construct mock hourly
  const hourly: HourlyForecastItem[] = Array.from({ length: 24 }).map((_, i) => {
    const hr = (currentHour + i) % 24;
    const timeStr = `${hr.toString().padStart(2, '0')}:00`;
    const tempOffset = -Math.sin(((hr - 14) / 12) * Math.PI) * 4;
    return {
      time: timeStr,
      temp: parseFloat((23.5 + tempOffset).toFixed(1)),
      humidity: Math.floor(55 + Math.sin((hr / 12) * Math.PI) * 15),
      windSpeed: parseFloat((12.4 + Math.cos((hr / 12) * Math.PI) * 3).toFixed(1)),
      rainProbability: i < 5 ? 0 : Math.floor(Math.random() * 10),
      uvIndex: hr > 11 && hr < 15 ? 7 : hr > 7 && hr < 18 ? 3 : 0,
      conditionCode: 0,
      conditionLabel: isDay ? "Clear Sun" : "Cosmic Starry"
    };
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();

  const daily: DailyForecastItem[] = Array.from({ length: 7 }).map((_, i) => {
    const dayName = days[(todayIndex + i) % 7];
    const mockCode = i % 3 === 0 ? 0 : i % 3 === 1 ? 2 : 61; // Alt clear, cloudy, rainy
    const dailyCond = getWeatherCondition(mockCode, true);
    
    return {
      day: dayName,
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      tempMax: 26 - i,
      tempMin: 18 - i,
      rainProbability: mockCode === 61 ? 85 : mockCode === 2 ? 20 : 0,
      conditionCode: mockCode,
      conditionLabel: dailyCond.label,
      conditionType: dailyCond.type
    };
  });

  const stats: WeatherStats = {
    weeklyAvgTemp: 22.8,
    rainfallTrend: [0, 0, 12, 18, 2, 0, 0],
    airQuality: {
      index: 1,
      label: "Excellent (Class-S)",
      pm25: 8.5,
      pm10: 14.2,
      o3: 32.1,
      no2: 4.8
    },
    humidityTrend: [53, 55, 62, 70, 60, 52, 48],
    windSpeedTrend: [12.4, 14.1, 19.3, 15.0, 9.8, 11.2, 13.0],
    hourlyTrend: hourly.slice(0, 12)
  };

  return {
    city,
    current: {
      temp: 24.2,
      feelsLike: 23.8,
      humidity: 58,
      windSpeed: 12.8,
      windDirection: 210,
      uvIndex: 4,
      visibility: 12.0,
      pressure: 1012,
      sunrise: "04:52 AM",
      sunset: "06:48 PM",
      condition: cond,
      isDay,
      cloudCover: 15
    },
    daily,
    stats
  };
}

// Global search coordinates by city name
export async function searchCities(query: string): Promise<CityInfo[]> {
  if (!query || query.length < 2) return [];
  try {
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`);
    if (!response.ok) return [];
    const data = await response.json();
    if (!data.results || data.results.length === 0) return [];
    
    return data.results.map((r: any) => ({
      name: r.name,
      country: r.country_code ? r.country_code.toUpperCase() : "UN",
      state: r.admin1 || r.country,
      lat: r.latitude,
      lon: r.longitude
    }));
  } catch (error) {
    console.warn("Geocoding API failed, utilizing popular city filters", error);
    return POPULAR_CITIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  }
}

// Fetch precise full weather dataset
export async function fetchFullWeather(city: CityInfo): Promise<FullWeatherDataset> {
  try {
    const { lat, lon } = city;
    
    // 1. Fetch Weather Forecast
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max&timezone=auto`;
    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) throw new Error("Forecast API returned non-200");
    const weather = await forecastRes.ok ? await forecastRes.json() : null;

    // 2. Fetch Air Quality
    let aqiInfo: AQIInfo = { index: 1, label: "Excellent (Class-S)", pm25: 6, pm10: 10, o3: 25, no2: 3 };
    try {
      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm2_5,pm10,nitrogen_dioxide,ozone`;
      const aqiRes = await fetch(aqiUrl);
      if (aqiRes.ok) {
        const aqiData = await aqiRes.json();
        const curAqi = aqiData.current;
        if (curAqi) {
          // Standard European Air Quality Index mapping
          const pm2_5Val = curAqi.pm2_5 || 8;
          let index = 1;
          let label = "Excellent (Class-S)";
          if (pm2_5Val > 10 && pm2_5Val <= 20) { index = 2; label = "Good (Class-A)"; }
          else if (pm2_5Val > 20 && pm2_5Val <= 25) { index = 3; label = "Moderate (Class-B)"; }
          else if (pm2_5Val > 25 && pm2_5Val <= 50) { index = 4; label = "Poor (Class-C)"; }
          else if (pm2_5Val > 50) { index = 5; label = "Severely Poluted (Class-Danger)"; }

          aqiInfo = {
            index,
            label,
            pm25: parseFloat(pm2_5Val.toFixed(1)),
            pm10: parseFloat((curAqi.pm10 || 15).toFixed(1)),
            o3: parseFloat((curAqi.ozone || 30).toFixed(1)),
            no2: parseFloat((curAqi.nitrogen_dioxide || 5).toFixed(1))
          };
        }
      }
    } catch {
      // Quietly fall back
    }

    if (!weather || !weather.current || !weather.daily) {
      throw new Error("Invalid response payload from Open-Meteo");
    }

    const cur = weather.current;
    const isDay = cur.is_day === 1;
    const cond = getWeatherCondition(cur.weather_code, isDay);

    // Parse Hourly
    const hourlyList: HourlyForecastItem[] = [];
    const hourlyData = weather.hourly;
    if (hourlyData && hourlyData.time) {
      for (let i = 0; i < 24; i++) {
        const timestamp = hourlyData.time[i];
        if (!timestamp) break;
        const hourTime = new Date(timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
        hourlyList.push({
          time: hourTime,
          temp: parseFloat((hourlyData.temperature_2m[i] || 0).toFixed(1)),
          humidity: Math.round(hourlyData.relative_humidity_2m[i] || 0),
          windSpeed: parseFloat((hourlyData.wind_speed_10m[i] || 0).toFixed(1)),
          rainProbability: Math.round(hourlyData.precipitation_probability[i] || 0),
          uvIndex: parseFloat((hourlyData.uv_index[i] || 0).toFixed(1)),
          conditionCode: hourlyData.weather_code[i] || 0,
          conditionLabel: getWeatherCondition(hourlyData.weather_code[i] || 0, true).label
        });
      }
    }

    // Parse Daily 7-day
    const dailyList: DailyForecastItem[] = [];
    const dailyData = weather.daily;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    if (dailyData && dailyData.time) {
      for (let i = 0; i < 7; i++) {
        const dateStr = dailyData.time[i];
        if (!dateStr) break;
        const dObj = new Date(dateStr);
        const dayName = days[dObj.getDay()];
        const dailyCond = getWeatherCondition(dailyData.weather_code[i] || 0, true);

        dailyList.push({
          day: dayName,
          date: dObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          tempMax: Math.round(dailyData.temperature_2m_max[i] || 0),
          tempMin: Math.round(dailyData.temperature_2m_min[i] || 0),
          rainProbability: Math.round(dailyData.precipitation_probability_max[i] || 0),
          conditionCode: dailyData.weather_code[i] || 0,
          conditionLabel: dailyCond.label,
          conditionType: dailyCond.type
        });
      }
    }

    // Weekly Averages & Trends
    const temps = dailyList.map(d => (d.tempMax + d.tempMin) / 2);
    const weeklyAvgTemp = parseFloat((temps.reduce((a, b) => a + b, 0) / (temps.length || 1)).toFixed(1));
    
    const monthlyRainfallTrend = dailyList.map(d => d.rainProbability);
    const humidityTrend = hourlyList.slice(0, 7).map(h => h.humidity);
    const windTrend = hourlyList.slice(0, 7).map(h => h.windSpeed);

    const stats: WeatherStats = {
      weeklyAvgTemp,
      rainfallTrend: monthlyRainfallTrend,
      airQuality: aqiInfo,
      humidityTrend: humidityTrend.length ? humidityTrend : [50, 52, 54, 58, 62, 55, 50],
      windSpeedTrend: windTrend.length ? windTrend : [10, 11, 14, 15, 12, 10, 9],
      hourlyTrend: hourlyList
    };

    const formatTime = (isoString: string) => {
      if (!isoString) return "--:--";
      return new Date(isoString).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return {
      city,
      current: {
        temp: parseFloat(cur.temperature_2m.toFixed(1)),
        feelsLike: parseFloat(cur.apparent_temperature.toFixed(1)),
        humidity: Math.round(cur.relative_humidity_2m),
        windSpeed: parseFloat(cur.wind_speed_10m.toFixed(1)),
        windDirection: Math.round(cur.wind_direction_10m || 0),
        uvIndex: dailyData && dailyData.uv_index_max ? parseFloat(dailyData.uv_index_max[0].toFixed(1)) : 2.5,
        visibility: hourlyData && hourlyData.visibility ? parseFloat((hourlyData.visibility[0] / 1000).toFixed(1)) : 10.0,
        pressure: Math.round(cur.pressure_msl),
        sunrise: dailyData && dailyData.sunrise ? formatTime(dailyData.sunrise[0]) : "05:00 AM",
        sunset: dailyData && dailyData.sunset ? formatTime(dailyData.sunset[0]) : "07:00 PM",
        condition: cond,
        isDay,
        cloudCover: Math.round(cur.cloud_cover || 0)
      },
      daily: dailyList,
      stats
    };

  } catch (error) {
    console.error("Failed fetching live weather from Open-Meteo, using detailed mock fallbacks:", error);
    return getMockDataset(city);
  }
}
