import React from "react";
import { API_CONFIG } from "./apiKeys";
import Forcast from "./forcast";
import ReactAnimatedWeather from "react-animated-weather";

const dateBuilder = (d) => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];

  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();

  return `${day}, ${date} ${month} ${year}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    temperatureC: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    errorMsg: undefined,
    currentTime: new Date().toLocaleTimeString()
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch(() => {
          this.getWeather(28.67, 77.22);
        });
    }

    this.weatherInterval = setInterval(
      () => this.getWeather(this.state.lat, this.state.lon),
      600000
    );

    this.timeInterval = setInterval(
      () => this.setState({ currentTime: new Date().toLocaleTimeString() }),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.weatherInterval);
    clearInterval(this.timeInterval);
  }

  getPosition = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  getWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `${API_CONFIG.base}weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_CONFIG.key}`
      );
      const data = await response.json();
      
      this.setState({
        lat,
        lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        country: data.sys.country,
      });

      this.updateWeatherIcon(data.weather[0].main);
    } catch (error) {
      this.setState({ errorMsg: "Error fetching weather data" });
    }
  };

  updateWeatherIcon = (weatherMain) => {
    const iconMap = {
      Haze: "CLEAR_DAY",
      Clouds: "CLOUDY",
      Rain: "RAIN",
      Snow: "SNOW",
      Dust: "WIND",
      Drizzle: "SLEET",
      Fog: "FOG",
      Smoke: "FOG",
      Tornado: "WIND"
    };

    this.setState({ icon: iconMap[weatherMain] || "CLEAR_DAY" });
  };

  render() {
    const { temperatureC, city, country, icon, main, currentTime } = this.state;

    if (temperatureC) {
      return (
        <React.Fragment>
          <div className="city">
            <div className="title">
              <h2>{city}</h2>
              <h3>{country}</h3>
            </div>
            <div className="mb-icon">
              <ReactAnimatedWeather
                icon={icon}
                color={defaults.color}
                size={defaults.size}
                animate={defaults.animate}
              />
              <p>{main}</p>
            </div>
            <div className="date-time">
              <div className="dmy">
                <div className="current-time">{currentTime}</div>
                <div className="current-date">{dateBuilder(new Date())}</div>
              </div>
              <div className="temperature">
                <p>
                  {temperatureC}°<span>C</span>
                </p>
              </div>
            </div>
          </div>
          <Forcast icon={icon} weather={main} />
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <div className="loading-screen">
          <h3>Detecting your location</h3>
          <h3>Your current location will be displayed on the App</h3>
        </div>
      </React.Fragment>
    );
  }
}

export default Weather;
