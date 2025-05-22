import React from 'react';
import { useTrip } from '../context/TripContext';
import { Trash2, Calendar, MapPin } from 'lucide-react';

const SavedTrips: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { savedTrips, setTrip, clearTrip } = useTrip();
  
  if (savedTrips.length === 0) {
    return (
      <div className="mb-6 p-6 bg-white rounded-lg shadow-md animate-slide-down">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Saved Trips</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="text-center py-8 text-gray-500">
          <p>You don't have any saved trips yet.</p>
          <p className="mt-2 text-sm">Create and save a trip to see it here.</p>
        </div>
      </div>
    );
  }
  
  const handleLoadTrip = (trip: typeof savedTrips[0]) => {
    clearTrip();
    setTimeout(() => {
      setTrip(trip);
      onClose();
    }, 100);
  };
  
  return (
    <div className="mb-6 p-6 bg-white rounded-lg shadow-md animate-slide-down">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Saved Trips</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedTrips.map((trip, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleLoadTrip(trip)}
          >
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-primary-700">
                {trip.destination.city}, {trip.destination.country}
              </h3>
              <button 
                className="text-gray-400 hover:text-error-500"
                onClick={(e) => {
                  e.stopPropagation();
                  // In a real app, we would implement trip deletion here
                  alert('Delete functionality would be implemented in a real application');
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>
                  {new Date(trip.dates.start).toLocaleDateString()} - {new Date(trip.dates.end).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span className="capitalize">{trip.purpose.replace('-', ' ')}</span>
              </div>
            </div>
            
            <button className="mt-3 text-xs text-primary-600 hover:text-primary-800 font-medium">
              Load This Trip
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedTrips;