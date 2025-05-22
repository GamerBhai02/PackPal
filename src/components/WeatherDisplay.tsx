import React from 'react';
import { useTrip } from '../context/TripContext';
import { CloudRain, Sun, Cloud, CloudSnow, CloudLightning, Thermometer } from 'lucide-react';

const WeatherDisplay: React.FC = () => {
  const { weather, isLoadingWeather, weatherError } = useTrip();
  
  if (isLoadingWeather) {
    return (
      <div className="card p-6">
        <h2 className="section-title">Weather Forecast</h2>
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600">Loading weather forecast...</p>
        </div>
      </div>
    );
  }
  
  if (weatherError) {
    return (
      <div className="card p-6">
        <h2 className="section-title">Weather Forecast</h2>
        <div className="bg-error-50 text-error-700 p-4 rounded-md">
          <p>{weatherError}</p>
          <p className="text-sm mt-2">Please check your destination details and try again.</p>
        </div>
      </div>
    );
  }
  
  if (!weather) return null;
  
  const getWeatherIcon = (code: string) => {
    // WeatherAPI.com condition codes
    const codeNum = parseInt(code);
    if (codeNum === 1000) return <Sun className="text-accent-500" size={28} />; // Clear
    if (codeNum >= 1003 && codeNum <= 1009) return <Cloud className="text-gray-400" size={28} />; // Cloudy
    if (codeNum >= 1180 && codeNum <= 1201) return <CloudRain className="text-primary-400" size={28} />; // Rain
    if (codeNum >= 1273 && codeNum <= 1282) return <CloudLightning className="text-warning-500" size={28} />; // Thunder
    if (codeNum >= 1210 && codeNum <= 1225) return <CloudSnow className="text-secondary-300" size={28} />; // Snow
    return <Cloud className="text-gray-400" size={28} />;
  };
  
  const getTemperatureColorClass = (temp: number) => {
    if (temp >= 30) return 'text-red-600';
    if (temp >= 25) return 'text-accent-600';
    if (temp >= 15) return 'text-accent-500';
    if (temp >= 5) return 'text-primary-500';
    return 'text-blue-600';
  };
  
  return (
    <div className="card p-6">
      <h2 className="section-title flex items-center gap-2">
        <Thermometer size={18} />
        Weather Forecast for {weather.city}, {weather.country}
      </h2>
      
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {getWeatherIcon(weather.current.icon)}
          <div>
            <span className={`text-2xl font-bold ${getTemperatureColorClass(weather.current.temp)}`}>
              {weather.current.temp}°C
            </span>
            <p className="text-gray-600 capitalize">{weather.current.description}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          Humidity: {weather.current.humidity}%
        </p>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-max">
          {weather.daily.map((day, index) => (
            <div key={index} className="w-32 rounded-lg border border-gray-200 p-3 flex flex-col items-center bg-white card-hover">
              <p className="text-xs font-medium text-gray-500 mb-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              
              <div className="my-1">
                {getWeatherIcon(day.icon)}
              </div>
              
              <p className="text-xs text-gray-600 mb-2 capitalize">{day.description}</p>
              
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-bold ${getTemperatureColorClass(day.tempMax)}`}>{day.tempMax}°</span>
                <span className="text-xs text-gray-400">/</span>
                <span className="text-xs text-gray-500">{day.tempMin}°</span>
              </div>
              
              {day.precipitation > 0 && (
                <div className="flex items-center text-xs text-primary-600 mt-1">
                  <CloudRain size={12} className="mr-1" />
                  {day.precipitation.toFixed(1)}mm
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 italic">
        <p>Weather data is important for packing appropriately. Your packing list will be optimized based on these forecasts.</p>
      </div>
    </div>
  );
};

export default WeatherDisplay;