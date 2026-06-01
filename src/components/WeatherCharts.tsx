/**
 * Luxury Anime Weather Forecast Cards and Recharts statistics modules.
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { DailyForecastItem, WeatherCondition, WeatherStats } from '../types';
import { getWeatherCondition } from '../utils/weatherApi';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  BarChart, Bar, LineChart, Line, CartesianGrid 
} from 'recharts';
import { 
  Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, 
  Wind, Droplets, Calendar, TrendingUp, BarChart2, ShieldCheck, Waves 
} from 'lucide-react';

// Help helper to get elegant custom icons for each condition category
export function getWeatherIcon(type: WeatherCondition['type'], className = "w-6 h-6", isDay = true) {
  switch (type) {
    case 'sunny':
      return isDay ? <Sun className={`text-amber-400 ${className}`} /> : <Moon className={`text-indigo-200 ${className}`} />;
    case 'rainy':
      return <CloudRain className={`text-sky-400 ${className}`} />;
    case 'snowy':
      return <CloudSnow className={`text-blue-100 ${className}`} />;
    case 'thunderstorm':
      return <CloudLightning className={`text-purple-400 ${className}`} />;
    case 'cloudy':
      return <Cloud className={`text-[#4debff] ${className}`} />;
    case 'foggy':
      return <Waves className={`text-slate-300 ${className}`} />;
    default:
      return <Wind className={`text-cyan-300 ${className}`} />;
  }
}

interface WeatherChartsProps {
  daily: DailyForecastItem[];
  stats: WeatherStats;
  themeColor: string;
}

export default function WeatherCharts({ daily, stats, themeColor }: WeatherChartsProps) {
  const [activeTab, setActiveTab] = useState<'hourly' | 'weekly_stats' | 'trends'>('hourly');

  // Custom styling for chart tooltips to fit our glassmorphism cyber HUD
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div id="chart_tooltip" className="bg-[#081120]/95 border border-[#5b3df5]/30 rounded-xl p-3 shadow-xl backdrop-blur-md font-mono text-[11px] text-slate-100">
          <p className="font-semibold text-cyan-400 mb-1">{label}</p>
          {payload.map((p: any, idx: number) => (
            <p key={idx} style={{ color: p.color || '#fff' }}>
              {p.name}: <span className="font-bold">{p.value}</span> {p.unit || ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="weather_charts_module" className="space-y-6">
      
      {/* 1. 5-Day Horizontal Forecast row */}
      <div id="forecast_section">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="font-sans font-medium text-sm tracking-widest text-[#4debff] uppercase">7-Day Atmospheric Scope</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
          {daily.map((item, index) => {
            const isToday = index === 0;
            return (
              <motion.div
                key={item.day}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`relative flex flex-col justify-between items-center p-4 border rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 select-none ${
                  isToday 
                    ? "bg-gradient-to-b from-[#1e1b4b]/80 to-[#120e2e]/90 border-[#5b3df5]/60 shadow-[0_0_15px_rgba(91,61,245,0.4)]" 
                    : "bg-[#0b1328]/40 border-white/5 hover:border-[#4debff]/20 hover:bg-[#0f1d3a]/50"
                }`}
              >
                {/* Visual Glow indicators for Today */}
                {isToday && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5b3df5] to-[#4debff]" />
                )}

                <span className="font-mono text-[10px] tracking-wider text-slate-400 font-medium">{item.day}</span>
                <span className="font-sans text-[11px] font-[500] text-slate-400 mb-2">{item.date}</span>

                <div className="my-2.5 p-2 bg-black/25 rounded-full border border-white/5 shadow-inner">
                  {getWeatherIcon(item.conditionType, "w-6 h-6")}
                </div>

                <div className="text-center">
                  <p className="font-mono text-xs font-[600] text-white tracking-wider">{item.tempMax}° / <span className="text-slate-400 font-[400]">{item.tempMin}°</span></p>
                  <p className="font-sans text-[9px] text-[#4debff]/80 truncate max-w-[85px] mt-0.5">{item.conditionLabel}</p>
                </div>

                {/* Rain probability bar */}
                <div className="w-full mt-3 flex items-center justify-center gap-1 font-mono text-[9px] text-cyan-400">
                  <Droplets className="w-3 h-3" />
                  <span>{item.rainProbability}%</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive telemetry chart board */}
      <div id="chart_dashboard" className="bg-[#0b1328]/40 border border-white/5 rounded-2xl p-5 backdrop-blur-xl">
        
        {/* Navigation Selector Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#5b3df5]" />
            <h3 className="font-sans font-semibold text-sm text-white tracking-widest uppercase">Tropospheric Telemetry Analysis</h3>
          </div>

          <div className="flex gap-1.5 p-1 bg-black/40 border border-white/5 rounded-xl self-stretch sm:self-auto justify-between">
            <button
              onClick={() => setActiveTab('hourly')}
              className={`flex-1 sm:flex-none font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'hourly' 
                  ? "bg-gradient-to-r from-[#5b3df5] to-[#00d4ff] text-white shadow-md font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Hourly Trace
            </button>
            <button
              onClick={() => setActiveTab('weekly_stats')}
              className={`flex-1 sm:flex-none font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'weekly_stats' 
                  ? "bg-gradient-to-r from-[#5b3df5] to-[#00d4ff] text-white shadow-md font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Rain & Air Quality
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex-1 sm:flex-none font-mono text-[10px] uppercase tracking-wider px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === 'trends' 
                  ? "bg-gradient-to-r from-[#5b3df5] to-[#00d4ff] text-white shadow-md font-bold" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Atmospheric trends
            </button>
          </div>
        </div>

        {/* 3. Actual Recharts Rendering */}
        <div className="h-[280px] w-full">
          {activeTab === 'hourly' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.hourlyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={themeColor || "#5B3DF5"} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={themeColor || "#5B3DF5"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} unit="°" />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  name="Temperature" 
                  unit="°C"
                  stroke={themeColor || "#5B3DF5"} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeTab === 'weekly_stats' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-full">
              {/* Rainfall chart */}
              <div className="md:col-span-2 h-full">
                <p className="font-mono text-[10px] tracking-wider text-slate-400 mb-2 uppercase">Precipitation Probability Trend</p>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={daily} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="rainProbability" name="Precipitation Probability" unit="%" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Air Quality Index gauge */}
              <div className="flex flex-col justify-center items-center p-4 bg-black/30 border border-white/5 rounded-xl text-center">
                <div className="p-3 bg-cyan-950/40 rounded-full border border-cyan-500/10 mb-2.5">
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="font-mono text-[9px] tracking-widest text-[#4debff] uppercase">Aero-Matrix Health index</span>
                <span className="font-sans text-[20px] font-bold text-white mt-1.5 leading-none">{stats.airQuality.label}</span>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-4 w-full font-mono text-[9px] text-slate-400 text-left pt-3 border-t border-white/5">
                  <div>PM2.5: <span className="text-white font-[600]">{stats.airQuality.pm25} µg</span></div>
                  <div>PM10: <span className="text-white font-[600]">{stats.airQuality.pm10} µg</span></div>
                  <div>OZONE: <span className="text-white font-[600]">{stats.airQuality.o3} µg</span></div>
                  <div>NO2: <span className="text-white font-[600]">{stats.airQuality.no2} µg</span></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.hourlyTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  name="Humidity" 
                  unit="%"
                  stroke="#4DEBFF" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="windSpeed" 
                  name="Wind speed" 
                  unit=" km/h"
                  stroke="#FFD700" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

    </div>
  );
}
