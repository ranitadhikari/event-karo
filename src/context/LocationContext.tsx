'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>('All Cities');

  useEffect(() => {
    const savedCity = localStorage.getItem('selectedCity');
    if (savedCity) {
      setSelectedCity(savedCity);
    }
  }, []);

  const handleSetSelectedCity = (city: string) => {
    setSelectedCity(city);
    localStorage.setItem('selectedCity', city);
  };

  return (
    <LocationContext.Provider value={{ selectedCity, setSelectedCity: handleSetSelectedCity }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
