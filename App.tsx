import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider } from './src/context/AppContext';
import GamesDashboard from './src/components/GamesDashboard';
import GameDetail from './src/components/GameDetail';
import UserProfile from './src/components/UserProfile';
import { Game } from './src/types';

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
  return <UserProfile />;
}

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#F2F2F7"
      />
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
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
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

export default App;
