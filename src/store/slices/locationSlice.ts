import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  speed?: number;
  heading?: number;
}

interface LocationState {
  currentLocation: Location | null;
  isLocationEnabled: boolean;
  locationPermission: 'granted' | 'denied' | 'undetermined';
  error: string | null;
}

const initialState: LocationState = {
  currentLocation: null,
  isLocationEnabled: false,
  locationPermission: 'undetermined',
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
      state.error = null;
    },
    setLocationEnabled: (state, action: PayloadAction<boolean>) => {
      state.isLocationEnabled = action.payload;
    },
    setLocationPermission: (state, action: PayloadAction<'granted' | 'denied' | 'undetermined'>) => {
      state.locationPermission = action.payload;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearLocationError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentLocation,
  setLocationEnabled,
  setLocationPermission,
  setLocationError,
  clearLocationError,
} = locationSlice.actions;

export default locationSlice.reducer; 