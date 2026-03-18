import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, RefreshCw } from "lucide-react";
import { useWeather } from "@/hooks/useWeather";
import CitySearch from "@/components/CitySearch";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import HourlyForecast from "@/components/HourlyForecast";
import SevenDayForecast from "@/components/SevenDayForecast";
import WeatherMetrics from "@/components/WeatherMetrics";
import WeatherSkeleton from "@/components/WeatherSkeleton";
import { NIGERIAN_CITIES } from "@/lib/weather-service";

const moodGradients: Record<string, string> = {
  clear: "from-amber-50/30 via-background to-background",
  cloudy: "from-slate-200/30 via-background to-background",
  rain: "from-blue-100/30 via-background to-background",
  storm: "from-slate-300/40 via-background to-background",
};

const Index = () => {
  const { city, weather, loading, error, selectCity, mood, retry } = useWeather();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      // Find closest Nigerian city
      let closest = NIGERIAN_CITIES[0];
      let minDist = Infinity;
      for (const c of NIGERIAN_CITIES) {
        const d = Math.sqrt((c.lat - latitude) ** 2 + (c.lon - longitude) ** 2);
        if (d < minDist) { minDist = d; closest = c; }
      }
      selectCity(closest);
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center space-y-4 max-w-sm">
          <p className="text-foreground font-medium">{error}</p>
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${moodGradients[mood] || moodGradients.clear} transition-colors duration-1000`}>
      {/* Header */}
      <header className="flex items-center justify-between gap-4 p-4 md:px-8 md:pt-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold tracking-tight text-foreground">NaijaSky</h1>
          <button
            onClick={handleDetectLocation}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-secondary/60"
          >
            <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="hidden sm:inline">My location</span>
          </button>
        </div>
        <CitySearch currentCity={city.name} onSelectCity={(c) => { selectCity(c); setSelectedDayIndex(null); }} />
      </header>

      {/* Content */}
      {loading || !weather ? (
        <WeatherSkeleton />
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={city.name}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 md:px-8 max-w-5xl mx-auto"
          >
            {/* Main column */}
            <section className="md:col-span-8 space-y-4">
              <CurrentWeatherCard
                weather={weather.current}
                cityName={city.name}
                selectedDay={selectedDayIndex !== null ? weather.daily[selectedDayIndex] : null}
              />
              <HourlyForecast hourly={weather.hourly} />
            </section>

            {/* Sidebar */}
            <aside className="md:col-span-4 space-y-4">
              <SevenDayForecast
                daily={weather.daily}
                selectedIndex={selectedDayIndex}
                onSelectDay={setSelectedDayIndex}
              />
              <WeatherMetrics weather={weather.current} />
            </aside>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Index;
