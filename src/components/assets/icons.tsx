import { ReactElement } from "react";
import { BsClouds } from "react-icons/bs";
import {
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
} from "react-icons/wi";
import { TbMist } from "react-icons/tb";

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