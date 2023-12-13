import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APIKey } from "../apikey";
import { CityContext, ICityCoord } from "./Search";
import React, { useContext } from "react";
import { weatherIcons } from "./assets/icons";
import { useRef } from "react";
import { IHourlyWeatherResponse } from "./assets/interfaces";
import { getDay } from "./assets/functions";


const fetchHourlyWeather = (lat: number, lon: number) => {
  return useQuery(
    ["hourlyWeather", lat, lon],
    async () => {
      const weather = await axios.get<IHourlyWeatherResponse>(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric&cnt=40`
      );
      // since we can only fetch weather hourly and not on daily basis
      // we separate it by hours or (86400 seconds i.e., 24 hours)
      let list = weather.data.list;
      let result = [];
      let previousDt = null;

      for (let obj of list) {
        // only push weather of the time that is exactly 24 hours away from current weather (i.e., next day)
        if (previousDt === null || obj.dt === previousDt + 86400) {
          result.push(obj);
          previousDt = obj.dt;
        }
      }

      return result;
    },
    {
      enabled: Boolean(lat && lon),
      refetchInterval: 300000,
    }
  );
};

export const HourlyWeather = () => {
  const city: ICityCoord = useContext(CityContext);
  const { data: hourlyWeather } = fetchHourlyWeather(city.lat, city.lon);

  const divRef = useRef<HTMLDivElement>(null);

  // this function is supposed to allow us to horizontally scroll
  // usually the whole thing fits on the screen so this function is pointless
  // only useful when the hourly weather thing wraps?
  function handleScroll(event: React.WheelEvent) {
    const element = divRef.current;
    if (element) {
      const delta = event.deltaY;
      element.scrollLeft += delta * 2;
    }
  }

  return (
    <div className="flex justify-center">
      {hourlyWeather && (
        <div
          className="mx-4 mt-4 flex snap-x snap-proximity justify-start overflow-x-auto scroll-smooth p-4"
          ref={divRef}
          onWheel={handleScroll}
        >
          {hourlyWeather.map((item, index) => (
            <div
              className={
                index === 0
                  ? "hourly-class font-bold opacity-50 hover:cursor-default hover:bg-[#111950]"
                  : "hourly-class"
              }
              key={item.dt_txt}
              title={
                item.weather[0].description[0].toUpperCase() +
                item.weather[0].description.slice(1)
              }
            >
              <span className="m-2">
                {weatherIcons["_" + item.weather[0].icon]}{" "}
              </span>
              <span className="text-xl">
                {item.main.temp.toPrecision(2) + "°C"}
              </span>
              <div>
                <span>{getDay(item.dt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
