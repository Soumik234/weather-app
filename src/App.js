import "./App.css";
import UilReact from "@iconscout/react-unicons/icons/uil-react";
import TopButton from "./components/TopButton";
import Inputs from "./components/Inputs";
import TimeLocation from "./components/TimeLocation";
import TemperatureDetails from "./components/TemperatureDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData from "./components/services/service";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getLocationKey,
  getHourly,
  getDaily,
  formatHourlyForecast,
  formatDailyForecast,
} from "./components/services/service_accuweather";

function App() {
  const [query, setQuery] = useState({ q: "london" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const message=query.q? query.q:'current location.'

      toast.info('Fetching weather for '+ message);
      try {
        const data = await getFormattedWeatherData({ ...query, units });
        toast.success(`Successfully fetched weather for ${data.name}, ${data.country}.`)
        setWeather(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };
    fetchWeatherData();
  }, [query, units]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const locationKey = await getLocationKey(query.q);
        

        const hourlyData = await getHourly(locationKey);
        setHourlyForecast(hourlyData);

        const dailyData = await getDaily(locationKey);
        setDailyForecast(dailyData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, [query]);

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 30 : 86;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
  };
  return (
    <div
      className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}
    >
      <TopButton setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {weather && (
        <div>
          <TimeLocation weather={weather} />
          <TemperatureDetails weather={weather} />
          <Forecast
            title="Hourly Forecast"
            data={formatHourlyForecast(hourlyForecast, weather.timezone)}
          />
          <Forecast
            title="Daily Forecast"
            data={formatDailyForecast(dailyForecast, weather.timezone)}
          />
        </div>
      )}

      <ToastContainer autoClose={5000} theme='colored' newestOnTop={true}/>
    </div>
  );
}

export default App;
