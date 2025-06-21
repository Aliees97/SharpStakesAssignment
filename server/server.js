const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data path
const sampleDataPath = path.join(
  __dirname,
  '../src/data/sample-games-simplified.json',
);

// Function to load fresh data
const loadGameData = () => {
  try {
    return JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));
  } catch (error) {
    console.error('Error loading game data:', error);
    return { games: [], user: {} };
  }
};

// Load initial data
let gameData = loadGameData();

// Helper function to simulate game updates
const updateGameScores = () => {
  gameData.games.forEach(game => {
    if (game.status === 'inProgress') {
      // Randomly update scores for in-progress games
      if (Math.random() > 0.7) {
        game.homeTeam.score =
          (game.homeTeam.score || 0) + Math.floor(Math.random() * 3);
        game.awayTeam.score =
          (game.awayTeam.score || 0) + Math.floor(Math.random() * 3);

        // Randomly update clock
        const minutes = Math.floor(Math.random() * 12);
        const seconds = Math.floor(Math.random() * 60);
        game.clock = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  });
};

// Update scores every 30 seconds for demo purposes
setInterval(updateGameScores, 30000);

// Routes

// GET /api/games - Get all games
app.get('/api/games', (req, res) => {
  try {
    console.log('GET /api/games - Fetching all games');
    // Reload data from file to get latest changes
    gameData = loadGameData();
    res.json({
      success: true,
      data: gameData.games,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch games',
    });
  }
});

// GET /api/games/:id - Get specific game
app.get('/api/games/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/games/${id} - Fetching specific game`);

    const game = gameData.games.find(g => g.id === id);

    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found',
      });
    }

    res.json({
      success: true,
      data: game,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch game',
    });
  }
});

// POST /api/predictions - Submit a prediction
app.post('/api/predictions', (req, res) => {
  try {
    const { gameId, pick, amount, userId } = req.body;
    console.log('POST /api/predictions - Submitting prediction:', {
      gameId,
      pick,
      amount,
      userId,
    });

    // Validate required fields
    if (!gameId || !pick || !amount || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: gameId, pick, amount, userId',
      });
    }

    // Check if game exists
    const game = gameData.games.find(g => g.id === gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        error: 'Game not found',
      });
    }

    // Check if game is still available for betting
    if (game.status === 'final') {
      return res.status(400).json({
        success: false,
        error: 'Cannot bet on completed games',
      });
    }

    // Check if user has sufficient balance
    if (amount > gameData.user.balance) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance',
      });
    }

    // Create new prediction
    const newPrediction = {
      gameId,
      pick,
      amount: parseFloat(amount),
      result: 'pending',
      timestamp: new Date().toISOString(),
    };

    // Update user data
    gameData.user.balance -= parseFloat(amount);
    gameData.user.predictions.push(newPrediction);
    gameData.user.stats.pending += 1;

    // Save updated data (in a real app, this would be saved to a database)
    fs.writeFileSync(sampleDataPath, JSON.stringify(gameData, null, 2));

    res.json({
      success: true,
      data: {
        prediction: newPrediction,
        newBalance: gameData.user.balance,
      },
      message: 'Prediction submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting prediction:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit prediction',
    });
  }
});

// GET /api/user/:id - Get user profile
app.get('/api/user/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log(`GET /api/user/${id} - Fetching user profile`);

    // Reload data from file to get latest changes
    gameData = loadGameData();

    if (id !== gameData.user.id) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: gameData.user,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'AportsApp API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AportsApp API Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/games`);
  console.log(`   GET  /api/games/:id`);
  console.log(`   POST /api/predictions`);
  console.log(`   GET  /api/user/:id`);
  console.log(
    `\n🎮 Game scores will update automatically every 30 seconds for in-progress games`,
  );
});

module.exports = app;
