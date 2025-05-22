import React, { useState } from 'react';
import { TripDetails, TripPurpose, LuggageCapacity, Gender, AgeRange } from '../types';
import { useTrip } from '../context/TripContext';
import { CalendarIcon, MapPinIcon, BriefcaseIcon, UserIcon, PackageIcon } from 'lucide-react';

const TravelForm: React.FC = () => {
  const { trip, setTrip, clearTrip, saveTrip } = useTrip();
  
  const [formData, setFormData] = useState<TripDetails>({
    destination: {
      city: trip?.destination.city || '',
      country: trip?.destination.country || '',
    },
    dates: {
      start: trip?.dates.start || '',
      end: trip?.dates.end || '',
    },
    purpose: trip?.purpose || 'leisure',
    travelerDetails: {
      gender: trip?.travelerDetails.gender,
      ageRange: trip?.travelerDetails.ageRange,
      specialRequirements: trip?.travelerDetails.specialRequirements || '',
    },
    luggageCapacity: trip?.luggageCapacity || 'checked',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, key] = name.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof TripDetails],
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTrip(formData);
  };

  const handleReset = () => {
    clearTrip();
    setFormData({
      destination: { city: '', country: '' },
      dates: { start: '', end: '' },
      purpose: 'leisure',
      travelerDetails: { specialRequirements: '' },
      luggageCapacity: 'checked',
    });
  };

  const handleSaveTrip = () => {
    saveTrip();
  };

  const tripPurposeOptions: { value: TripPurpose; label: string }[] = [
    { value: 'leisure', label: 'Leisure / Vacation' },
    { value: 'business', label: 'Business' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'beach', label: 'Beach' },
    { value: 'winter-sports', label: 'Winter Sports' },
  ];

  const luggageOptions: { value: LuggageCapacity; label: string }[] = [
    { value: 'carry-on', label: 'Carry-on only' },
    { value: 'checked', label: 'Checked baggage' },
  ];

  const genderOptions: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
  ];

  const ageRangeOptions: { value: AgeRange; label: string }[] = [
    { value: 'child', label: 'Child (0-12)' },
    { value: 'teen', label: 'Teen (13-17)' },
    { value: 'adult', label: 'Adult (18-64)' },
    { value: 'senior', label: 'Senior (65+)' },
  ];

  return (
    <div>
      <h2 className="section-title flex items-center gap-2">
        <MapPinIcon size={18} />
        Travel Details
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Destination */}
        <div className="space-y-3">
          <label className="form-label">Destination</label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                name="destination.city"
                value={formData.destination.city}
                onChange={handleInputChange}
                placeholder="City"
                className="input-field"
                required
              />
            </div>
            
            <div>
              <input
                type="text"
                name="destination.country"
                value={formData.destination.country}
                onChange={handleInputChange}
                placeholder="Country"
                className="input-field"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Dates */}
        <div className="space-y-3">
          <label className="form-label flex items-center gap-1">
            <CalendarIcon size={16} />
            Trip Dates
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
              <input
                type="date"
                name="dates.start"
                value={formData.dates.start}
                onChange={handleInputChange}
                className="input-field"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="text-xs text-gray-600 mb-1 block">End Date</label>
              <input
                type="date"
                name="dates.end"
                value={formData.dates.end}
                onChange={handleInputChange}
                className="input-field"
                required
                min={formData.dates.start || new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </div>
        
        {/* Purpose */}
        <div className="space-y-3">
          <label className="form-label flex items-center gap-1">
            <BriefcaseIcon size={16} />
            Trip Purpose
          </label>
          
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            {tripPurposeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Luggage Capacity */}
        <div className="space-y-3">
          <label className="form-label flex items-center gap-1">
            <PackageIcon size={16} />
            Luggage Capacity
          </label>
          
          <div className="flex flex-col gap-2">
            {luggageOptions.map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="luggageCapacity"
                  value={option.value}
                  checked={formData.luggageCapacity === option.value}
                  onChange={handleInputChange}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Traveler Details (collapsible) */}
        <div className="space-y-3">
          <details className="group">
            <summary className="form-label flex items-center gap-1 cursor-pointer list-none">
              <UserIcon size={16} />
              Traveler Details (Optional)
              <svg className="w-5 h-5 ml-auto transform group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            
            <div className="mt-3 space-y-3 pt-3 border-t border-gray-100">
              {/* Gender */}
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Gender</label>
                <select
                  name="travelerDetails.gender"
                  value={formData.travelerDetails.gender || ''}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Prefer not to say</option>
                  {genderOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Age Range */}
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Age Range</label>
                <select
                  name="travelerDetails.ageRange"
                  value={formData.travelerDetails.ageRange || ''}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Prefer not to say</option>
                  {ageRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Special Requirements */}
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Special Requirements</label>
                <textarea
                  name="travelerDetails.specialRequirements"
                  value={formData.travelerDetails.specialRequirements || ''}
                  onChange={handleInputChange}
                  placeholder="Any special needs or preferences..."
                  className="input-field min-h-[80px]"
                />
              </div>
            </div>
          </details>
        </div>
        
        {/* Form actions */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button type="submit" className="btn-primary flex-1">
            {trip ? 'Update Trip' : 'Create Trip'}
          </button>
          
          {trip && (
            <>
              <button 
                type="button" 
                onClick={handleSaveTrip}
                className="btn-secondary flex-1"
              >
                Save Trip
              </button>
              
              <button 
                type="button" 
                onClick={handleReset} 
                className="btn-outline flex-1"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default TravelForm;