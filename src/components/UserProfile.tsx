import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Prediction } from '../types';

const UserProfile: React.FC = () => {
  const { user, games } = useApp();

  const getGameById = (gameId: string) => {
    return games.find(game => game.id === gameId);
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'win':
        return '#34C759';
      case 'loss':
        return '#FF3B30';
      case 'pending':
        return '#FF9500';
      default:
        return '#8E8E93';
    }
  };

  const calculateWinRate = () => {
    const totalGames = user.stats.wins + user.stats.losses;
    if (totalGames === 0) return 0;
    return ((user.stats.wins / totalGames) * 100).toFixed(1);
  };

  const calculateTotalWinnings = () => {
    return user.predictions
      .filter(p => p.result === 'win')
      .reduce((total, p) => total + (p.payout || 0), 0);
  };

  const calculateTotalLosses = () => {
    return user.predictions
      .filter(p => p.result === 'loss')
      .reduce((total, p) => total + p.amount, 0);
  };

  const renderPredictionItem = ({ item }: { item: Prediction }) => {
    const game = getGameById(item.gameId);

    return (
      <View style={styles.predictionCard}>
        <View style={styles.predictionHeader}>
          <Text style={styles.gameId}>Game #{item.gameId}</Text>
          <Text
            style={[styles.resultText, { color: getResultColor(item.result) }]}
          >
            {item.result.toUpperCase()}
          </Text>
        </View>

        {game && (
          <Text style={styles.gameInfo}>
            {game.awayTeam.abbreviation} vs {game.homeTeam.abbreviation}
          </Text>
        )}

        <View style={styles.predictionDetails}>
          <Text style={styles.pickText}>Pick: {item.pick}</Text>
          <Text style={styles.amountText}>Bet: ${item.amount}</Text>
          {item.payout && (
            <Text style={styles.payoutText}>Payout: ${item.payout}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Text style={styles.title}>User Profile</Text>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.userId}>ID: {user.id}</Text>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>${user.balance}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user.stats.wins}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user.stats.losses}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user.stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Win Rate</Text>
            <Text style={styles.metricValue}>{calculateWinRate()}%</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Winnings</Text>
            <Text style={[styles.metricValue, { color: '#34C759' }]}>
              ${calculateTotalWinnings()}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Losses</Text>
            <Text style={[styles.metricValue, { color: '#FF3B30' }]}>
              ${calculateTotalLosses()}
            </Text>
          </View>
        </View>

        {/* Prediction History */}
        <View style={styles.historyContainer}>
          <Text style={styles.sectionTitle}>Prediction History</Text>

          {user.predictions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No predictions yet</Text>
              <Text style={styles.emptySubText}>
                Start making predictions to see your history here
              </Text>
            </View>
          ) : (
            <FlatList
              data={user.predictions.slice().reverse()} // Show most recent first
              keyExtractor={(item, index) => `${item.gameId}-${index}`}
              renderItem={renderPredictionItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#8E8E93',
  },
  balanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  metricsContainer: {
    marginBottom: 24,
  },
  metricCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  historyContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  predictionCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gameId: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  resultText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gameInfo: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 8,
  },
  predictionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickText: {
    fontSize: 14,
    color: '#000',
  },
  amountText: {
    fontSize: 14,
    color: '#000',
  },
  payoutText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default UserProfile;
