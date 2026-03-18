import { HourlyData } from "@/lib/weather-service";
import WeatherIcon from "./WeatherIcon";

interface Props {
  hourly: HourlyData[];
}

const HourlyForecast = ({ hourly }: Props) => {
  return (
    <div className="rounded-3xl bg-card/80 backdrop-blur-md border border-border p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase mb-4">
        Next 24 hours
      </h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {hourly.map((h, i) => {
          const hour = new Date(h.time);
          const label = i === 0 ? "Now" : hour.toLocaleTimeString("en-NG", { hour: "numeric", hour12: true });
          return (
            <div key={h.time} className="flex flex-col items-center gap-2 min-w-[56px]">
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
              <WeatherIcon code={h.weatherCode} className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
              <span className="text-sm font-medium tabular-nums text-foreground">{h.temperature}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
