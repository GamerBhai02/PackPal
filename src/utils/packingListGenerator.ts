import { TripDetails, WeatherData, PackingList, PackingItem, PackingCategory } from '../types';

// Helper function to generate a unique ID
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Base items that everyone needs regardless of trip details
const baseEssentials: Omit<PackingItem, 'id'>[] = [
  { name: 'Passport', category: 'documents', checked: false, essential: true, quantity: 1 },
  { name: 'ID Card', category: 'documents', checked: false, essential: true, quantity: 1 },
  { name: 'Flight Tickets', category: 'documents', checked: false, essential: true, quantity: 1 },
  { name: 'Travel Insurance', category: 'documents', checked: false, essential: true, quantity: 1 },
  { name: 'Credit/Debit Cards', category: 'documents', checked: false, essential: true, quantity: 2 },
  { name: 'Cash', category: 'documents', checked: false, essential: true, quantity: 1 },
  { name: 'Phone', category: 'electronics', checked: false, essential: true, quantity: 1 },
  { name: 'Phone Charger', category: 'electronics', checked: false, essential: true, quantity: 1 },
  { name: 'Power Adapter', category: 'electronics', checked: false, essential: true, quantity: 1 },
  { name: 'Toothbrush', category: 'toiletries', checked: false, essential: true, quantity: 1 },
  { name: 'Toothpaste', category: 'toiletries', checked: false, essential: true, quantity: 1 },
  { name: 'Deodorant', category: 'toiletries', checked: false, essential: true, quantity: 1 },
  { name: 'Shampoo', category: 'toiletries', checked: false, essential: false, quantity: 1 },
  { name: 'Soap/Body Wash', category: 'toiletries', checked: false, essential: false, quantity: 1 },
  { name: 'Medications', category: 'medicine', checked: false, essential: true, quantity: 1 },
  { name: 'First Aid Kit', category: 'medicine', checked: false, essential: false, quantity: 1 },
];

// Items based on trip duration (in days)
const getTripDurationItems = (days: number): Omit<PackingItem, 'id'>[] => {
  const underwearCount = Math.min(days, 7); // Assume laundry after a week
  const sockCount = Math.min(days, 7);
  const tShirtCount = Math.min(days, 7);
  
  return [
    { name: 'Underwear', category: 'clothing', checked: false, essential: true, quantity: underwearCount },
    { name: 'Socks', category: 'clothing', checked: false, essential: true, quantity: sockCount },
    { name: 'T-shirts', category: 'clothing', checked: false, essential: true, quantity: tShirtCount },
    { name: 'Pants/Trousers', category: 'clothing', checked: false, essential: true, quantity: Math.ceil(days / 3) },
  ];
};

