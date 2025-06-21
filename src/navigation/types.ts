import { Game } from '../types';

export type RootTabParamList = {
  Games: undefined;
  Profile: undefined;
};

export type GamesStackParamList = {
  GamesList: undefined;
  GameDetail: { game: Game };
};

export interface NavigationProps {
  onGamePress: (game: Game) => void;
  selectedGame: Game | null;
  onBackPress: () => void;
}
