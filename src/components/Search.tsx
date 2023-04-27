import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { APIKey } from "../apikey";
import { TbMapSearch } from "react-icons/tb";

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
        `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${APIKey}`
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

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const inputRef = useRef<HTMLUListElement>(null);

  const { data: cities } = fetchCity(searchTerm);

  return (
    <div className="grid h-screen grid-cols-[10vw_1fr_10vw] grid-rows-[10vw_auto_1fr] place-items-center bg-[#00487C]">
      <h1 className="col-start-2 row-start-1 m-4 text-4xl text-[#F8F1FF]">
        Weather Search
      </h1>
      <div className="relative col-start-2 row-start-2 w-[calc(50%+4rem)] ">
        <TbMapSearch className="absolute left-3 top-5" />
        <input
          onBlur={() => {
            setTimeout(() => {
              if (inputRef.current) {
                inputRef.current.style.opacity = "0";
                inputRef.current.addEventListener(
                  "animationend",
                  () => {
                    if (inputRef.current)
                      inputRef.current.style.display = "none";
                  },
                  {
                    once: true,
                  }
                );
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
          placeholder="Search for a city..."
          className="my-2 w-full rounded bg-[#4BB3FD] px-2 py-2 pl-9 shadow shadow-gray-800 outline-none transition placeholder:text-gray-500 hover:bg-[#3BA3ED] focus:bg-[#3BA3ED]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul
          ref={inputRef}
          className="absolute w-full list-none self-start rounded bg-[#4BB3FD] shadow transition"
        >
          {cities?.map((city) => (
            <li
              key={city.lat}
              className="m-1 cursor-pointer rounded-sm px-4 py-2 transition hover:bg-[#027BCE]"
            >
              {city.name}, {city.state ? city.state + "," : ""} {city.country}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
