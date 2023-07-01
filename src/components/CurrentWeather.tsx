import { useQuery } from "@tanstack/react-query";
import { ReactElement, useContext } from "react";
import axios from "axios";
import { APIKey } from "../apikey";
import { CityContext, ICityCoord } from "./Search";
import { BsClouds } from "react-icons/bs";
import {
  WiBarometer,
  WiCloudy,
  WiDayCloudy,
  WiDayRain,
  WiDayShowers,
  WiDaySnow,
  WiDaySunny,
  WiDayThunderstorm,
  WiDirectionDown,
  WiDirectionDownLeft,
  WiDirectionDownRight,
  WiDirectionLeft,
  WiDirectionRight,
  WiDirectionUp,
  WiDirectionUpLeft,
  WiDirectionUpRight,
  WiNightAltRain,
  WiNightAltShowers,
  WiNightAltThunderstorm,
  WiNightClear,
  WiNightPartlyCloudy,
  WiNightSnow,
  WiRaindrop,
  WiSunrise,
  WiSunset,
} from "react-icons/wi";
import { TbMist } from "react-icons/tb";

interface IWeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface WeatherIcons {
  [key: string]: ReactElement;
}

export const weatherIcons: WeatherIcons = {
  _01d: <WiDaySunny className="icon-class" />,
  _01n: <WiNightClear className="icon-class" />,
  _02d: <WiDayCloudy className="icon-class" />,
  _02n: <WiNightPartlyCloudy className="icon-class" />,
  _03d: <WiCloudy className="icon-class" />,
  _03n: <WiCloudy className="icon-class" />,
  _04d: <BsClouds className="icon-class" />,
  _04n: <BsClouds className="icon-class" />,
  _09d: <WiDayShowers className="icon-class" />,
  _09n: <WiNightAltShowers className="icon-class" />,
  _10d: <WiDayRain className="icon-class" />,
  _10n: <WiNightAltRain className="icon-class" />,
  _11d: <WiDayThunderstorm className="icon-class" />,
  _11n: <WiNightAltThunderstorm className="icon-class" />,
  _13d: <WiDaySnow className="icon-class" />,
  _13n: <WiNightSnow className="icon-class" />,
  _50d: <TbMist className="icon-class" />,
  _50n: <TbMist className="icon-class" />,
};

export const directionIcons: WeatherIcons = {
  N: <WiDirectionDown className="direction-class" />,
  NE: <WiDirectionDownLeft className="direction-class" />,
  E: <WiDirectionLeft className="direction-class" />,
  SE: <WiDirectionUpLeft className="direction-class" />,
  S: <WiDirectionUp className="direction-class" />,
  SW: <WiDirectionUpRight className="direction-class" />,
  W: <WiDirectionRight className="direction-class" />,
  NW: <WiDirectionDownRight className="direction-class" />,
};

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

export function timeConverter(unixTimeStamp: number) {
  let date = new Date(unixTimeStamp * 1000);
  let hours = date.getHours();
  let meridiem = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  let minutes = date.getMinutes();

  return hours + ":" + (minutes < 10 ? "0" : "") + minutes + " " + meridiem;
}

export function getDirection(degree: number) {
  if (degree === 0) {
    return "N";
  } else if (degree > 0 && degree < 90) {
    return "NE";
  } else if (degree === 90) {
    return "E";
  } else if (degree > 90 && degree < 180) {
    return "SE";
  } else if (degree === 180) {
    return "S";
  } else if (degree > 180 && degree < 270) {
    return "SW";
  } else if (degree === 270) {
    return "W";
  } else if (degree > 270) {
    return "NW";
  } else {
    return "";
  }
}

export const Weather = () => {
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
          <div className="grid grid-cols-3 grid-rows-2 place-items-center m-auto whitespace-nowrap md:w-[35%]">
            <div title="Wind" className="flex relative">
              {directionIcons[getDirection(weather.wind.deg)]}
              <span>{weather.wind.speed.toPrecision(2)}m/s</span>
              <span className="font-bold ml-1">
                {getDirection(weather.wind.deg)}
              </span>
            </div>
            <div title="Pressure" className="flex relative">
              <WiBarometer className="direction-class"/>
              <span>{weather.main.pressure} hPa</span>
            </div>
            <div title="Humidity" className="flex relative">
              <WiRaindrop className="direction-class"/>
              <span>{weather.main.humidity}%</span>
            </div>
            <div className="">
              <div title="Sunrise" className="flex relative">
                <WiSunrise className="direction-class"/>
                <span>{timeConverter(weather.sys.sunrise)}</span>
              </div>
              <div title="Sunset" className="flex relative">
                <WiSunset className="direction-class"/>
                <span>{timeConverter(weather.sys.sunset)}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
