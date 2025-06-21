import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import GamesDashboard from '../components/GamesDashboard';
import GameDetail from '../components/GameDetail';
import UserProfile from '../components/UserProfile';
import { Game } from '../types';

const Tab = createBottomTabNavigator();

function GamesScreen() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleGamePress = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBackPress = () => {
    setSelectedGame(null);
  };

  if (selectedGame) {
    return <GameDetail game={selectedGame} onBack={handleBackPress} />;
  }

  return <GamesDashboard onGamePress={handleGamePress} />;
}

function ProfileScreen() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleGamePress = (game: Game) => {
    setSelectedGame(game);
  };

  const handleBackPress = () => {
    setSelectedGame(null);
  };

  if (selectedGame) {
    return <GameDetail game={selectedGame} onBack={handleBackPress} />;
  }

  return <UserProfile onGamePress={handleGamePress} />;
}

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFF',
            borderTopWidth: 1,
            borderTopColor: '#E5E5EA',
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen
          name="Games"
          component={GamesScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <View style={[styles.tabIcon, { backgroundColor: color }]} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <View
                style={[styles.tabIconProfile, { backgroundColor: color }]}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  tabIconProfile: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default AppNavigator;
