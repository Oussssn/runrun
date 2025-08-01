// Temel type tanımları

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  speed?: number;
  heading?: number;
}

export interface Territory {
  id: string;
  name: string;
  district: string;
  coordinates: Coordinates[];
  owner: string | null;
  captureTime: Date | null;
  points: number;
  isSpecial: boolean;
  landmark?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  totalDistance: number;
  totalRuns: number;
  level: number;
  experience: number;
}

export interface Run {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  distance: number;
  duration: number;
  route: Location[];
  capturedTerritories: string[];
  averageSpeed: number;
  maxSpeed: number;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  score: number;
  level: number;
  district: string;
  totalTerritories: number;
  rank: number;
}

export interface DistrictStats {
  district: string;
  totalTerritories: number;
  capturedTerritories: number;
  topPlayer: string;
  averageScore: number;
}

export interface GameStats {
  totalTerritories: number;
  capturedTerritories: number;
  totalDistance: number;
  totalRuns: number;
  averageSpeed: number;
  favoriteDistrict: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

export interface Notification {
  id: string;
  type: 'territory_captured' | 'level_up' | 'achievement' | 'challenge' | 'social';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  data?: any;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'distance' | 'territories' | 'landmarks' | 'district';
  target: number;
  reward: number;
  startDate: Date;
  endDate: Date;
  participants: string[];
  leaderboard: LeaderboardEntry[];
}

export interface SocialEvent {
  id: string;
  name: string;
  description: string;
  location: Coordinates;
  date: Date;
  organizer: string;
  participants: string[];
  maxParticipants?: number;
  type: 'group_run' | 'race' | 'meetup';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Map: undefined;
  Running: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    error: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

// Game state types
export interface GameState {
  isRunning: boolean;
  currentRun: Run | null;
  capturedTerritories: string[];
  score: number;
  level: number;
  experience: number;
}

export interface LocationState {
  currentLocation: Location | null;
  isLocationEnabled: boolean;
  locationPermission: 'granted' | 'denied' | 'undetermined';
  error: string | null;
}

export interface TerritoryState {
  territories: Territory[];
  userTerritories: string[];
  isLoading: boolean;
  error: string | null;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 