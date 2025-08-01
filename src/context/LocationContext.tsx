import React, { createContext, useContext, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setCurrentLocation, setLocationEnabled, setLocationPermission } from '../store/slices/locationSlice';

interface LocationContextType {
  currentLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
    speed?: number;
    heading?: number;
  } | null;
  isLocationEnabled: boolean;
  locationPermission: 'granted' | 'denied' | 'undetermined';
  updateLocation: (location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
    speed?: number;
    heading?: number;
  }) => void;
  setLocationStatus: (enabled: boolean) => void;
  setPermission: (permission: 'granted' | 'denied' | 'undetermined') => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { currentLocation, isLocationEnabled, locationPermission } = useSelector(
    (state: RootState) => state.location
  );

  const updateLocation = (location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
    speed?: number;
    heading?: number;
  }) => {
    dispatch(setCurrentLocation(location));
  };

  const setLocationStatus = (enabled: boolean) => {
    dispatch(setLocationEnabled(enabled));
  };

  const setPermission = (permission: 'granted' | 'denied' | 'undetermined') => {
    dispatch(setLocationPermission(permission));
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLocationEnabled,
        locationPermission,
        updateLocation,
        setLocationStatus,
        setPermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}; 