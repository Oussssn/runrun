import { User } from '../../store/slices/authSlice';
import { Territory } from '../../store/slices/territorySlice';

const API_BASE_URL = 'http://localhost:5001/api'; // .NET backend API

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Bir hata oluştu',
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      // Return demo mode response instead of failing
      console.warn('Backend not available, running in demo mode');
      return {
        success: false,
        error: 'Backend bağlantısı yok (Demo modu)',
      };
    }
  }

  // Auth endpoints
  static async login(email: string, password: string): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userData: {
    email: string;
    password: string;
    displayName: string;
  }): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // User endpoints (Backend integration)
  static async createUser(userData: {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    homeDistrict: string;
    preferredLanguage?: string;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async getUserByUsername(username: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/username/${username}`);
  }

  // Territory endpoints (Backend integration)
  static async getTerritories(): Promise<ApiResponse<Territory[]>> {
    return this.request<Territory[]>('/territories');
  }

  static async createTerritory(territoryData: {
    name: string;
    district: string;
    centerPoint: {latitude: number; longitude: number};
    type: string;
    basePoints: number;
    difficultyLevel: number;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/territories', {
      method: 'POST',
      body: JSON.stringify(territoryData),
    });
  }

  // Run endpoints (Backend integration)
  static async getUserRuns(userId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/users/${userId}/runs`);
  }

  static async getUserRunById(runId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/runs/${runId}`);
  }

  static async getUserRunStatistics(userId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/users/${userId}/statistics`);
  }

  static async createUserRun(runData: {
    userId: string;
    route: Array<{latitude: number; longitude: number}>;
    startPoint: {latitude: number; longitude: number};
    endPoint: {latitude: number; longitude: number};
    distanceMeters: number;
    duration: string;
    averageSpeedKmh: number;
    maxSpeedKmh: number;
    caloriesBurned: number;
  }): Promise<ApiResponse<any>> {
    return this.request<any>('/runs', {
      method: 'POST',
      body: JSON.stringify(runData),
    });
  }

  // Territory capture endpoints (Backend integration)
  static async captureTerritory(
    territoryId: string,
    userId: string
  ): Promise<ApiResponse<void>> {
    return this.request<void>(`/territories/${territoryId}/capture`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  static async getUserTerritories(userId: string): Promise<ApiResponse<string[]>> {
    return this.request<string[]>(`/users/${userId}/territories`);
  }

  // Leaderboard endpoints (Backend integration)
  static async getLeaderboard(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/leaderboard');
  }

  static async getDistrictLeaderboard(district: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/leaderboard/district/${district}`);
  }

  // User profile endpoints (Backend integration)
  static async updateUserStats(
    userId: string,
    stats: Partial<User>
  ): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}/stats`, {
      method: 'PUT',
      body: JSON.stringify(stats),
    });
  }

  static async getUserProfile(userId: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/users/${userId}/profile`);
  }
} 