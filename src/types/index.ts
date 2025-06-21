export interface Team {
  name: string;
  abbreviation: string;
  record: string;
  score?: number;
}

export interface Odds {
  spread: string;
  favorite: string;
}

export interface Game {
  id: string;
  status: 'scheduled' | 'inProgress' | 'final';
  startTime?: string;
  period?: string;
  clock?: string;
  homeTeam: Team;
  awayTeam: Team;
  odds?: Odds;
  winner?: string;
}

export interface Prediction {
  gameId: string;
  pick: string;
  amount: number;
  result: 'win' | 'loss' | 'pending';
  payout?: number;
}

export interface UserStats {
  wins: number;
  losses: number;
  pending: number;
}

export interface User {
  id: string;
  username: string;
  balance: number;
  predictions: Prediction[];
  stats: UserStats;
}

export interface GameData {
  games: Game[];
  user: User;
}

export type GameStatus = 'all' | 'scheduled' | 'inProgress' | 'final';
