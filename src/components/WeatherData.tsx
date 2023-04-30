import { useQuery } from "@tanstack/react-query";
import { ReactElement, useContext } from "react";
import axios from "axios";
import { APIKey } from "../apikey";
import { CityContext, ICityCoord } from "./Search";
import {
  WiCloudy,
  WiDayCloudy,
  WiDayRain,
  WiDayShowers,
  WiDaySnow,
  WiDaySunny,
  WiDayThunderstorm,
  WiNightAltRain,
  WiNightAltShowers,
  WiNightAltThunderstorm,
  WiNightClear,
  WiNightCloudy,
  WiNightPartlyCloudy,
  WiNightSnow,
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

interface WeatherIcons {
  [key: string]: ReactElement;
}

const weatherIcons: WeatherIcons = {
  _01d: <WiDaySunny className="icon-class" />,
  _01n: <WiNightClear className="icon-class" />,
  _02d: <WiDayCloudy className="icon-class" />,
  _02n: <WiNightPartlyCloudy className="icon-class" />,
  _03d: <WiCloudy className="icon-class" />,
  _03n: <WiCloudy className="icon-class" />,
  _04d: <WiDayCloudy className="icon-class" />,
  _04n: <WiNightCloudy className="icon-class" />,
  _09d: <WiDayShowers className="icon-class" />,
  _09n: <WiNightAltShowers className="icon-class" />,
  _10d: <WiDayRain className="icon-class" />,
  _10n: <WiNightAltRain className="icon-class" />,
  _11d: <WiDayThunderstorm className="icon-class" />,
  _11n: <WiNightAltThunderstorm className="icon-class" />,
  _13d: <WiDaySnow className="icon-class" />,
  _13n: <WiNightSnow className="icon-class" />,
  _50d: <TbMist className="icon-class" />,
};

const fetchWeather = (lat: number, lon: number) => {
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
    }
  );
};

export const Weather = () => {
  const city: ICityCoord = useContext(CityContext);
  const { data: weather } = fetchWeather(city.lat, city.lon);

  function timeConverter(unixTimeStamp: number) {
    let date = new Date(unixTimeStamp * 1000);
    let hours = date.getHours();
    let meridiem = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    return (
      hours +
      ":" +
      (minutes < 10 ? "0" : "") +
      minutes +
      ":" +
      (seconds < 10 ? "0" : "") +
      seconds +
      " " +
      meridiem
    );
  }

  let icon = "_" + weather?.weather[0].icon;

  return (
    <div className="col-start-2 row-start-3">
      <h1>
        {weather?.name} {weather?.sys.country}
      </h1>
      <p>{weather && "Temp: " + weather?.main.temp + "°C"}</p>
      <p>{weather && "Feels like: " + weather?.main.feels_like + "°C"}</p>
      <p>{weather && "Weather: " + weather.weather[0].description}</p>
      <p>{weather && "Humidity: " + weather?.main.humidity}</p>
      {weatherIcons[icon]}
      <p>{weather && "Pressure: " + weather?.main.pressure + "hPa"}</p>
      <p>{weather && "Min Temp: " + weather?.main.temp_min + "°C"}</p>
      <p>{weather && "Max Temp: " + weather?.main.temp_max + "°C"}</p>
      <p>{weather && "Sunrise: " + timeConverter(weather.sys.sunrise)}</p>
      <p>{weather && "Sunset: " + timeConverter(weather.sys.sunset)}</p>
    </div>
  );
};
