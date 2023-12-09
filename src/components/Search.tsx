import { useState, useRef, createContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APIKey } from "../apikey";
import { TbMapSearch } from "react-icons/tb";
import { MdOutlineLocationOn } from "react-icons/md";
import { MdOutlineMyLocation } from "react-icons/md";
import { Title } from "./Title";
import { Weather } from "./Weather";

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
      <div className="my-16 grid grid-cols-1 grid-rows-3 place-items-center items-center gap-4">
        <Title />

        <section className="relative row-span-2">
          <input
            className="search-bar peer w-full p-2 px-9 md:w-[40vw]"
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
            className="search-results absolute my-2 w-full rounded-lg bg-slate-300 text-gray-800"
          >
            {cities?.map((city) => (
              <li
                className="search-list"
                onClick={() => setCityCoord(city.lat, city.lon)}
                key={city.lat}
              >
                {/* <MdOutlineLocationOn className="absolute left-[-1.2rem] top-1 mx-[-1]" /> */}
                {city.name}, {city.state ? city.state + "," : ""} {city.country}
              </li>
            ))}
          </ul>
        </section>

        <section className="w-full">
          <CityContext.Provider value={city}>
            <Weather />
          </CityContext.Provider>
        </section>
      </div>
    </>
  );
};
