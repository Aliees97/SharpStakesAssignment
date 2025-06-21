import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Game } from '../types';

interface GameDetailProps {
  game: Game;
  onBack: () => void;
}

const GameDetail: React.FC<GameDetailProps> = ({ game, onBack }) => {
  const { user, makePrediction } = useApp();
  const [selectedPick, setSelectedPick] = useState<string>('');
  const [betAmount, setBetAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return (
      date.toLocaleDateString() +
      ' at ' +
      date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#007AFF';
      case 'inProgress':
        return '#FF3B30';
      case 'final':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (game: Game) => {
    switch (game.status) {
      case 'scheduled':
        return 'Scheduled';
      case 'inProgress':
        return `Live - ${game.period} ${game.clock}`;
      case 'final':
        return 'Final';
      default:
        return game.status;
    }
  };

  const handlePrediction = async () => {
    if (!selectedPick) {
      Alert.alert('Error', 'Please select a team to bet on');
      return;
    }

    const amount = parseFloat(betAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid bet amount');
      return;
    }

    if (amount > user.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert('Confirm Bet', `Bet $${amount} on ${selectedPick}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          setLoading(true);
          try {
            await makePrediction(game.id, selectedPick, amount);
            Alert.alert('Success', 'Bet placed successfully!');
            setSelectedPick('');
            setBetAmount('');
          } catch (error) {
            Alert.alert('Error', 'Failed to place bet');
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const canMakePrediction =
    game.status === 'scheduled' || game.status === 'inProgress';
  const existingPrediction = user.predictions.find(p => p.gameId === game.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Game Details</Text>
        </View>

        {/* Game Status */}
        <View style={styles.statusContainer}>
          <Text
            style={[styles.statusText, { color: getStatusColor(game.status) }]}
          >
            {getStatusText(game)}
          </Text>
          {game.startTime && game.status === 'scheduled' && (
            <Text style={styles.timeText}>{formatTime(game.startTime)}</Text>
          )}
        </View>

        {/* Teams */}
        <View style={styles.teamsContainer}>
          <View style={styles.teamCard}>
            <Text style={styles.teamLabel}>Away Team</Text>
            <Text style={styles.teamName}>{game.awayTeam.name}</Text>
            <Text style={styles.teamAbbreviation}>
              {game.awayTeam.abbreviation}
            </Text>
            <Text style={styles.teamRecord}>
              Record: {game.awayTeam.record}
            </Text>
            {game.awayTeam.score !== undefined && (
              <Text style={styles.teamScore}>{game.awayTeam.score}</Text>
            )}
          </View>

          <View style={styles.vsContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <View style={styles.teamCard}>
            <Text style={styles.teamLabel}>Home Team</Text>
            <Text style={styles.teamName}>{game.homeTeam.name}</Text>
            <Text style={styles.teamAbbreviation}>
              {game.homeTeam.abbreviation}
            </Text>
            <Text style={styles.teamRecord}>
              Record: {game.homeTeam.record}
            </Text>
            {game.homeTeam.score !== undefined && (
              <Text style={styles.teamScore}>{game.homeTeam.score}</Text>
            )}
          </View>
        </View>

        {/* Odds */}
        {game.odds && (
          <View style={styles.oddsContainer}>
            <Text style={styles.sectionTitle}>Betting Odds</Text>
            <View style={styles.oddsCard}>
              <Text style={styles.oddsText}>
                Favorite: {game.odds.favorite}
              </Text>
              <Text style={styles.oddsText}>Spread: {game.odds.spread}</Text>
            </View>
          </View>
        )}

        {/* Winner */}
        {game.winner && (
          <View style={styles.winnerContainer}>
            <Text style={styles.sectionTitle}>Result</Text>
            <Text style={styles.winnerText}>Winner: {game.winner}</Text>
          </View>
        )}

        {/* Existing Prediction */}
        {existingPrediction && (
          <View style={styles.existingPredictionContainer}>
            <Text style={styles.sectionTitle}>Your Prediction</Text>
            <View style={styles.predictionCard}>
              <Text style={styles.predictionText}>
                Pick: {existingPrediction.pick}
              </Text>
              <Text style={styles.predictionText}>
                Amount: ${existingPrediction.amount}
              </Text>
              <Text
                style={[
                  styles.predictionText,
                  {
                    color:
                      existingPrediction.result === 'win'
                        ? '#34C759'
                        : existingPrediction.result === 'loss'
                        ? '#FF3B30'
                        : '#FF9500',
                  },
                ]}
              >
                Status: {existingPrediction.result.toUpperCase()}
              </Text>
              {existingPrediction.payout && (
                <Text style={styles.predictionText}>
                  Payout: ${existingPrediction.payout}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Prediction Interface */}
        {canMakePrediction && !existingPrediction && (
          <View style={styles.predictionContainer}>
            <Text style={styles.sectionTitle}>Make a Prediction</Text>

            <View style={styles.pickContainer}>
              <Text style={styles.pickLabel}>Pick a team:</Text>
              <View style={styles.teamPickButtons}>
                <TouchableOpacity
                  style={[
                    styles.pickButton,
                    selectedPick === game.awayTeam.abbreviation &&
                      styles.selectedPickButton,
                  ]}
                  onPress={() => setSelectedPick(game.awayTeam.abbreviation)}
                >
                  <Text
                    style={[
                      styles.pickButtonText,
                      selectedPick === game.awayTeam.abbreviation &&
                        styles.selectedPickButtonText,
                    ]}
                  >
                    {game.awayTeam.abbreviation}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.pickButton,
                    selectedPick === game.homeTeam.abbreviation &&
                      styles.selectedPickButton,
                  ]}
                  onPress={() => setSelectedPick(game.homeTeam.abbreviation)}
                >
                  <Text
                    style={[
                      styles.pickButtonText,
                      selectedPick === game.homeTeam.abbreviation &&
                        styles.selectedPickButtonText,
                    ]}
                  >
                    {game.homeTeam.abbreviation}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Bet Amount:</Text>
              <TextInput
                style={styles.amountInput}
                value={betAmount}
                onChangeText={setBetAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
                placeholderTextColor="#8E8E93"
              />
              <Text style={styles.balanceText}>
                Available Balance: ${user.balance}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.betButton,
                (!selectedPick || !betAmount || loading) &&
                  styles.disabledBetButton,
              ]}
              onPress={handlePrediction}
              disabled={!selectedPick || !betAmount || loading}
            >
              <Text style={styles.betButtonText}>
                {loading ? 'Placing Bet...' : 'Place Bet'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 16,
  },
  statusContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamAbbreviation: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  teamRecord: {
    fontSize: 12,
    color: '#8E8E93',
  },
  teamScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 8,
  },
  vsContainer: {
    paddingHorizontal: 16,
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8E8E93',
  },
  oddsContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  oddsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  oddsText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  winnerContainer: {
    marginBottom: 16,
  },
  winnerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34C759',
    textAlign: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  existingPredictionContainer: {
    marginBottom: 16,
  },
  predictionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  predictionText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  predictionContainer: {
    marginBottom: 16,
  },
  pickContainer: {
    marginBottom: 16,
  },
  pickLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 12,
  },
  teamPickButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  pickButton: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  selectedPickButton: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  pickButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  selectedPickButtonText: {
    color: '#FFF',
  },
  amountContainer: {
    marginBottom: 16,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  amountInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  balanceText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 8,
  },
  betButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  disabledBetButton: {
    backgroundColor: '#8E8E93',
  },
  betButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default GameDetail;
