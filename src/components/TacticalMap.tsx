import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Cloud, Rain, Wind, MapPin } from 'lucide-react';

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
}

export const TacticalMap: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [coords, setCoords] = useState({ lat: 34.0522, lon: -118.2437 });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      });
    }
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
        );
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        console.error("Failed to fetch tactical weather:", error);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // 5 min refresh
    return () => clearInterval(interval);
  }, [coords]);

  const getWeatherIcon = (code: number) => {
    if (code <= 3) return <Sun className="w-5 h-5 text-tactical-accent" />;
    if (code <= 48) return <Cloud className="w-5 h-5 text-black" />;
    if (code <= 67) return <Rain className="w-5 h-5 text-tactical-info" />;
    return <Wind className="w-5 h-5 text-black" />;
  };

  return (
    <div className="relative w-full h-full bg-white overflow-hidden border-l-2 border-black tactical-grid">
      {/* REY Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1 className="text-[40vw] font-black text-black/5 leading-none tracking-tighter uppercase transform -rotate-12">
          REY
        </h1>
      </div>

      {/* Concentric Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80%] h-[80%] border-2 border-black/10 rounded-full" />
        <div className="w-[60%] h-[60%] border-2 border-black/20 rounded-full" />
        <div className="w-[40%] h-[40%] border-2 border-black/30 rounded-full" />
        <div className="w-6 h-6 bg-black z-10 flex items-center justify-center">
          <div className="w-2 h-2 bg-tactical-accent animate-ping" />
        </div>
      </div>

      {/* Ghost Route - Neon Orange Path */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d="M 20% 80% Q 50% 20%, 80% 60%"
          stroke="#ff4e00"
          strokeWidth="3"
          strokeDasharray="8 4"
          fill="none"
          className="opacity-70"
        />
      </svg>

      {/* Weather Overlay */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-8 right-8 bg-white border-2 border-black shadow-[4px_4px_0px_0px_black] p-4 z-10"
        >
          <div className="flex items-center gap-2 mb-2">
            {getWeatherIcon(weather.weathercode)}
            <span className="text-xs uppercase font-black tracking-tighter">
              TACTICAL WEATHER
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-zinc-500">TEMP</span>
              <span className="text-2xl font-black tracking-tighter">
                {Math.round(weather.temperature)}°C
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-zinc-500">WIND</span>
              <span className="text-2xl font-black tracking-tighter">
                {Math.round(weather.windspeed)}km/h
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Coordinates */}
      <div className="absolute bottom-8 left-8 bg-black text-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_#ff4e00]">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4 text-tactical-accent" />
          <span className="text-[10px] uppercase font-black tracking-widest">POSITION</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm font-bold">
          <div>
            <span className="text-[9px] uppercase text-zinc-400">LAT</span>
            <div className="text-tactical-accent">{coords.lat.toFixed(4)}</div>
          </div>
          <div>
            <span className="text-[9px] uppercase text-zinc-400">LON</span>
            <div className="text-tactical-accent">{coords.lon.toFixed(4)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
