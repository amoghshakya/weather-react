import { CurrentWeather } from "./CurrentWeather";
import { HourlyWeather } from "./HourlyWeather";

export const Weather = () => {
  return (
    <div className="w-full">
        <CurrentWeather />
        <HourlyWeather />
    </div>
  );
};
