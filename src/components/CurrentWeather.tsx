import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import axios from "axios";
import { APIKey } from "../apikey";
import { CityContext, ICityCoord } from "./Search";
import {
  WiBarometer,
  WiRaindrop,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";
import { getDirection, timeConverter } from "./assets/functions";
import { weatherIcons, directionIcons } from "./assets/icons";
import { IWeatherResponse } from "./assets/interfaces";



const fetchCurrentWeather = (lat: number, lon: number) => {
  return useQuery(
    ["weather", lat, lon],
    async () => {
      const result = await axios.get<IWeatherResponse>(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric`
      );

      return result.data;
    },
    {
      enabled: Boolean(lat && lon),
      refetchInterval: 60000,
    }
  );
};



export const CurrentWeather = () => {
  const city: ICityCoord = useContext(CityContext);
  const { data: weather } = fetchCurrentWeather(city.lat, city.lon);

  let icon = "_" + weather?.weather[0].icon;

  return (
    <div>
      {weather && (
        <>
          <div className="grid w-auto grid-cols-1 grid-rows-3 place-items-center">
            <h1 className="font-3xl col-start-1 row-start-1 whitespace-nowrap font-semibold">
              {weather.name}, {weather.sys.country}
            </h1>
            <div className="col-start-1 row-start-2 flex">
              <span>{weatherIcons[icon]}</span>
              <span className="text-6xl font-semibold">
                {weather.main.temp.toPrecision(2) + "°C"}
              </span>
            </div>
            <span className="text-lg font-medium">
              {"Feels like " + weather.main.feels_like.toPrecision(2) + "°C"} ·{" "}
              {weather.weather[0].description[0].toUpperCase() +
                weather.weather[0].description.slice(1)}
            </span>
          </div>
          <div className="m-auto grid grid-cols-3 grid-rows-2 place-items-center whitespace-nowrap md:w-[35%]">
            <div title="Wind" className="relative flex">
              {directionIcons[getDirection(weather.wind.deg)]}
              <span>{weather.wind.speed.toPrecision(2)}m/s</span>
              <span className="ml-1 font-bold">
                {getDirection(weather.wind.deg)}
              </span>
            </div>
            <div title="Pressure" className="relative flex">
              <WiBarometer className="direction-class" />
              <span>{weather.main.pressure} hPa</span>
            </div>
            <div title="Humidity" className="relative flex">
              <WiRaindrop className="direction-class" />
              <span>{weather.main.humidity}%</span>
            </div>
            <div className="">
              <div title="Sunrise" className="relative flex">
                <WiSunrise className="direction-class" />
                <span>{timeConverter(weather.sys.sunrise)}</span>
              </div>
              <div title="Sunset" className="relative flex">
                <WiSunset className="direction-class" />
                <span>{timeConverter(weather.sys.sunset)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
