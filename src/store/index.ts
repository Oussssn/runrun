import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gameReducer from './slices/gameSlice';
import locationReducer from './slices/locationSlice';
import territoryReducer from './slices/territorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    location: locationReducer,
    territory: territoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 