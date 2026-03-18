export interface NigerianCity {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export const NIGERIAN_CITIES: NigerianCity[] = [
  { name: "Lagos", state: "Lagos", lat: 6.5244, lon: 3.3792 },
  { name: "Abuja", state: "FCT", lat: 9.0579, lon: 7.4951 },
  { name: "Kano", state: "Kano", lat: 12.0022, lon: 8.5920 },
  { name: "Ibadan", state: "Oyo", lat: 7.3775, lon: 3.9470 },
  { name: "Port Harcourt", state: "Rivers", lat: 4.8156, lon: 7.0498 },
  { name: "Benin City", state: "Edo", lat: 6.3350, lon: 5.6037 },
  { name: "Maiduguri", state: "Borno", lat: 11.8311, lon: 13.1510 },
  { name: "Zaria", state: "Kaduna", lat: 11.0855, lon: 7.7199 },
  { name: "Aba", state: "Abia", lat: 5.1066, lon: 7.3667 },
  { name: "Jos", state: "Plateau", lat: 9.8965, lon: 8.8583 },
  { name: "Ilorin", state: "Kwara", lat: 8.4966, lon: 4.5426 },
  { name: "Oyo", state: "Oyo", lat: 7.8500, lon: 3.9333 },
  { name: "Enugu", state: "Enugu", lat: 6.4584, lon: 7.5464 },
  { name: "Abeokuta", state: "Ogun", lat: 7.1475, lon: 3.3619 },
  { name: "Warri", state: "Delta", lat: 5.5167, lon: 5.7500 },
  { name: "Sokoto", state: "Sokoto", lat: 13.0059, lon: 5.2476 },
  { name: "Calabar", state: "Cross River", lat: 4.9517, lon: 8.3220 },
  { name: "Uyo", state: "Akwa Ibom", lat: 5.0377, lon: 7.9128 },
  { name: "Kaduna", state: "Kaduna", lat: 10.5105, lon: 7.4165 },
  { name: "Owerri", state: "Imo", lat: 5.4836, lon: 7.0333 },
  { name: "Lekki", state: "Lagos", lat: 6.4474, lon: 3.4712 },
  { name: "Ikeja", state: "Lagos", lat: 6.6018, lon: 3.3515 },
];

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

export interface HourlyData {
  time: string;
  temperature: number;
  weatherCode: number;
}

export interface DailyData {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyData[];
  daily: DailyData[];
}

export function getWeatherCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 57) return "Drizzle";
  if (code <= 65) return "Rain";
  if (code <= 67) return "Freezing Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Rain Showers";
  if (code <= 86) return "Snow Showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

export function getWeatherMood(code: number): "clear" | "cloudy" | "rain" | "storm" {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code <= 67 || (code >= 80 && code <= 82)) return "rain";
  if (code >= 95) return "storm";
  return "cloudy";
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Africa%2FLagos&forecast_days=7`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch weather data");
  const data = await res.json();

  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
    isDay: data.current.is_day === 1,
  };

  // Next 24 hours
  const now = new Date();
  const currentHourIndex = data.hourly.time.findIndex((t: string) => new Date(t) >= now);
  const hourlySlice = data.hourly.time.slice(currentHourIndex, currentHourIndex + 24);
  const hourly: HourlyData[] = hourlySlice.map((t: string, i: number) => ({
    time: t,
    temperature: Math.round(data.hourly.temperature_2m[currentHourIndex + i]),
    weatherCode: data.hourly.weather_code[currentHourIndex + i],
  }));

  const daily: DailyData[] = data.daily.time.map((t: string, i: number) => ({
    date: t,
    tempMax: Math.round(data.daily.temperature_2m_max[i]),
    tempMin: Math.round(data.daily.temperature_2m_min[i]),
    weatherCode: data.daily.weather_code[i],
    precipitationProbability: data.daily.precipitation_probability_max[i],
  }));

  return { current, hourly, daily };
}

export function searchCities(query: string): NigerianCity[] {
  if (!query.trim()) return [];
  return NIGERIAN_CITIES.filter(city =>
    city.name.toLowerCase().startsWith(query.toLowerCase()) ||
    city.state.toLowerCase().startsWith(query.toLowerCase())
  );
}
