import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import axios from "axios";
import { APIKey } from "../apikey";
import { CityContext, ICityCoord } from "./Search";

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

  return (
    <div className="col-start-2 row-start-3">
      <h1>
        {weather?.name} {weather?.sys.country}
      </h1>
      <p>{weather && "Temp: " + weather?.main.temp + "°C"}</p>
      <p>{weather && "Feels like: " + weather?.main.feels_like + "°C"}</p>
      <p>{weather && "Humidity: " + weather?.main.humidity}</p>
      <p>{weather && "Pressure: " + weather?.main.pressure}</p>
      <p>{weather && "Min Temp: " + weather?.main.temp_min + "°C"}</p>
      <p>{weather && "Max Temp: " + weather?.main.temp_max + "°C"}</p>
      <p>{weather && "Sunrise: " + timeConverter(weather.sys.sunrise)}</p>
      <p>{weather && "Sunset: " + timeConverter(weather.sys.sunset)}</p>
    </div>
  );
};
