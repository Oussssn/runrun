import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GameState {
  isRunning: boolean;
  currentRun: {
    id: string;
    startTime: string | null; // Changed from Date to string
    distance: number;
    duration: number;
    route: Array<{ latitude: number; longitude: number; timestamp: number }>;
  } | null;
  capturedTerritories: string[];
  score: number;
  level: number;
  experience: number;
}

const initialState: GameState = {
  isRunning: false,
  currentRun: null,
  capturedTerritories: [],
  score: 0,
  level: 1,
  experience: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startRun: (state, action: PayloadAction<string>) => {
      state.isRunning = true;
      state.currentRun = {
        id: action.payload,
        startTime: new Date().toISOString(), // Convert to string
        distance: 0,
        duration: 0,
        route: [],
      };
    },
    stopRun: (state) => {
      state.isRunning = false;
      state.currentRun = null;
    },
    updateRunStats: (state, action: PayloadAction<{ distance: number; duration: number }>) => {
      if (state.currentRun) {
        state.currentRun.distance = action.payload.distance;
        state.currentRun.duration = action.payload.duration;
      }
    },
    addRoutePoint: (state, action: PayloadAction<{ latitude: number; longitude: number; timestamp: number }>) => {
      if (state.currentRun) {
        state.currentRun.route.push(action.payload);
      }
    },
    captureTerritory: (state, action: PayloadAction<string>) => {
      if (!state.capturedTerritories.includes(action.payload)) {
        state.capturedTerritories.push(action.payload);
        state.score += 100;
        state.experience += 50;
      }
    },
    updateScore: (state, action: PayloadAction<number>) => {
      state.score += action.payload;
    },
    updateExperience: (state, action: PayloadAction<number>) => {
      state.experience += action.payload;
      if (state.experience >= state.level * 1000) {
        state.level += 1;
        state.experience = 0;
      }
    },
  },
});

export const {
  startRun,
  stopRun,
  updateRunStats,
  addRoutePoint,
  captureTerritory,
  updateScore,
  updateExperience,
} = gameSlice.actions;

export default gameSlice.reducer; 