import { useState, useEffect, useCallback } from "react";
import { fetchWeather, WeatherData, NigerianCity, NIGERIAN_CITIES, getWeatherMood } from "@/lib/weather-service";

const STORAGE_KEY = "naija-sky-last-city";

function getSavedCity(): NigerianCity {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed as NigerianCity;
    }
  } catch {}
  return NIGERIAN_CITIES[0]; // Lagos
}

export function useWeather() {
  const [city, setCity] = useState<NigerianCity>(getSavedCity);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async (c: NigerianCity) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(c.lat, c.lon);
      setWeather(data);
    } catch {
      setError("Could not load weather data. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(city);
  }, [city, loadWeather]);

  const selectCity = useCallback((c: NigerianCity) => {
    setCity(c);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  }, []);

  const mood = weather ? getWeatherMood(weather.current.weatherCode) : "clear";

  return { city, weather, loading, error, selectCity, mood, retry: () => loadWeather(city) };
}
