import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface TerritoryCardProps {
  territory: {
    id: string;
    name: string;
    district: string;
    isCaptured: boolean;
    capturedBy?: {
      id: string;
      displayName: string;
      photoUrl?: string;
    };
    score: number;
    distance?: number;
  };
  onPress?: () => void;
  showDistance?: boolean;
}

const TerritoryCard: React.FC<TerritoryCardProps> = ({
  territory,
  onPress,
  showDistance = false
}) => {
  const { theme } = useTheme();

  const getStatusColor = () => {
    if (territory.isCaptured) {
      return theme.colors.success;
    }
    return theme.colors.warning;
  };

  const getStatusText = () => {
    if (territory.isCaptured) {
      return 'Ele Geçirildi';
    }
    return 'Ele Geçirilmedi';
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: getStatusColor(),
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {territory.name}
          </Text>
          <Text style={[styles.district, { color: theme.colors.textSecondary }]}>
            {territory.district}
          </Text>
        </View>
        
        <View style={[styles.scoreContainer, { backgroundColor: getStatusColor() }]}>
          <Text style={[styles.score, { color: theme.colors.background }]}>
            {territory.score}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>

        {territory.capturedBy && (
          <View style={styles.capturedByContainer}>
            <Text style={[styles.capturedByLabel, { color: theme.colors.textSecondary }]}>
              Ele geçiren:
            </Text>
            <View style={styles.capturedByUser}>
              {territory.capturedBy.photoUrl && (
                <Image
                  source={{ uri: territory.capturedBy.photoUrl }}
                  style={styles.userAvatar}
                />
              )}
              <Text style={[styles.capturedByName, { color: theme.colors.text }]}>
                {territory.capturedBy.displayName}
              </Text>
            </View>
          </View>
        )}

        {showDistance && territory.distance && (
          <View style={styles.distanceContainer}>
            <Text style={[styles.distanceLabel, { color: theme.colors.textSecondary }]}>
              Mesafe:
            </Text>
            <Text style={[styles.distance, { color: theme.colors.text }]}>
              {formatDistance(territory.distance)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  district: {
    fontSize: 14,
  },
  scoreContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 40,
    alignItems: 'center',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    gap: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  capturedByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  capturedByLabel: {
    fontSize: 14,
  },
  capturedByUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  capturedByName: {
    fontSize: 14,
    fontWeight: '500',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  distanceLabel: {
    fontSize: 14,
  },
  distance: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TerritoryCard; 