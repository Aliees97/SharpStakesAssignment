import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Game, GameStatus } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

interface GamesDashboardProps {
  onGamePress: (game: Game) => void;
}

const GamesDashboard: React.FC<GamesDashboardProps> = ({ onGamePress }) => {
  const { games, loading, refreshGames, resetToSampleData } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<GameStatus>('all');

  const filteredGames = games.filter(game => {
    if (selectedFilter === 'all') return true;
    return game.status === selectedFilter;
  });

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        return formatTime(game.startTime);
      case 'inProgress':
        return `${game.period} ${game.clock}`;
      case 'final':
        return 'Final';
      default:
        return game.status;
    }
  };

  const renderGameItem = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => onGamePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.gameHeader}>
        <Text
          style={[styles.statusText, { color: getStatusColor(item.status) }]}
        >
          {getStatusText(item)}
        </Text>
        {item.odds && (
          <Text style={styles.oddsText}>
            {item.odds.favorite} {item.odds.spread}
          </Text>
        )}
      </View>

      <View style={styles.teamsContainer}>
        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.awayTeam.name}</Text>
            <Text style={styles.teamRecord}>({item.awayTeam.record})</Text>
          </View>
          {item.awayTeam.score !== undefined && (
            <Text style={styles.score}>{item.awayTeam.score}</Text>
          )}
        </View>

        <View style={styles.teamRow}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{item.homeTeam.name}</Text>
            <Text style={styles.teamRecord}>({item.homeTeam.record})</Text>
          </View>
          {item.homeTeam.score !== undefined && (
            <Text style={styles.score}>{item.homeTeam.score}</Text>
          )}
        </View>
      </View>

      {item.winner && (
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerText}>Winner: {item.winner}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: GameStatus, label: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.activeFilterButton,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.activeFilterButtonText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Games Dashboard</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                'Reset Data',
                'This will reload all games from the latest data. Continue?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Reset', onPress: resetToSampleData },
                ],
              );
            }}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filtersContainer}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('scheduled', 'Upcoming')}
          {renderFilterButton('inProgress', 'Live')}
          {renderFilterButton('final', 'Completed')}
        </View>

        <FlatList
          data={filteredGames}
          keyExtractor={item => item.id}
          renderItem={renderGameItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshGames} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No games found</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  activeFilterButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#FFF',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  gameCard: {
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
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  oddsText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  teamsContainer: {
    gap: 8,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  teamRecord: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  winnerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  winnerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34C759',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default GamesDashboard;
