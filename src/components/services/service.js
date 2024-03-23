import { DateTime } from "luxon";

const API_KEY = "b2a523728ab430723367b6003c1a44cb";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const getWeatherData = (infoType, searchParams) => {
  const url = new URL(`${BASE_URL}/${infoType}`);
  url.search = new URLSearchParams({
    ...searchParams,
    appid: API_KEY,
  }).toString();

  return fetch(url).then((res) => res.json());
};

const formatCurrentWeather = (data) => {
  const {
    coord: { lat, lon },
    main: { temp, feels_like, temp_min, temp_max, humidity },
    name,
    dt,
    sys: { country, sunrise, sunset },
    weather,
    wind: { speed },
  } = data;

  const { main: details, icon } = weather[0];

  return {
    lat,
    lon,
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    name,
    dt,
    country,
    sunrise,
    sunset,
    weather,
    details,
    icon,
    speed,
  };
};

const getFormattedWeatherData = async (searchParams) => {
  const formattedWeatherData = await getWeatherData(
    "weather",
    searchParams
  ).then(formatCurrentWeather);

  return formattedWeatherData;
};
const formatToLocalTime = (
  secs,
  zone,
  format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => {
  const seconds = Number(secs);
  if (isNaN(seconds)) {
    console.error("Invalid seconds value:", secs);
    return "Invalid Time";
  }

  return DateTime.fromSeconds(secs).setZone(zone).toFormat(format);
};


const iconUrlFromCode = (code) =>
  `https://openweathermap.org/img/wn/${code}@2x.png`;
export default getFormattedWeatherData;
export { formatToLocalTime, iconUrlFromCode };
