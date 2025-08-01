import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Territory {
  id: string;
  name: string;
  district: string;
  coordinates: Array<{ latitude: number; longitude: number }>;
  owner: string | null;
  captureTime: Date | null;
  points: number;
  isSpecial: boolean;
  landmark?: string;
}

interface TerritoryState {
  territories: Territory[];
  userTerritories: string[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TerritoryState = {
  territories: [],
  userTerritories: [],
  isLoading: false,
  error: null,
};

const territorySlice = createSlice({
  name: 'territory',
  initialState,
  reducers: {
    setTerritories: (state, action: PayloadAction<Territory[]>) => {
      state.territories = action.payload;
      state.error = null;
    },
    setUserTerritories: (state, action: PayloadAction<string[]>) => {
      state.userTerritories = action.payload;
    },
    captureTerritory: (state, action: PayloadAction<{ territoryId: string; userId: string }>) => {
      const territory = state.territories.find(t => t.id === action.payload.territoryId);
      if (territory) {
        territory.owner = action.payload.userId;
        territory.captureTime = new Date();
        if (!state.userTerritories.includes(action.payload.territoryId)) {
          state.userTerritories.push(action.payload.territoryId);
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setTerritories,
  setUserTerritories,
  captureTerritory,
  setLoading,
  setError,
  clearError,
} = territorySlice.actions;

export default territorySlice.reducer; 