import { Sun, Cloud, CloudRain, CloudLightning, CloudDrizzle, CloudFog, Snowflake, CloudSun } from "lucide-react";

interface WeatherIconProps {
  code: number;
  className?: string;
  strokeWidth?: number;
}

const WeatherIcon = ({ code, className = "w-8 h-8", strokeWidth = 1.5 }: WeatherIconProps) => {
  if (code === 0) return <Sun className={className} strokeWidth={strokeWidth} />;
  if (code <= 3) return <CloudSun className={className} strokeWidth={strokeWidth} />;
  if (code <= 48) return <CloudFog className={className} strokeWidth={strokeWidth} />;
  if (code <= 57) return <CloudDrizzle className={className} strokeWidth={strokeWidth} />;
  if (code <= 67) return <CloudRain className={className} strokeWidth={strokeWidth} />;
  if (code <= 77) return <Snowflake className={className} strokeWidth={strokeWidth} />;
  if (code <= 82) return <CloudRain className={className} strokeWidth={strokeWidth} />;
  if (code >= 95) return <CloudLightning className={className} strokeWidth={strokeWidth} />;
  return <Cloud className={className} strokeWidth={strokeWidth} />;
};

export default WeatherIcon;
