import { Droplets, Wind, Eye, Thermometer } from "lucide-react";
import { CurrentWeather } from "@/lib/weather-service";

interface Props {
  weather: CurrentWeather;
}

const metrics = (w: CurrentWeather) => [
  { label: "Humidity", value: `${w.humidity}%`, icon: Droplets },
  { label: "Wind", value: `${w.windSpeed} km/h`, icon: Wind },
  { label: "Feels Like", value: `${w.feelsLike}°`, icon: Thermometer },
  { label: "Visibility", value: w.isDay ? "Day" : "Night", icon: Eye },
];

const WeatherMetrics = ({ weather }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics(weather).map((m) => (
        <div
          key={m.label}
          className="rounded-2xl bg-card/80 backdrop-blur-md border border-border p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <m.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              {m.label}
            </span>
          </div>
          <span className="text-xl font-medium tabular-nums text-foreground">{m.value}</span>
        </div>
      ))}
    </div>
  );
};

export default WeatherMetrics;