// Items based on weather conditions
const getWeatherBasedItems = (weather: WeatherData): Omit<PackingItem, 'id'>[] => {
  const items: Omit<PackingItem, 'id'>[] = [];
  
  // Calculate average min and max temperatures
  const avgMaxTemp = weather.daily.reduce((sum, day) => sum + day.tempMax, 0) / weather.daily.length;
  const avgMinTemp = weather.daily.reduce((sum, day) => sum + day.tempMin, 0) / weather.daily.length;
  
  // Check for precipitation
  const hasPrecipitation = weather.daily.some(day => day.precipitation > 0);
  
  // Cold weather items (below 15°C)
  if (avgMinTemp < 15) {
    items.push(
      { name: 'Jacket', category: 'clothing', checked: false, essential: true, quantity: 1 },
      { name: 'Sweater/Hoodie', category: 'clothing', checked: false, essential: false, quantity: 2 },
      { name: 'Long-sleeve Shirts', category: 'clothing', checked: false, essential: false, quantity: 2 }
    );
  }
  
  // Very cold weather items (below 5°C)
  if (avgMinTemp < 5) {
    items.push(
      { name: 'Winter Coat', category: 'clothing', checked: false, essential: true, quantity: 1 },
      { name: 'Thermal Underwear', category: 'clothing', checked: false, essential: false, quantity: 2 },
      { name: 'Gloves', category: 'accessories', checked: false, essential: false, quantity: 1 },
      { name: 'Scarf', category: 'accessories', checked: false, essential: false, quantity: 1 },
      { name: 'Beanie/Hat', category: 'accessories', checked: false, essential: false, quantity: 1 }
    );
  }
  
  // Hot weather items (above 25°C)
  if (avgMaxTemp > 25) {
    items.push(
      { name: 'Shorts', category: 'clothing', checked: false, essential: false, quantity: 3 },
      { name: 'Sunglasses', category: 'accessories', checked: false, essential: false, quantity: 1 },
      { name: 'Sunscreen', category: 'toiletries', checked: false, essential: true, quantity: 1 },
      { name: 'Hat/Cap', category: 'accessories', checked: false, essential: false, quantity: 1 }
    );
  }
  
  // Rainy weather items
  if (hasPrecipitation) {
    items.push(
      { name: 'Umbrella', category: 'accessories', checked: false, essential: false, quantity: 1 },
      { name: 'Waterproof Jacket/Raincoat', category: 'clothing', checked: false, essential: false, quantity: 1 }
    );
  }
  
  return items;
};

// Items based on trip purpose
const getTripPurposeItems = (purpose: TripDetails['purpose']): Omit<PackingItem, 'id'>[] => {
  switch (purpose) {
    case 'business':
      return [
        { name: 'Formal Shirts', category: 'clothing', checked: false, essential: true, quantity: 3 },
        { name: 'Formal Pants/Skirts', category: 'clothing', checked: false, essential: true, quantity: 2 },
        { name: 'Blazer/Suit', category: 'clothing', checked: false, essential: true, quantity: 1 },
        { name: 'Formal Shoes', category: 'clothing', checked: false, essential: true, quantity: 1 },
        { name: 'Business Cards', category: 'documents', checked: false, essential: false, quantity: 1 },
        { name: 'Laptop', category: 'electronics', checked: false, essential: true, quantity: 1 },
        { name: 'Laptop Charger', category: 'electronics', checked: false, essential: true, quantity: 1 },
        { name: 'Notebook', category: 'accessories', checked: false, essential: false, quantity: 1 },
        { name: 'Pen', category: 'accessories', checked: false, essential: false, quantity: 2 },
      ];
    case 'beach':
      return [
        { name: 'Swimwear', category: 'clothing', checked: false, essential: true, quantity: 2 },
        { name: 'Beach Towel', category: 'accessories', checked: false, essential: false, quantity: 1 },
        { name: 'Flip Flops/Sandals', category: 'clothing', checked: false, essential: true, quantity: 1 },
        { name: 'Sunscreen', category: 'toiletries', checked: false, essential: true, quantity: 1 },
        { name: 'After-sun Lotion', category: 'toiletries', checked: false, essential: false, quantity: 1 },
        { name: 'Beach Bag', category: 'accessories', checked: false, essential: false, quantity: 1 },
        { name: 'Sunglasses', category: 'accessories', checked: false, essential: true, quantity: 1 },
        { name: 'Hat/Cap', category: 'accessories', checked: false, essential: true, quantity: 1 },
      ];
    case 'adventure':
      return [
        { name: 'Hiking Boots', category: 'clothing', checked: false, essential: true, quantity: 1 },
        { name: 'Backpack', category: 'accessories', checked: false, essential: true, quantity: 1 },
        { name: 'Water Bottle', category: 'accessories', checked: false, essential: true, quantity: 1 },
        { name: 'Quick-dry Towel', category: 'accessories', checked: false, essential: false, quantity: 1 },
        { name: 'Insect Repellent', category: 'toiletries', checked: false, essential: true, quantity: 1 },
        { name: 'Flashlight', category: 'accessories', checked: false, essential: false, quantity: 1 },
        { name: 'Pocket Knife', category: 'accessories', checked: false, essential: false, quantity: 1 },
        { name: 'Compass/GPS', category: 'electronics', checked: false, essential: false, quantity: 1 },
        { name: 'First Aid Kit', category: 'medicine', checked: false, essential: true, quantity: 1 },
      ];
    case 'winter-sports':
      return [
        { name: 'Ski/Snowboard Jacket', category: 'clothing', checked: false, essential: true, quantity: 1 },
        { name: 'Ski/Snowboard Pants', category: 'clothing', checked: false, essential: true, quantity: 1 },
        { name: 'Thermal Base Layers', category: 'clothing', checked: false, essential: true, quantity: 3 },
        { name: 'Ski Socks', category: 'clothing', checked: false, essential: true, quantity: 3 },
        { name: 'Gloves', category: 'accessories', checked: false, essential: true, quantity: 1 },
        { name: 'Beanie/Hat', category: 'accessories', checked: false, essential: true, quantity: 1 },
        { name: 'Goggles', category: 'accessories', checked: false, essential: true, quantity: 1 },
        { name: 'Sunscreen', category: 'toiletries', checked: false, essential: true, quantity: 1 },
        { name: 'Lip Balm', category: 'toiletries', checked: false, essential: true, quantity: 1 },
      ];
    case 'leisure':
    default:
      return [
        { name: 'Casual Shirts', category: 'clothing', checked: false, essential: false, quantity: 3 },
        { name: 'Camera', category: 'electronics', checked: false, essential: false, quantity: 1 },
        { name: 'Book/E-Reader', category: 'accessories', checked: false, essential: false, quantity: 1 },
        { name: 'Day Bag', category: 'accessories', checked: false, essential: false, quantity: 1 },
      ];
  }
};

