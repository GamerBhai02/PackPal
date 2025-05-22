import React from 'react';
import { Luggage } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Luggage size={28} className="text-white" />
            <h1 className="text-2xl font-bold text-white">PackPal</h1>
          </div>
          <div className="text-sm font-medium">
            Smart Travel Packing Assistant
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className="bg-gray-100 border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} PackPal. All rights reserved.</p>
          <p className="mt-1">Never forget an essential item again.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;