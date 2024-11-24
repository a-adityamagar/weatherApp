import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_CONFIG } from './apiKeys';
import ReactAnimatedWeather from "react-animated-weather";

function Forecast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(false);

  const search = async (city) => {
    setLoading(true);
    try {
      const searchCity = city !== "[object Object]" ? city : query;
      const response = await axios.get(
        `${API_CONFIG.base}weather?q=${searchCity}&units=metric&APPID=${API_CONFIG.key}`
      );
      setWeather(response.data);
      setQuery("");
      setError("");
    } catch (err) {
      setWeather({});
      setQuery("");
      setError({ message: "City Not Found", query });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search("Biratnagar");
  }, []);

  const defaults = {
    color: "white",
    size: 112,
    animate: true
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && query.trim()) {
      search(query);
    }
  };

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            onKeyPress={handleKeyPress}
          />
          <button 
            onClick={() => query.trim() && search(query)}
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {weather.main ? (
          <ul className="weather-details">
            <li className="cityHead">
              <p>{weather.name}, {weather.sys.country}</p>
              <img
                alt={weather.weather[0].description}
                className="temp"
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              />
            </li>
            <li>
              Temperature{" "}
              <span className="temp">
                {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
              </span>
            </li>
            <li>
              Humidity <span className="temp">{Math.round(weather.main.humidity)}%</span>
            </li>
            <li>
              Visibility <span className="temp">{Math.round(weather.visibility)} mi</span>
            </li>
            <li>
              Wind Speed <span className="temp">{Math.round(weather.wind.speed)} Km/h</span>
            </li>
          </ul>
        ) : (
          <p className="error-message">{error.message}</p>
        )}
      </div>
    </div>
  );
}

export default Forecast;
