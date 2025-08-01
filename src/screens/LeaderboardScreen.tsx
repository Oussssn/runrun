import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LeaderboardScreen: React.FC = () => {
  const { theme } = useTheme();

  // Mock data - will be replaced with real data from API
  const mockLeaderboard = [
    { id: 1, name: 'Ahmet Koşucu', score: 2500, level: 15, district: 'Beşiktaş' },
    { id: 2, name: 'Ayşe Runner', score: 2200, level: 12, district: 'Kadıköy' },
    { id: 3, name: 'Mehmet Speed', score: 2000, level: 10, district: 'Şişli' },
    { id: 4, name: 'Fatma Fast', score: 1800, level: 9, district: 'Beyoğlu' },
    { id: 5, name: 'Ali Quick', score: 1600, level: 8, district: 'Üsküdar' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Sıralama
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          İstanbul'un en iyi koşucuları
        </Text>
      </View>

      <View style={styles.leaderboardContainer}>
        {mockLeaderboard.map((player, index) => (
          <View
            key={player.id}
            style={[
              styles.playerCard,
              { backgroundColor: theme.colors.surface },
              index === 0 && { borderColor: '#FFD700', borderWidth: 2 },
              index === 1 && { borderColor: '#C0C0C0', borderWidth: 2 },
              index === 2 && { borderColor: '#CD7F32', borderWidth: 2 },
            ]}
          >
            <View style={styles.rankContainer}>
              <Text style={[styles.rank, { color: theme.colors.primary }]}>
                #{index + 1}
              </Text>
            </View>
            
            <View style={styles.playerInfo}>
              <Text style={[styles.playerName, { color: theme.colors.text }]}>
                {player.name}
              </Text>
              <Text style={[styles.playerDistrict, { color: theme.colors.textSecondary }]}>
                {player.district}
              </Text>
            </View>
            
            <View style={styles.playerStats}>
              <Text style={[styles.playerScore, { color: theme.colors.primary }]}>
                {player.score} puan
              </Text>
              <Text style={[styles.playerLevel, { color: theme.colors.textSecondary }]}>
                Seviye {player.level}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  leaderboardContainer: {
    padding: 20,
  },
  playerCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  playerDistrict: {
    fontSize: 14,
  },
  playerStats: {
    alignItems: 'flex-end',
  },
  playerScore: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  playerLevel: {
    fontSize: 12,
  },
});

export default LeaderboardScreen; 