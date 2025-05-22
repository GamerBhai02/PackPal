import { WeatherData, DailyWeather } from '../types';

const WEATHER_API_KEY = 'ccb2bac733f4409dabc14025251805';
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1';

export const fetchWeatherData = async (
  city: string,
  country: string
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `${WEATHER_API_BASE_URL}/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(
        `${city},${country}`
      )}&days=7`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error?.message || 
        `Weather API request failed with status ${response.status}`
      );
    }

    const data = await response.json();
    
    // Add validation for required data
    if (!data.forecast?.forecastday) {
      throw new Error('Invalid weather data received from API');
    }
    
    return {
      city: data.location.name,
      country: data.location.country,
      current: {
        temp: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text,
        icon: data.current.condition.code.toString(),
      },
      daily: data.forecast.forecastday.map((day: any): DailyWeather => ({
        date: day.date,
        tempMax: day.day.maxtemp_c,
        tempMin: day.day.mintemp_c,
        humidity: day.day.avghumidity,
        description: day.day.condition.text,
        icon: day.day.condition.code.toString(),
        precipitation: day.day.totalprecip_mm,
      })),
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};