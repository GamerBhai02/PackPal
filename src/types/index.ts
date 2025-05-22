export type TripPurpose = 'business' | 'leisure' | 'adventure' | 'beach' | 'winter-sports';
export type LuggageCapacity = 'carry-on' | 'checked';
export type AgeRange = 'child' | 'teen' | 'adult' | 'senior';
export type Gender = 'male' | 'female' | 'non-binary';

export interface TravelerDetails {
  gender?: Gender;
  ageRange?: AgeRange;
  specialRequirements?: string;
}

export interface TripDetails {
  destination: {
    city: string;
    country: string;
  };
  dates: {
    start: string;
    end: string;
  };
  purpose: TripPurpose;
  travelerDetails: TravelerDetails;
  luggageCapacity: LuggageCapacity;
}

export interface WeatherData {
  city: string;
  country: string;
  daily: DailyWeather[];
  current: {
    temp: number;
    humidity: number;
    description: string;
    icon: string;
  };
}

export interface DailyWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  humidity: number;
  description: string;
  icon: string;
  precipitation: number;
}

export type PackingCategory = 
  | 'documents'
  | 'clothing'
  | 'electronics'
  | 'toiletries'
  | 'accessories'
  | 'medicine'
  | 'activity';

export interface PackingItem {
  id: string;
  name: string;
  category: PackingCategory;
  checked: boolean;
  essential: boolean;
  quantity: number;
  weight?: number; // in grams
}

export interface PackingList {
  id: string;
  name: string;
  tripId: string;
  items: PackingItem[];
  createdAt: string;
  updatedAt: string;
}