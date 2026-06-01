/**
 * Anime Weather Mascot Card Component.
 * Showcases the beautifully generated Yuki-chan anime avatar,
 * with dynamic climate-adaptive dialog bubbles and click reactions.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeatherCondition, CurrentWeather } from '../types';
import { Sparkles, MessageCircle, RefreshCw, Cpu } from 'lucide-react';

// Yuki-chan's lovely master asset generated earlier
import YukiAvatar from '../assets/images/weather_mascot_anime_1780222248752.png';

interface WeatherMascotProps {
  condition: WeatherCondition;
  current: CurrentWeather;
  cityName: string;
}

export default function WeatherMascotCard({ condition, current, cityName }: WeatherMascotProps) {
  const [dialogue, setDialogue] = useState<string>("");
  const [dialogueKey, setDialogueKey] = useState<number>(0);
  const [mascotMood, setMascotMood] = useState<string>("SYSTEM_LOADED");
  const [clickCount, setClickCount] = useState<number>(0);

  // Yuki's reactive speech trigger
  useEffect(() => {
    let text = condition.mascotDialogue;

    // Heatwave alert
    if (current.temp >= 30) {
      text = `Alert! Absolute thermal load detected in ${cityName} (${current.temp}°C). My nanotech cooling circuits are approaching limit capacity, Senpai! Please hydrate frequently and limit outdoor operations!`;
      setMascotMood("THERMAL_OVERLOAD");
    } 
    // Freezing alert
    else if (current.temp <= 5) {
      text = `B-rrr! Ambient temperature in ${cityName} is down to ${current.temp}°C! Yuki's primary compiler loops are starting to lag from crystal ice formations! Time to overclock our thermal cores, Senpai! Wrap yourself in woolens!`;
      setMascotMood("TEMPERATURE_CRITICAL");
    }
    // High UV alert
    else if (current.uvIndex >= 7) {
      text = `Severe stellar flux warnings! The UV radiation index is registering ${current.uvIndex} in ${cityName}! Senpai, apply high-absorption quantum sunscreen block or deploy physical forcefield umbrellas!`;
      setMascotMood("STELLAR_FLUX_WARNING");
    }
    // Deep humidity dampness alert
    else if (current.humidity >= 85) {
      text = `Whoa! Severe humidity (${current.humidity}%) is condensing directly onto my main optical lenses. It represents a 95% moisture saturation state. Be sure to engage defogging modules!`;
      setMascotMood("HUMIDITY_SATURATED");
    }
    // Clear beautiful weather default
    else {
      setMascotMood(condition.mascotReaction);
    }

    setDialogue(text);
    // Force animation reset
    setDialogueKey(prev => prev + 1);
  }, [condition, current, cityName]);

  // Yuki-chan Easter Egg secondary triggers on avatar tap
  const handleMascotTap = () => {
    const lines = [
      "I'm Yuki-chan, your quantum-tropospheric intelligence assistant! Ready to analyze any coordinate in the galaxy!",
      "Did you know? The highest wind speed ever measured on Earth was 408 km/h! My sensors would definitely go offline there!",
      "Synchronization complete. Your structural index is looking absolutely fabulous today, Senpai! ^-^",
      "I love observing meteor showers. They create such beautiful sparks of stardust across the atmospheric boundary layer!",
      "Processing... 99.8% compatibility achieved between Yuki and Senpai. Energy cores: Stable!",
      "Ah! That tickles! Please do not tap my primary optical sensors, or I'll have to diagnostic-reboot!"
    ];
    
    const randomIdx = (clickCount + 1) % lines.length;
    setClickCount(prev => prev + 1);
    setDialogue(lines[randomIdx]);
    setMascotMood("SYNCING_INTERACTIVE");
    setDialogueKey(prev => prev + 1);
  };

  return (
    <div id="mascot_module" className="relative group flex flex-col items-center justify-between h-full bg-[#0d162d]/55 border border-white/10 rounded-2xl p-5 backdrop-blur-xl overflow-hidden hover:border-[#4debff]/30 transition-all duration-300 shadow-2xl">
      
      {/* Absolute Hologram Overlay Grid background */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(59,130,246,0.06)_10%,transparent_70%] pointer-events-none" />
      <div className="absolute top-2 right-2 flex items-center gap-1.5 font-mono text-[9px] text-[#4debff]/50 border border-[#4debff]/10 rounded-full px-2 py-0.5 bg-black/40">
        <span className="w-1.5 h-1.5 rounded-full bg-[#4debff] animate-ping" />
        <span>SYSMODE: ANIME_AI_CO-PILOT</span>
      </div>

      {/* 1. Interactive Dialogue Bubble */}
      <div className="w-full mb-4">
        <div className="relative bg-gradient-to-r from-[#172554]/90 to-[#1e1b4b]/90 border border-[#5b3df5]/30 rounded-xl p-4 text-xs tracking-wide leading-relaxed text-slate-100 shadow-[0_4px_20px_rgba(91,61,245,0.25)]">
          {/* Neon speaker arrow */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1e1b4b] border-r border-b border-[#5b3df5]/30 rotate-45" />
          
          <div className="flex items-center gap-1.5 mb-1.5 font-mono font-medium text-[10px] text-[#4debff] tracking-wider uppercase">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>YUKI-CHAN (SYS_VER_3.5)</span>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={dialogueKey}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="font-sans font-medium"
            >
              {dialogue}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Stunning anime-styled Yuki Avatar frame */}
      <div className="relative flex flex-col items-center justify-center p-2 mb-2 w-full max-w-[210px] aspect-square select-none cursor-pointer" onClick={handleMascotTap}>
        
        {/* Orbit Rings (Tech Hud visual decor) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 border border-dashed border-[#5b3df5]/15 rounded-full p-1"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-1.5 border border-[#4debff]/20 rounded-full border-t-2 border-r-2"
        />

        {/* Dynamic Holographic Ripple rings on hover */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-b from-[#5b3df5]/10 to-[#4debff]/10 blur-xl opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        
        {/* Yuki Core Avatar */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 p-1 bg-black/30 group-hover:border-[#4debff]/50 shadow-[0_0_20px_rgba(77,235,255,0.15)] group-hover:shadow-[0_0_35px_rgba(77,235,255,0.35)] transition-all duration-300">
          <img
            src={YukiAvatar}
            alt="Yuki Anime Weather Mascot"
            className="w-full h-full object-cover rounded-full select-none"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Yuki Status badge badge */}
        <div className="absolute -bottom-1 bg-black/8 w-full flex justify-center">
          <span className="bg-gradient-to-r from-[#5b3df5] to-[#00d4ff] text-[10px] font-mono tracking-wider text-white font-medium px-3.5 py-1.2 rounded-full border border-white/20 shadow-md">
            MOOD: {mascotMood}
          </span>
        </div>
      </div>

      {/* Yuki System Status Indicators */}
      <div className="w-full grid grid-cols-2 gap-2 mt-4 font-mono text-[9px] text-slate-400">
        <div className="flex items-center gap-1.5 bg-black/30 border border-white/5 rounded-lg px-2.5 py-1.5">
          <Cpu className="w-3.5 h-3.5 text-[#5b3df5]" />
          <div>
            <div className="text-white font-[600]">YUKI_CORE</div>
            <div className="text-emerald-400 text-[8px]">ONLINE (100%)</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-black/30 border border-white/5 rounded-lg px-2.5 py-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-[#4debff] animate-spin-slow" />
          <div>
            <div className="text-white font-[600]">SAT_SYNC</div>
            <div className="text-[#4debff] text-[8px]">LIVESTREAM</div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
