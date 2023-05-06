import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APIKey } from "../apikey";
import { CityContext, ICityCoord } from "./Search";
import React, { useContext } from "react";
import { timeConverter, weatherIcons } from "./CurrentWeather";
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
      const result = await axios.get<IHourlyWeatherResponse>(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}&units=metric&cnt=14`
      );
      return result.data;
    },
    {
      enabled: Boolean(lat && lon),
      refetchInterval: 60000,
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
    <>
      {hourlyWeather && (
        <div
          className="col-span-3 col-start-2 row-span-2 row-start-1 max-md:col-start-1 max-md:col-span-2 max-md:row-start-4 max-md:row-span-4 flex snap-x snap-mandatory gap-2 overflow-auto scroll-smooth rounded p-2 shadow-gray-800"
          id="hourly"
          ref={divRef}
          onWheel={handleScroll}
          title="3 hour forecast"
        >
          {hourlyWeather.list.map((item) => (
            <div
              className="m-1 flex w-48 flex-shrink-0 cursor-pointer snap-start flex-col items-center justify-center gap-1 rounded-lg border border-[dodgerblue] px-4 text-center hover:bg-[#111950]"
              key={item.dt_txt}
            >
              <span className="m-2">
                {weatherIcons["_" + item.weather[0].icon]}{" "}
              </span>
              <span className="text-2xl">
                {item.main.temp.toPrecision(2) + "°C"}
              </span>
              <span className="whitespace-nowrap">
                {item.weather[0].description[0].toUpperCase() +
                  item.weather[0].description.slice(1)}
              </span>
              <div className="flex flex-col justify-center break-words text-center">
                <span className="font-bold">{getDay(item.dt)}</span>
                <span>{timeConverter(item.dt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
