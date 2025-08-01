import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const { score, level, experience } = useSelector((state: RootState) => state.game);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
          Hoş geldin, {user?.displayName || 'Koşucu'}!
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          İstanbul'u koşarak fethet
        </Text>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
          İstatistiklerin
        </Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {level}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Seviye
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {score}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Puan
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {experience}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              Deneyim
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.quickActions, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Hızlı İşlemler
        </Text>
        {/* Quick action buttons will be added here */}
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  statsContainer: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  quickActions: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
});

export default HomeScreen; 