import { motion } from "framer-motion";
import WeatherIcon from "./WeatherIcon";
import { CurrentWeather, DailyData, getWeatherCondition } from "@/lib/weather-service";

interface Props {
  weather: CurrentWeather;
  cityName: string;
  selectedDay: DailyData | null;
}

const CurrentWeatherCard = ({ weather, cityName, selectedDay }: Props) => {
  const isViewingFuture = !!selectedDay;
  const temp = isViewingFuture ? selectedDay.tempMax : weather.temperature;
  const code = isViewingFuture ? selectedDay.weatherCode : weather.weatherCode;
  const condition = getWeatherCondition(code);
  const feelsLike = isViewingFuture ? selectedDay.tempMin : weather.feelsLike;

  const dateLabel = isViewingFuture
    ? new Date(selectedDay.date).toLocaleDateString("en-NG", { weekday: "long", month: "short", day: "numeric" })
    : "Right now";

  return (
    <motion.div
      layout
      className="relative rounded-3xl bg-card/80 backdrop-blur-md border border-border p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {dateLabel}
          </p>
          <h1 className="text-lg font-medium text-foreground">{cityName}</h1>
        </div>
        <WeatherIcon code={code} className="w-12 h-12 text-accent" strokeWidth={1.5} />
      </div>

      <motion.div
        key={`${cityName}-${isViewingFuture ? selectedDay?.date : "now"}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-6"
      >
        <div className="flex items-baseline gap-1">
          <span className="text-6xl md:text-8xl font-medium tracking-[-0.04em] tabular-nums text-foreground">
            {temp}°
          </span>
        </div>
        <p className="text-base text-muted-foreground mt-1">{condition}</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isViewingFuture ? `Low ${feelsLike}°` : `Feels like ${feelsLike}°`}
        </p>
      </motion.div>

      {!isViewingFuture && (
        <p className="mt-6 text-sm text-muted-foreground">
          {cityName} is currently {weather.temperature}° and{" "}
          {weather.humidity > 70 ? "humid" : weather.humidity > 40 ? "comfortable" : "dry"}.
        </p>
      )}
    </motion.div>
  );
};

export default CurrentWeatherCard;
