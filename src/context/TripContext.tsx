import React, { createContext, useContext, useState, useEffect } from 'react';
import { TripDetails, WeatherData, PackingList } from '../types';
import { generatePackingList } from '../utils/packingListGenerator';
import { fetchWeatherData } from '../services/weatherService';

interface TripContextType {
  trip: TripDetails | null;
  setTrip: React.Dispatch<React.SetStateAction<TripDetails | null>>;
  weather: WeatherData | null;
  isLoadingWeather: boolean;
  weatherError: string | null;
  packingList: PackingList | null;
  isGeneratingList: boolean;
  updatePackingItem: (itemId: string, updates: Partial<PackingList['items'][0]>) => void;
  addCustomItem: (name: string, category: PackingList['items'][0]['category']) => void;
  removeItem: (itemId: string) => void;
  generateNewPackingList: () => void;
  clearTrip: () => void;
  saveTrip: () => void;
  savedTrips: TripDetails[];
}

const defaultContext: TripContextType = {
  trip: null,
  setTrip: () => {},
  weather: null,
  isLoadingWeather: false,
  weatherError: null,
  packingList: null,
  isGeneratingList: false,
  updatePackingItem: () => {},
  addCustomItem: () => {},
  removeItem: () => {},
  generateNewPackingList: () => {},
  clearTrip: () => {},
  saveTrip: () => {},
  savedTrips: [],
};

const TripContext = createContext<TripContextType>(defaultContext);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [packingList, setPackingList] = useState<PackingList | null>(null);
  const [isGeneratingList, setIsGeneratingList] = useState<boolean>(false);
  const [savedTrips, setSavedTrips] = useState<TripDetails[]>([]);

  // Load saved trips from localStorage
  useEffect(() => {
    const savedTripsData = localStorage.getItem('packpal-saved-trips');
    if (savedTripsData) {
      try {
        setSavedTrips(JSON.parse(savedTripsData));
      } catch (e) {
        console.error('Failed to parse saved trips', e);
      }
    }
  }, []);

  // Fetch weather data when trip details change
  useEffect(() => {
    if (trip && trip.destination.city && trip.destination.country) {
      setIsLoadingWeather(true);
      setWeatherError(null);
      
      fetchWeatherData(trip.destination.city, trip.destination.country)
        .then((data) => {
          setWeather(data);
          setIsLoadingWeather(false);
        })
        .catch((error: Error) => {
          console.error('Failed to fetch weather data', error);
          setWeatherError(error.message || 'Failed to fetch weather data. Please try again.');
          setIsLoadingWeather(false);
        });
    }
  }, [trip]);

  // Generate packing list when weather data is available
  useEffect(() => {
    if (trip && weather) {
      generateNewPackingList();
    }
  }, [weather, trip]);

  const generateNewPackingList = () => {
    if (!trip || !weather) return;
    
    setIsGeneratingList(true);
    
    // Use setTimeout to simulate API call delay
    setTimeout(() => {
      const newPackingList = generatePackingList(trip, weather);
      setPackingList(newPackingList);
      setIsGeneratingList(false);
    }, 1000);
  };

  const updatePackingItem = (itemId: string, updates: Partial<PackingList['items'][0]>) => {
    if (!packingList) return;
    
    setPackingList({
      ...packingList,
      items: packingList.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
      updatedAt: new Date().toISOString(),
    });
  };

  const addCustomItem = (name: string, category: PackingList['items'][0]['category']) => {
    if (!packingList) return;
    
    const newItem: PackingList['items'][0] = {
      id: `custom-${Date.now()}`,
      name,
      category,
      checked: false,
      essential: false,
      quantity: 1,
    };
    
    setPackingList({
      ...packingList,
      items: [...packingList.items, newItem],
      updatedAt: new Date().toISOString(),
    });
  };

  const removeItem = (itemId: string) => {
    if (!packingList) return;
    
    setPackingList({
      ...packingList,
      items: packingList.items.filter((item) => item.id !== itemId),
      updatedAt: new Date().toISOString(),
    });
  };

  const clearTrip = () => {
    setTrip(null);
    setWeather(null);
    setPackingList(null);
    setWeatherError(null);
  };

  const saveTrip = () => {
    if (!trip) return;
    
    const updatedSavedTrips = [...savedTrips.filter(t => 
      t.destination.city !== trip.destination.city || 
      t.dates.start !== trip.dates.start
    ), trip];
    
    setSavedTrips(updatedSavedTrips);
    localStorage.setItem('packpal-saved-trips', JSON.stringify(updatedSavedTrips));
  };

  return (
    <TripContext.Provider
      value={{
        trip,
        setTrip,
        weather,
        isLoadingWeather,
        weatherError,
        packingList,
        isGeneratingList,
        updatePackingItem,
        addCustomItem,
        removeItem,
        generateNewPackingList,
        clearTrip,
        saveTrip,
        savedTrips,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);