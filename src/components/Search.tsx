import { useState, useRef, createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APIKey } from "../apikey";
import { TbMapSearch } from "react-icons/tb";
import { MdOutlineLocationOn } from "react-icons/md";
import { Weather } from "./CurrentWeather";
import { HourlyWeather } from "./HourlyWeather";
import { MdOutlineMyLocation } from "react-icons/md";

interface ISearchResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

function fetchCity(searchTerm: string) {
  return useQuery(
    ["city", searchTerm],
    async () => {
      const result = await axios.get<ISearchResponse[]>(
        `https://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${APIKey}`
      );

      return result.data.map((city: ISearchResponse) => ({
        name: city.name,
        lat: city.lat,
        lon: city.lon,
        country: city.country,
        state: city?.state,
      }));
    },
    {
      enabled: searchTerm.length > 2,
    }
  );
}

export interface ICityCoord {
  lat: number;
  lon: number;
}

export let CityContext: any;

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [city, setCity] = useState<ICityCoord>({ lat: NaN, lon: NaN });
  const inputRef = useRef<HTMLUListElement>(null);

  CityContext = createContext(city);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCityCoord(position.coords.latitude, position.coords.longitude);
      });
    }
  }

  function setCityCoord(lat: number, lon: number) {
    setCity({
      lat: lat,
      lon: lon,
    });
  }

  const { data: cities } = fetchCity(searchTerm);

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 place-items-center">
        <h1 className="col-start-2 m-3 mt-6 whitespace-nowrap">
          Weather Search
        </h1>
        <div className="relative col-start-2 row-start-2">
          <input
            className="peer rounded-xl px-9 py-2 text-gray-500 shadow outline-none transition-all focus:rounded-2xl focus:bg-gray-300 focus:text-black"
            onBlur={() => {
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.style.opacity = "0";
                  setTimeout(() => {
                    if (inputRef.current)
                      inputRef.current.style.display = "none";
                  }, 100);
                }
              }, 200);
            }}
            onFocus={() => {
              if (inputRef.current) {
                inputRef.current.style.display = "block";
                inputRef.current.style.opacity = "1";
              }
            }}
            type="text"
            placeholder="Search for a city...or find your location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TbMapSearch className="absolute left-2 top-2 h-3/5 stroke-gray-500 peer-focus:stroke-gray-700" />
          <MdOutlineMyLocation
            className="absolute right-3 top-3 cursor-pointer rounded-full hover:fill-gray-700"
            onClick={getLocation}
          />
          <ul
            ref={inputRef}
            className="absolute my-2 w-full list-none rounded-lg bg-slate-300 text-gray-800"
          >
            {cities?.map((city) => (
              <li
                className=" relative mx-1 my-1 rounded px-8 py-2 hover:cursor-pointer hover:bg-slate-400 hover:text-black"
                onClick={() => setCityCoord(city.lat, city.lon)}
                key={city.lat}
              >
                <MdOutlineLocationOn className="absolute left-2 top-[0.73rem]" />
                {city.name}, {city.state ? city.state + "," : ""} {city.country}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="w-full">
        <CityContext.Provider value={city}>
          <Weather />
          <HourlyWeather />
        </CityContext.Provider>
      </div>
    </>
  );
};
