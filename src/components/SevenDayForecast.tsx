import { motion } from "framer-motion";
import { DailyData } from "@/lib/weather-service";
import WeatherIcon from "./WeatherIcon";

interface Props {
  daily: DailyData[];
  selectedIndex: number | null;
  onSelectDay: (index: number | null) => void;
}

const SevenDayForecast = ({ daily, selectedIndex, onSelectDay }: Props) => {
  return (
    <div className="rounded-3xl bg-card/80 backdrop-blur-md border border-border p-4 md:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          7-Day Forecast
        </h2>
        {selectedIndex !== null && (
          <button
            onClick={() => onSelectDay(null)}
            className="text-xs text-accent font-medium hover:underline"
          >
            Back to today
          </button>
        )}
      </div>
      <div className="space-y-1">
        {daily.map((day, i) => {
          const date = new Date(day.date);
          const dayName = i === 0 ? "Today" : date.toLocaleDateString("en-NG", { weekday: "short" });
          const dateStr = date.toLocaleDateString("en-NG", { month: "short", day: "numeric" });
          const isSelected = selectedIndex === i;

          return (
            <motion.button
              key={day.date}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -1 }}
              onClick={() => onSelectDay(i === 0 ? null : i)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-colors ${
                isSelected
                  ? "bg-accent/15 border border-accent/30"
                  : "hover:bg-secondary/60 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3 min-w-[100px]">
                <span className="text-sm font-medium text-foreground w-12 text-left">{dayName}</span>
                <span className="text-xs text-muted-foreground">{dateStr}</span>
              </div>
              <WeatherIcon code={day.weatherCode} className="w-6 h-6 text-foreground/70" strokeWidth={1.5} />
              <div className="flex items-center gap-2 tabular-nums">
                <span className="text-sm font-medium text-foreground">{day.tempMax}°</span>
                <span className="text-sm text-muted-foreground">{day.tempMin}°</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SevenDayForecast;
