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

export function getDay(unixTimeStamp: number) {
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
