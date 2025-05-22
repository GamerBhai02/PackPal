import React from 'react';
import { TripProvider } from './context/TripContext';
import Layout from './components/Layout';
import TravelPlanner from './components/TravelPlanner';

function App() {
  return (
    <TripProvider>
      <Layout>
        <TravelPlanner />
      </Layout>
    </TripProvider>
  );
}

export default App;