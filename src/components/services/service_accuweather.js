import { DateTime } from "luxon";

const API_KEY = "ljdI1OGrX3hQCDNbyLtVxoCvGLmZZLfl";

const getLocationKey = async (cityName) => {
  const base = "https://dataservice.accuweather.com/locations/v1/cities/search";
  const query = `?apikey=${API_KEY}&q=${cityName}`;

  const response = await fetch(base + query);
  const data = await response.json();

  if (data.length > 0) {
    return data[0].Key;
  } else {
    throw new Error("Location not found");
  }
};

const formatToHHMM = (dateTimeString, zone) => {
  const dateTime = DateTime.fromISO(dateTimeString, { zone });

  if (!dateTime.isValid) {
    console.error("Invalid DateTime:", dateTimeString);
    return "Invalid Time";
  }

  return dateTime.toFormat("hh:mm a");
};
const formatToCCC = (dateTimeString, zone) => {
  const dateTime = DateTime.fromISO(dateTimeString, { zone });

  if (!dateTime.isValid) {
    console.error("Invalid DateTime:", dateTimeString);
    return "Invalid Time";
  }

  return dateTime.toFormat("ccc");
};

const getHourly = async (locationKey) => {
  const base = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}`;
  const query = `?apikey=${API_KEY}`;

  try {
    const response = await fetch(base + query);
    if (!response.ok) {
      throw new Error("Request failed with status: " + response.status);
    }
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching hourly data:", error);
  }
};

const getDaily = async (locationKey) => {
  const base = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`;
  const query = `?apikey=${API_KEY}`;

  try {
    const response = await fetch(base + query);
    if (!response.ok) {
      throw new Error("Request failed with status: " + response.status);
    }
    const data = await response.json();
    console.log(data);
    return data.DailyForecasts;
  } catch (error) {
    console.error("Error fetching daily data:", error);
  }
};


const formatHourlyForecast = (hourlyData, timezone) => {
  const formattedHourlyData = hourlyData.slice(0, 5).map((hour) => {
    // Convert Fahrenheit to Celsius
    const tempCelsius = ((hour.Temperature.Value - 32) * 5) / 9;

    return {
      title: formatToHHMM(hour.DateTime, timezone, "ccc"),
      temp: tempCelsius.toFixed(), // Round to 1 decimal place
      icon: hour.WeatherIcon,
    };
  });

  return formattedHourlyData;
};

const formatDailyForecast = (dailyData, timezone) => {
  const formattedDailyData = dailyData.slice(0, 5).map((day) => {
    // Convert Fahrenheit to Celsius for maximum temperature
    const maxTempCelsius = ((day.Temperature.Maximum.Value - 32) * 5) / 9;

    return {
      title: formatToCCC(day.Date, timezone, "ccc"),
      temp: maxTempCelsius.toFixed(), // Round to 1 decimal place
      icon: day.Day.Icon,
    };
  });

  return formattedDailyData;
};


export {  getLocationKey,getDaily,getHourly,formatDailyForecast, formatHourlyForecast };
