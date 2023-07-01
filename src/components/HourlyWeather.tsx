import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APIKey } from "../apikey";
import { CityContext, ICityCoord } from "./Search";
import React, { useContext } from "react";
import { weatherIcons } from "./CurrentWeather";
import { useRef } from "react";

interface IHourlyWeatherResponse {
  cod: string;
  message: number;
  cnt: number;
  list: {
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: {
      id: number;
      main: string;
      description: string;
      icon: number;
    }[];
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
    visibility: number;
    pop: number;
    rain: {
      "3h": number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

const fetchHourlyWeather = (lat: number, lon: number) => {
  return useQuery(
    ["hourlyWeather", lat, lon],
    async () => {
      const weather = await axios.get<IHourlyWeatherResponse>(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric&cnt=40`
      );
      let list = weather.data.list;
      let result = [];
      let previousDt = null;
      for (let obj of list) {
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

function getDay(unixTimeStamp: number) {
  let date = new Date(unixTimeStamp * 1000);
  let day = date.getDay();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

export const HourlyWeather = () => {
  const city: ICityCoord = useContext(CityContext);
  const { data: hourlyWeather } = fetchHourlyWeather(city.lat, city.lon);

  const divRef = useRef<HTMLDivElement>(null);

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
                  ? "hourly-class border-[dodgerblue] border"
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