// Items based on luggage capacity
const getLuggageCapacityItems = (capacity: TripDetails['luggageCapacity']): Omit<PackingItem, 'id'>[] => {
  if (capacity === 'carry-on') {
    return [
      { name: 'Travel-size Toiletries', category: 'toiletries', checked: false, essential: true, quantity: 1 },
      { name: 'Compact Packing Cubes', category: 'accessories', checked: false, essential: false, quantity: 1 },
    ];
  } else { // checked baggage
    return [
      { name: 'Full-size Toiletries', category: 'toiletries', checked: false, essential: false, quantity: 1 },
      { name: 'Extra Shoes', category: 'clothing', checked: false, essential: false, quantity: 1 },
    ];
  }
};

export const generatePackingList = (trip: TripDetails, weather: WeatherData): PackingList => {
  // Calculate trip duration in days
  const startDate = new Date(trip.dates.start);
  const endDate = new Date(trip.dates.end);
  const tripDurationMs = endDate.getTime() - startDate.getTime();
  const tripDurationDays = Math.ceil(tripDurationMs / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
  
  // Combine all items from different categories
  let allItems: Omit<PackingItem, 'id'>[] = [
    ...baseEssentials,
    ...getTripDurationItems(tripDurationDays),
    ...getWeatherBasedItems(weather),
    ...getTripPurposeItems(trip.purpose),
    ...getLuggageCapacityItems(trip.luggageCapacity),
  ];
  
  // Remove duplicates by name
  const uniqueItems: Omit<PackingItem, 'id'>[] = [];
  const itemNames = new Set();
  
  allItems.forEach(item => {
    if (!itemNames.has(item.name)) {
      uniqueItems.push(item);
      itemNames.add(item.name);
    }
  });
  
  // Add ids to items
  const itemsWithIds: PackingItem[] = uniqueItems.map(item => ({
    ...item,
    id: generateId(),
  }));
  
  // Create the packing list
  return {
    id: generateId(),
    name: `${trip.destination.city} Trip`,
    tripId: generateId(),
    items: itemsWithIds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};