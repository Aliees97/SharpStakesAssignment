import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Game, User, Prediction, GameData } from '../types';
import sampleData from '../data/sample-games-simplified.json';
import apiService from '../services/api';

interface AppContextType {
  games: Game[];
  user: User;
  loading: boolean;
  refreshGames: () => Promise<void>;
  makePrediction: (
    gameId: string,
    pick: string,
    amount: number,
  ) => Promise<void>;
  updateUserBalance: (amount: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [user, setUser] = useState<User>({
    id: '',
    username: '',
    balance: 0,
    predictions: [],
    stats: { wins: 0, losses: 0, pending: 0 },
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      // Try to load saved data from AsyncStorage
      const savedData = await AsyncStorage.getItem('appData');

      if (savedData) {
        const parsedData: GameData = JSON.parse(savedData);
        setGames(parsedData.games);
        setUser(parsedData.user);
      } else {
        // Use sample data if no saved data exists
        const data = sampleData as GameData;
        setGames(data.games);
        setUser(data.user);

        // Save sample data to AsyncStorage
        await AsyncStorage.setItem('appData', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to sample data
      const data = sampleData as GameData;
      setGames(data.games);
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (updatedGames: Game[], updatedUser: User) => {
    try {
      const dataToSave: GameData = {
        games: updatedGames,
        user: updatedUser,
      };
      await AsyncStorage.setItem('appData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const refreshGames = async () => {
    try {
      setLoading(true);

      // Try to fetch from API first
      try {
        const gamesFromApi = await apiService.getGames();
        setGames(gamesFromApi);

        // Update local storage with fresh data
        const currentData = await AsyncStorage.getItem('appData');
        if (currentData) {
          const parsedData: GameData = JSON.parse(currentData);
          const updatedData = { ...parsedData, games: gamesFromApi };
          await AsyncStorage.setItem('appData', JSON.stringify(updatedData));
        }
      } catch (apiError) {
        console.log('API not available, using local data:', apiError);
        // Fallback to local data if API is not available
      }
    } catch (error) {
      console.error('Error refreshing games:', error);
    } finally {
      setLoading(false);
    }
  };

  const makePrediction = async (
    gameId: string,
    pick: string,
    amount: number,
  ) => {
    try {
      // Try to submit via API first
      try {
        const result = await apiService.submitPrediction(
          gameId,
          pick,
          amount,
          user.id,
        );

        // Update local state with API response
        const updatedUser = {
          ...user,
          balance: result.newBalance,
          predictions: [...user.predictions, result.prediction],
          stats: {
            ...user.stats,
            pending: user.stats.pending + 1,
          },
        };

        setUser(updatedUser);
        await saveData(games, updatedUser);
      } catch (apiError) {
        console.log('API not available, using local prediction:', apiError);

        // Fallback to local prediction if API is not available
        const newPrediction: Prediction = {
          gameId,
          pick,
          amount,
          result: 'pending',
        };

        const updatedUser = {
          ...user,
          balance: user.balance - amount,
          predictions: [...user.predictions, newPrediction],
          stats: {
            ...user.stats,
            pending: user.stats.pending + 1,
          },
        };

        setUser(updatedUser);
        await saveData(games, updatedUser);
      }
    } catch (error) {
      console.error('Error making prediction:', error);
      throw error;
    }
  };

  const updateUserBalance = async (amount: number) => {
    const updatedUser = {
      ...user,
      balance: user.balance + amount,
    };

    setUser(updatedUser);
    await saveData(games, updatedUser);
  };

  useEffect(() => {
    loadData();
  }, []);

  const contextValue: AppContextType = {
    games,
    user,
    loading,
    refreshGames,
    makePrediction,
    updateUserBalance,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};
