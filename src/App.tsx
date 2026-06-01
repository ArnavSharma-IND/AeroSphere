/**
 * Luxury Anime Weather Dashboard App
 * Main Entry dashboard binding live geolocated API calls,
 * responsive custom glass layouts, search cache, and sub-components.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, 
  Wind, Droplets, Eye, Gauge, Compass, Search, Heart, 
  MapPin, RefreshCw, ChevronRight, Clock, Sparkles, Terminal, Volume2
} from 'lucide-react';

import { CityInfo, FullWeatherDataset, WeatherCondition } from './types';
import { fetchFullWeather, searchCities, FALLBACK_CITY, POPULAR_CITIES } from './utils/weatherApi';

import WeatherGlobe from './components/WeatherGlobe';
import WeatherMascotCard from './components/WeatherMascotCard';
import WeatherCharts, { getWeatherIcon } from './components/WeatherCharts';

export default function App() {
  // 1. Core States
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CityInfo[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityInfo>(FALLBACK_CITY);
  const [weatherData, setWeatherData] = useState<FullWeatherDataset | null>(null);
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Unit preferences and lists Cache
  const [useCelsius, setUseCelsius] = useState<boolean>(true);
  const [recentSearches, setRecentSearches] = useState<CityInfo[]>([]);
  const [favoriteSearches, setFavoriteSearches] = useState<CityInfo[]>([]);
  
  // Cinematic Boot Loader state
  const [cinematicIntro, setCinematicIntro] = useState<boolean>(true);
  const [bootStep, setBootStep] = useState<number>(0);

  // Time Ticker State
  const [currentTime, setCurrentTime] = useState<string>("");

  // Loading initial search caches & first geolocation load
  useEffect(() => {
    const savedRecents = localStorage.getItem('anime_weather_recents');
    if (savedRecents) setRecentSearches(JSON.parse(savedRecents));

    const savedFavorites = localStorage.getItem('anime_weather_favorites');
    if (savedFavorites) setFavoriteSearches(JSON.parse(savedFavorites));

    // Boot cinematic sequences
    const t1 = setTimeout(() => setBootStep(1), 600);
    const t2 = setTimeout(() => setBootStep(2), 1300);
    const t3 = setTimeout(() => setBootStep(3), 2000);
    const t4 = setTimeout(() => {
      setCinematicIntro(false);
      // Attempt geolocation query immediately after intro
      triggerGeolocation();
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Time ticker update hook
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync state weather trigger
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchFullWeather(selectedCity);
        setWeatherData(data);
      } catch (err) {
        setError("Tropospheric sat link failed to collect telemetry.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedCity]);

  // Suggestions search dispatcher
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        const hits = await searchCities(query);
        setSuggestions(hits);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // City selection handoff
  const handleSelectCity = (city: CityInfo) => {
    setSelectedCity(city);
    setQuery("");
    setSuggestions([]);

    // Save to recents cache
    const filtered = recentSearches.filter(c => c.name !== city.name);
    const updated = [city, ...filtered].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('anime_weather_recents', JSON.stringify(updated));
  };

  // Toggle favorite city status
  const handleToggleFavorite = (city: CityInfo) => {
    const isFav = favoriteSearches.some(c => c.name === city.name && c.lat === city.lat);
    let updated: CityInfo[];
    if (isFav) {
      updated = favoriteSearches.filter(c => !(c.name === city.name && c.lat === city.lat));
    } else {
      updated = [{ ...city, isFavorite: true }, ...favoriteSearches].slice(0, 6);
    }
    setFavoriteSearches(updated);
    localStorage.setItem('anime_weather_favorites', JSON.stringify(updated));
  };

  // Geolocation detector trigger
  const triggerGeolocation = () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation un-supported by structural frame module.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newCity: CityInfo = {
          name: "Local Satellite",
          country: "GPS",
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        };
        setSelectedCity(newCity);
      },
      (err) => {
        console.warn("Geolocation lock blocked by client browser constraints. Defaulting to Neo-Tokyo.", err);
      }
    );
  };

  const handleUnitToggle = () => {
    setUseCelsius(prev => !prev);
  }

  // Unit converter helper
  const translateTemp = (celsiusVal: number) => {
    if (useCelsius) return `${celsiusVal}°C`;
    return `${Math.round(celsiusVal * 1.8 + 32)}°F`;
  };

  // Extract variables
  const current = weatherData?.current;
  const isFav = current && favoriteSearches.some(c => c.name === selectedCity.name && c.lat === selectedCity.lat);
  const cond = current?.condition || {
    label: "Stardust Matrix",
    code: 0,
    type: "sunny" as WeatherCondition['type'],
    bgGradient: "from-[#081120] via-[#2F144F] to-[#EFA034]",
    themeColor: "#FFD700",
    accentColor: "#FFECA3",
    glowColor: "rgba(255, 215, 0, 0.4)"
  };

  return (
    <div className={`min-h-screen bg-[#081120] text-slate-100 flex flex-col justify-between relative overflow-hidden transition-all duration-[1500ms]`}>
      
      {/* Background Atmospheric Glow Effects from Theme Design */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#5B3DF5] rounded-full blur-[125px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00D4FF] rounded-full blur-[125px] opacity-15"></div>
        {/* Immersive SVG Base64 grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3N2Zz4=')] opacity-30"></div>
      </div>
      
      {/* Dynamic Animated Environment Sky Backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-b ${cond.bgGradient} opacity-35 transition-all duration-[1200ms] pointer-events-none z-0`} />

      {/* 2. Cinematic boot loader overlays */}
      <AnimatePresence>
        {cinematicIntro && (
          <motion.div
            id="boot_loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 bg-[#081120] flex flex-col items-center justify-center font-mono p-5 text-center text-cyan-400"
          >
            <div className="absolute top-4 left-4 font-mono text-[10px] text-slate-500 text-left">
              <div>GEO_DYN_STATION v3.5 // LINKPORT_3000</div>
              <div>LOC: COMPOSING ATMOSPHERICS...</div>
            </div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="relative w-28 h-28 border-2 border-dashed border-[#5b3df5]/30 rounded-full flex items-center justify-center mb-8"
            >
              <div className="w-20 h-20 border border-[#00d4ff] rounded-full animate-ping opacity-60 flex items-center justify-center">
                <Terminal className="w-8 h-8 text-[#4debff] animate-pulse" />
              </div>
            </motion.div>

            <div className="max-w-md space-y-2 h-16">
              {bootStep >= 0 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-widest text-[#4debff]">
                  &gt; BOOTING CLIMATE FLUX COMPILER...
                </motion.p>
              )}
              {bootStep >= 1 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-widest text-indigo-300">
                  &gt; LINKING QUANTUM TROPOSPHERIC GRAPH...
                </motion.p>
              )}
              {bootStep >= 2 && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-widest text-[#ffd700]">
                  &gt; YUKI AI CHASSIS ONLINE. SYNCING COMPLETE!
                </motion.p>
              )}
            </div>

            <span className="absolute bottom-5 text-[9px] text-indigo-400/40 tracking-widest uppercase">
              PINNACLE METEOROLOGICAL LABS © 2026
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Dashboard Layout Frame */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-5 flex flex-col flex-1 gap-6">
        
        {/* TOP COMPONENT: Luxury Cyber Header */}
        <header className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 bg-white/5 border border-white/10 rounded-[24px] p-5 backdrop-blur-xl shadow-xl">
          
          {/* Logo Brand Title with theme styling */}
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5B3DF5] to-[#00D4FF] flex items-center justify-center shadow-[0_0_20px_rgba(91,61,245,0.4)]">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-[#00D4FF]">AeroSphere</h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-0.5">
                NEO-TOKYO // SECTOR {(selectedCity.name || "HQ").toUpperCase()}
              </p>
            </div>
          </div>

          {/* Quick links / Location Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-3 focus-within:border-[#4debff]/50 transition-all duration-300">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Synchronize coordinates... Search any city (e.g., Tokyo, Oslo)"
                className="w-full bg-transparent border-0 text-xs text-white placeholder-slate-500 py-3 pl-2 focus:outline-none focus:ring-0 font-sans"
              />
              <button
                onClick={triggerGeolocation}
                className="p-1.5 hover:bg-white/5 rounded-lg text-[#4debff] transition-all"
                title="Detect Current Location Geolocation"
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>

            {/* Smart Geo-Suggestions dropdown */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 right-0 mt-2 bg-[#081120]/95 border border-white/15 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden z-30 font-mono text-xs"
                >
                  <div className="p-2.5 text-[9px] text-slate-500 border-b border-white/5 tracking-widest uppercase">
                    Select Target Grid Location
                  </div>
                  {suggestions.map((city) => (
                    <button
                      key={`${city.name}-${city.lat}`}
                      onClick={() => handleSelectCity(city)}
                      className="w-full flex items-center justify-between text-left p-3 hover:bg-[#5b3df5]/15 border-b border-white/5 text-slate-200 transition-all duration-150"
                    >
                      <span className="font-sans font-medium text-white">{city.name}, <span className="text-slate-400 font-normal">{city.country}</span></span>
                      <span className="text-[10px] text-indigo-400">LAT: {city.lat.toFixed(2)}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Display Degree Pref switcher / Guardian online badge */}
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden sm:flex px-4 py-2 bg-white/5 border border-white/10 rounded-full items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse"></div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-300">Guardian Online</span>
            </div>

            <button
              onClick={handleUnitToggle}
              className="flex items-center gap-1 bg-white/5 hover:bg-[#5b3df5]/20 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono tracking-wider transition-all duration-300"
            >
              <span className={useCelsius ? "text-[#00d4ff] font-bold" : "text-slate-500"}>°C</span>
              <span className="text-slate-600">/</span>
              <span className={!useCelsius ? "text-[#00d4ff] font-bold" : "text-slate-500"}>°F</span>
            </button>
          </div>

        </header>

        {/* Popular Cities Quick Bar ribbon */}
        <div id="popular_ribbon" className="flex items-center gap-2 overflow-x-auto pb-1 select-none scrollbar-none font-mono text-[10px]">
          <span className="text-slate-500 capitalize flex-none tracking-widest flex items-center gap-1.5 mr-1">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            Active Nodes:
          </span>
          <div className="flex gap-2">
            {POPULAR_CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedCity(c)}
                className={`px-3 py-1.5 rounded-lg border text-nowrap transition-all duration-300 ${
                  selectedCity.name === c.name 
                    ? "bg-[#5b3df5]/20 border-[#5b3df5]/60 text-white font-[600] scale-102" 
                    : "bg-black/30 border-white/5 text-slate-400 hover:text-white hover:border-white/10"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Responsive BENTO structure GRID */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center font-mono text-cyan-400 gap-4">
            <RefreshCw className="w-8 h-8 animate-spin" />
            <span>DOWNLINKING ATMOSPHERIC TELEMETRY...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center font-mono text-red-400 gap-4">
            <span className="text-lg">STATION_LINK_OFFLINE</span>
            <span className="text-xs text-slate-400">{error}</span>
            <button
              onClick={() => setSelectedCity(FALLBACK_CITY)}
              className="mt-4 px-4 py-2 border border-red-500/30 bg-red-500/10 rounded-xl text-xs hover:bg-red-500/20 text-white transition-all"
            >
              Reboot Satellite Links
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* COLUMN LEFT (Size: 4/12) - Current Weather detailed dashboard */}
            <section className="lg:col-span-4 flex flex-col gap-6 h-full">
                        {/* Card 1: Core Climate parameters */}
              <div id="current_specs" className="relative bg-white/5 border border-white/10 rounded-[32px] p-6 backdrop-blur-xl shadow-2xl flex-1 flex flex-col justify-between overflow-hidden group transition-all duration-300 hover:shadow-[0_0_30px_rgba(91,61,245,0.15)]">
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/10 to-transparent rounded-full pointer-events-none" />
                
                {/* Header card with name & favorite */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#00D4FF]" />
                      <span className="font-mono text-[10px] tracking-[0.2em] text-[#00D4FF] uppercase font-bold">Tropospheric Station</span>
                    </div>
                    <h2 className="font-sans font-extrabold text-2xl tracking-tight text-white mt-1">
                      {selectedCity.name}
                    </h2>
                    <p className="font-mono text-[9px] text-[#B19CFF] uppercase tracking-widest mt-0.5">
                      REGION_GRID: {selectedCity.state || selectedCity.country}
                    </p>
                  </div>

                  <button
                    onClick={() => handleToggleFavorite(selectedCity)}
                    className={`p-2.5 rounded-full border transition-all duration-300 ${
                      isFav 
                        ? "bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]" 
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/25"
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={isFav ? "currentColor" : "none"} />
                  </button>
                </div>

                {/* Big Climate readout */}
                <div className="my-8 flex items-baseline gap-2">
                  <span className="font-mono text-6xl tracking-tighter font-extrabold text-white">
                    {translateTemp(current?.temp || 0).split('°')[0]}
                  </span>
                  <span className="text-xl font-sans font-bold text-slate-400">
                    {useCelsius ? "°C" : "°F"}
                  </span>
                  
                  {/* Small absolute weather category label */}
                  <div className="ml-4 font-mono">
                    <span className="bg-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-full border border-white/15 inline-flex items-center gap-1.5 shadow-sm">
                      {getWeatherIcon(cond.type, "w-3.5 h-3.5 text-[#FFD700]")}
                      {cond.label}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1 pl-1">
                      Feels Like: <span className="text-[#00D4FF] font-bold">{translateTemp(current?.feelsLike || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Sub parameter grid (UV, wind speed, humidity, density coefficient) */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 font-mono text-[10px] text-slate-400">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-950/40 rounded-xl border border-indigo-500/10">
                      <Wind className="w-4 h-4 text-[#B19CFF]" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold">{current?.windSpeed} km/h</div>
                      <div>WINDSTREAM</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-[#081120]/60 rounded-xl border border-sky-500/10">
                      <Droplets className="w-4 h-4 text-[#00D4FF]" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold">{current?.humidity}%</div>
                      <div>ATM_HUMIDITY</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-950/40 rounded-xl border border-[#FFD700]/10">
                      <Sun className="w-4 h-4 text-[#FFD700]" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold">{current?.uvIndex}</div>
                      <div>UV_INDEX</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-950/40 rounded-xl border border-emerald-500/10">
                      <Eye className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-white text-xs font-semibold">{current?.visibility} km</div>
                      <div>OPTIC_RANGE</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Card 2: Sol and barometric coefficient indicators */}
              <div id="sol_specs" className="bg-white/5 border border-white/10 rounded-[24px] p-5 backdrop-blur-xl grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="font-mono text-[9px] text-slate-400 tracking-widest uppercase block">Solar Ignition</span>
                  <div className="text-white font-sans font-bold text-sm tracking-wide">{current?.sunrise}</div>
                  <span className="bg-amber-400/15 text-[#FFD700] font-mono text-[8px] px-2 py-0.5 rounded border border-[#FFD700]/20 block w-max uppercase tracking-wider">SUNRISE</span>
                </div>
                <div className="space-y-1 border-l border-white/5 pl-4">
                  <span className="font-mono text-[9px] text-slate-400 tracking-widest uppercase block">Nocturnal Core</span>
                  <div className="text-white font-sans font-bold text-sm tracking-wide">{current?.sunset}</div>
                  <span className="bg-[#5B3DF5]/15 text-[#B19CFF] font-mono text-[8px] px-2 py-0.5 rounded border border-[#5B3DF5]/20 block w-max uppercase tracking-wider">SUNSET</span>
                </div>
                <div className="col-span-2 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[9px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-rose-400" />
                    Pressure: <span className="text-white font-semibold">{current?.pressure} hPa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#00d4ff]" />
                    Wind Dir: <span className="text-white font-semibold">{current?.windDirection}°</span>
                  </div>
                </div>
              </div>

            </section>

            {/* COLUMN MIDDLE (Size: 5/12) - Holographic Globe Globe + Interactive Analysis charts */}
            <section className="lg:col-span-5 flex flex-col gap-6 justify-between h-full">
              
              {/* 3D Earth Scope Section */}
              <div id="earth_module" className="bg-white/5 border border-white/10 rounded-[32px] p-4 flex-1 backdrop-blur-xl relative flex flex-col justify-between overflow-hidden min-h-[300px] group transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]">
                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#00D4FF] animate-spin-slow" />
                  <span className="font-mono text-[10px] text-[#00D4FF] font-bold tracking-widest uppercase">Atmospheric 3D Mesh</span>
                </div>

                {/* Actual ThreeJS component */}
                <div className="relative w-full h-full flex-1 mt-6">
                  <WeatherGlobe condition={cond} lat={selectedCity.lat} lon={selectedCity.lon} />
                </div>
              </div>

            </section>

            {/* COLUMN RIGHT (Size: 3/12) - Cute Interactive Yuki AI MASCOT */}
            <section className="lg:col-span-3 flex flex-col">
              {weatherData && (
                <WeatherMascotCard 
                  condition={cond} 
                  current={weatherData.current} 
                  cityName={selectedCity.name} 
                />
              )}
            </section>

            {/* BOTTOM FULL-SPAN MODULE - Responsive charts for hourly and weekly scopes */}
            <section className="lg:col-span-12">
              {weatherData && (
                <WeatherCharts 
                  daily={weatherData.daily} 
                  stats={weatherData.stats} 
                  themeColor={cond.themeColor} 
                />
              )}
            </section>

          </div>
        )}

      </div>

      {/* Footer Ticker from Atmospheric / Immersive Media Theme */}
      <footer className="relative z-10 bg-[#5B3DF5]/10 border-t border-white/10 pt-4 pb-6 overflow-hidden mt-10 flex flex-col gap-4">
        <div className="flex justify-between items-center px-8 gap-12 text-nowrap select-none overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[9px] font-extrabold text-[#FFD700] uppercase tracking-wider bg-[#FFD700]/10 px-1.5 py-0.5 rounded border border-[#FFD700]/20">Warning</span>
            <span className="text-[10px] text-slate-300 font-mono">Localized magnetic interference in Sector 4. Use caution.</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[9px] font-extrabold text-[#00D4FF] uppercase tracking-wider bg-[#00D4FF]/10 px-1.5 py-0.5 rounded border border-[#00D4FF]/20">System</span>
            <span className="text-[10px] text-slate-300 font-mono">Yuki chassis synchronization holding at 99.8%. No anomalies detected.</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[9px] font-extrabold text-[#FFD700] uppercase tracking-wider bg-[#FFD700]/10 px-1.5 py-0.5 rounded border border-[#FFD700]/20">Forecast</span>
            <span className="text-[10px] text-slate-300 font-mono">Quantum gravity wave fluctuation registered under active matrix.</span>
          </div>
        </div>

        {/* Elegant Copyright section */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-8 pt-4 border-t border-white/5 text-[10px] font-mono text-slate-400 tracking-widest gap-2">
          <span>AEROSPHERE // PERSISTENT GEO-METEOROLOGY PORT</span>
          <span className="text-[#00D4FF]">© {new Date().getFullYear()} AEROSPHERE — DESIGNED & ENGINEERED BY ARNAV SHARMA</span>
        </div>
      </footer>

    </div>
  );
}
