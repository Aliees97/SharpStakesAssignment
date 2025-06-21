import { Game, User, Prediction } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }

      return data.data as T;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all games
  async getGames(): Promise<Game[]> {
    return this.request<Game[]>('/games');
  }

  // Get specific game by ID
  async getGame(gameId: string): Promise<Game> {
    return this.request<Game>(`/games/${gameId}`);
  }

  // Submit a prediction
  async submitPrediction(
    gameId: string,
    pick: string,
    amount: number,
    userId: string,
  ): Promise<{ prediction: Prediction; newBalance: number }> {
    return this.request<{ prediction: Prediction; newBalance: number }>(
      '/predictions',
      {
        method: 'POST',
        body: JSON.stringify({
          gameId,
          pick,
          amount,
          userId,
        }),
      },
    );
  }

  // Get user profile
  async getUser(userId: string): Promise<User> {
    return this.request<User>(`/user/${userId}`);
  }

  // Health check
  async healthCheck(): Promise<{ message: string; version: string }> {
    return this.request<{ message: string; version: string }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
