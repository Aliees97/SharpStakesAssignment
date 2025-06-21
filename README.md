# AportsApp - Sports Prediction React Native App

A React Native sports prediction app built with TypeScript, featuring a clean iOS-focused UI and a simple mock API backend.

## Features

### 🎮 Core Features

- **Games Dashboard**: View upcoming, live, and completed games with filtering
- **Game Detail Screen**: Detailed game view with prediction interface
- **User Profile**: Track prediction history, win/loss record, and virtual balance
- **Real-time Updates**: Mock API with simulated live game score updates

### 🛠 Technical Features

- **React Native** with TypeScript
- **Navigation** using React Navigation (Bottom Tabs)
- **State Management** with React Context
- **Local Storage** using AsyncStorage
- **Mock API Server** with Express.js
- **iOS-focused Design** with clean, modern UI

## Project Structure

```
aportsApp/
├── src/
│   ├── components/          # React components
│   │   ├── GamesDashboard.tsx
│   │   ├── GameDetail.tsx
│   │   └── UserProfile.tsx
│   ├── context/             # React Context for state management
│   │   └── AppContext.tsx
│   ├── data/               # Sample data
│   │   └── sample-games-simplified.json
│   ├── services/           # API service layer
│   │   └── api.ts
│   └── types/              # TypeScript type definitions
│       └── index.ts
├── server/                 # Mock API server
│   ├── server.js
│   └── package.json
├── ios/                    # iOS native code
├── android/                # Android native code
└── App.tsx                 # Main app component
```

## Getting Started

### Prerequisites

- Node.js (>= 18)
- React Native CLI
- Xcode (for iOS development)
- iOS Simulator or physical device

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd aportsApp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install iOS dependencies**

   ```bash
   cd ios && pod install && cd ..
   ```

4. **Install server dependencies**
   ```bash
   cd server && npm install && cd ..
   ```

### Running the App

1. **Start the Mock API Server** (in a separate terminal)

   ```bash
   cd server
   npm start
   ```

   The server will run on `http://localhost:3001`

2. **Start the React Native Metro bundler**

   ```bash
   npm start
   ```

3. **Run the iOS app**
   ```bash
   npm run ios
   ```

## API Endpoints

The mock API server provides the following endpoints:

- `GET /api/health` - Health check
- `GET /api/games` - Get all games
- `GET /api/games/:id` - Get specific game
- `POST /api/predictions` - Submit a prediction
- `GET /api/user/:id` - Get user profile

## Sample Data

The app uses sample NBA game data with:

- 3 games (scheduled, in-progress, completed)
- User profile with prediction history
- Virtual balance system
- Win/loss statistics

## Features in Detail

### Games Dashboard

- Filter games by status (All, Upcoming, Live, Completed)
- Pull-to-refresh functionality
- Clean card-based design
- Real-time score updates for live games

### Game Detail Screen

- Complete team information and records
- Betting odds display
- Prediction interface with team selection
- Bet amount input with balance validation
- Existing prediction display

### User Profile

- Current virtual balance
- Win/loss/pending statistics
- Win rate calculation
- Total winnings and losses
- Complete prediction history

### Mock API Features

- Automatic score updates every 30 seconds for in-progress games
- Prediction submission with validation
- Balance management
- Error handling with fallback to local data

## Development Notes

- The app works offline by falling back to local AsyncStorage data when the API is unavailable
- All data is persisted locally using AsyncStorage
- The UI is optimized for iOS with native-feeling components
- TypeScript is used throughout for type safety
- The mock API simulates real-world scenarios with proper error handling

## Future Enhancements

- WebSocket integration for real-time updates
- Push notifications for game results
- More detailed betting options (over/under, etc.)
- User authentication
- Social features (leaderboards, sharing)
- Real sports data integration

## Testing

Run the app in the iOS Simulator to test:

1. Browse games in the dashboard
2. Filter games by status
3. Tap on a game to view details
4. Make predictions on scheduled/live games
5. Check your profile to see prediction history
6. Pull to refresh games list

The mock API will automatically update scores for in-progress games every 30 seconds.

Used ROO CODE Vscode AI plugin with anthropic key of claude-sonnet-4

# SharpStakesAssignment
