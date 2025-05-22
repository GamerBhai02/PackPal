import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import TravelForm from './TravelForm';
import WeatherDisplay from './WeatherDisplay';
import PackingListDisplay from './PackingListDisplay';
import SavedTrips from './SavedTrips';

const TravelPlanner: React.FC = () => {
  const { trip, packingList, isGeneratingList } = useTrip();
  const [showSavedTrips, setShowSavedTrips] = useState<boolean>(false);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header and intro */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary-700 mb-2">Plan Your Perfect Trip</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Enter your travel details and let PackPal help you pack smartly based on your destination, 
          weather forecast, and trip purpose. Never forget an essential item again!
        </p>
      </div>
      
      {/* Saved trips toggle */}
      <div className="mb-6 flex justify-center">
        <button 
          onClick={() => setShowSavedTrips(!showSavedTrips)}
          className="btn-outline text-sm flex items-center gap-1"
        >
          {showSavedTrips ? 'Hide Saved Trips' : 'View Saved Trips'}
        </button>
      </div>
      
      {/* Saved trips panel */}
      {showSavedTrips && <SavedTrips onClose={() => setShowSavedTrips(false)} />}
      
      {/* Main content */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Form section */}
        <div className={`${trip && packingList ? 'md:col-span-2' : 'md:col-span-3'} card p-6 animate-fade-in`}>
          <TravelForm />
        </div>
        
        {/* Results section */}
        {trip && (
          <div className={`${packingList ? 'md:col-span-3' : 'md:col-span-2'} space-y-6 animate-slide-up`}>
            {/* Weather Display */}
            <WeatherDisplay />
            
            {/* Packing List */}
            {(isGeneratingList || packingList) && (
              <div className="card p-6">
                <h2 className="section-title">Your Packing List</h2>
                
                {isGeneratingList ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                    <p className="text-gray-600">Generating your personalized packing list...</p>
                  </div>
                ) : packingList && (
                  <PackingListDisplay />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelPlanner;