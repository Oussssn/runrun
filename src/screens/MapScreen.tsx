import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import MapViewComponent from '../components/map/MapView';
import { ApiService } from '../services/api';
import LocationService from '../services/gps/LocationService';

interface Checkpoint {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: 'start' | 'checkpoint' | 'finish';
  isSelected?: boolean;
}

const MapScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [territories, setTerritories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showOtherUsers, setShowOtherUsers] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<Checkpoint[]>([]);
  const [userRoute, setUserRoute] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentCheckpointIndex, setCurrentCheckpointIndex] = useState(0);

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (isRunning) {
      startRouteTracking();
    } else {
      stopRouteTracking();
    }
  }, [isRunning]);

  const initializeMap = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Konum izni olmadan harita kullanılamaz.');
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Load territories from backend (will implement after creating sample territories)
      await loadTerritories();
      
      setLoading(false);
    } catch (error) {
      console.error('Map initialization error:', error);
      Alert.alert('Hata', 'Harita yüklenirken bir hata oluştu.');
      setLoading(false);
    }
  };

  const startRouteTracking = () => {
    LocationService.startLocationTracking(
      (location) => {
        setUserLocation({
          latitude: location.latitude,
          longitude: location.longitude,
        });
        
        // Add to user route
        setUserRoute(prev => [...prev, {
          latitude: location.latitude,
          longitude: location.longitude,
        }]);

        // Check if user reached current checkpoint
        if (selectedRoute.length > 0 && currentCheckpointIndex < selectedRoute.length) {
          const currentCheckpoint = selectedRoute[currentCheckpointIndex];
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            currentCheckpoint.coordinate.latitude,
            currentCheckpoint.coordinate.longitude
          );

          if (distance < 100) { // Within 100 meters
            if (currentCheckpointIndex < selectedRoute.length - 1) {
              setCurrentCheckpointIndex(prev => prev + 1);
              Alert.alert(
                'Checkpoint Geçildi!',
                `${currentCheckpoint.name} checkpoint'ini geçtiniz!`
              );
            } else {
              // Route completed
              stopRoute();
              Alert.alert(
                'Rota Tamamlandı!',
                'Tebrikler! Tüm checkpoint\'leri geçtiniz!'
              );
            }
          }
        }
      },
      (routePoints) => {
        // Route points updated
        const routeCoordinates = routePoints.map(point => ({
          latitude: point.latitude,
          longitude: point.longitude,
        }));
        setUserRoute(routeCoordinates);
      }
    );
  };

  const stopRouteTracking = () => {
    LocationService.stopLocationTracking();
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const loadTerritories = async () => {
    try {
      // For now, create sample Istanbul territories with other users
      const sampleTerritories = [
        {
          id: '1',
          name: 'Taksim Meydanı',
          district: 'Beyoğlu',
          coordinates: [
            { latitude: 41.0370, longitude: 28.9850 },
            { latitude: 41.0380, longitude: 28.9850 },
            { latitude: 41.0380, longitude: 28.9870 },
            { latitude: 41.0370, longitude: 28.9870 },
          ],
          isCaptured: true,
          capturedBy: {
            id: 'user_2',
            displayName: 'Mehmet Koşucu',
            photoURL: 'https://via.placeholder.com/40',
          },
          score: 100,
          captureTime: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          name: 'Galata Kulesi',
          district: 'Beyoğlu',
          coordinates: [
            { latitude: 41.0256, longitude: 28.9744 },
            { latitude: 41.0266, longitude: 28.9744 },
            { latitude: 41.0266, longitude: 28.9764 },
            { latitude: 41.0256, longitude: 28.9764 },
          ],
          isCaptured: true,
          capturedBy: {
            id: 'user_3',
            displayName: 'Ayşe Gezgin',
            photoURL: 'https://via.placeholder.com/40',
          },
          score: 150,
          captureTime: '2024-01-14T15:45:00Z',
        },
        {
          id: '3',
          name: 'Sultanahmet',
          district: 'Fatih',
          coordinates: [
            { latitude: 41.0058, longitude: 28.9784 },
            { latitude: 41.0068, longitude: 28.9784 },
            { latitude: 41.0068, longitude: 28.9804 },
            { latitude: 41.0058, longitude: 28.9804 },
          ],
          isCaptured: false,
          score: 200,
        },
        {
          id: '4',
          name: 'Beşiktaş İskelesi',
          district: 'Beşiktaş',
          coordinates: [
            { latitude: 41.0425, longitude: 29.0058 },
            { latitude: 41.0435, longitude: 29.0058 },
            { latitude: 41.0435, longitude: 29.0078 },
            { latitude: 41.0425, longitude: 29.0078 },
          ],
          isCaptured: true,
          capturedBy: {
            id: 'user_4',
            displayName: 'Ali Runner',
            photoURL: 'https://via.placeholder.com/40',
          },
          score: 120,
          captureTime: '2024-01-16T08:20:00Z',
        },
        {
          id: '5',
          name: 'Kadıköy Meydanı',
          district: 'Kadıköy',
          coordinates: [
            { latitude: 40.9909, longitude: 29.0303 },
            { latitude: 40.9919, longitude: 29.0303 },
            { latitude: 40.9919, longitude: 29.0323 },
            { latitude: 40.9909, longitude: 29.0323 },
          ],
          isCaptured: false,
          score: 180,
        },
      ];
      
      setTerritories(sampleTerritories);
    } catch (error) {
      console.error('Territory loading error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    try {
      // Simulate search results
      const results = territories.filter(territory => 
        territory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        territory.district.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSearchResultPress = (territory: any) => {
    setShowSearchResults(false);
    setSearchQuery('');
    handleTerritoryPress(territory);
  };

  const handleTerritoryPress = (territory: any) => {
    const captureInfo = territory.isCaptured 
      ? `\nYakalayan: ${territory.capturedBy?.displayName}\nYakalama Tarihi: ${new Date(territory.captureTime).toLocaleDateString('tr-TR')}`
      : '\nBu bölge henüz yakalanmamış!';

    Alert.alert(
      territory.name,
      `Bölge: ${territory.district}\nPuan: ${territory.score}${captureInfo}`,
      [
        { text: 'Kapat', style: 'cancel' },
        ...(territory.isCaptured ? [] : [
          { 
            text: 'Yakala!', 
            onPress: () => captureTerritory(territory.id),
            style: 'default' as const
          }
        ])
      ]
    );
  };

  const handleCheckpointPress = (checkpoint: Checkpoint) => {
    if (isRunning) {
      Alert.alert('Koşu Devam Ediyor', 'Koşu sırasında rota değiştirilemez.');
      return;
    }

    const newRoute = [...selectedRoute];
    const existingIndex = newRoute.findIndex(cp => cp.id === checkpoint.id);
    
    if (existingIndex >= 0) {
      // Remove from route
      newRoute.splice(existingIndex, 1);
      Alert.alert('Checkpoint Kaldırıldı', `${checkpoint.name} rotadan kaldırıldı.`);
    } else {
      // Add to route
      newRoute.push(checkpoint);
      Alert.alert('Checkpoint Eklendi', `${checkpoint.name} rotaya eklendi.`);
    }
    
    setSelectedRoute(newRoute);
  };

  const captureTerritory = async (territoryId: string) => {
    try {
      // Here we would capture territory via API
      // For now, just show a message
      Alert.alert('Başarılı!', 'Bölge yakalandı! (Demo modu)');
    } catch (error) {
      Alert.alert('Hata', 'Bölge yakalanamadı.');
    }
  };

  const toggleOtherUsers = () => {
    setShowOtherUsers(!showOtherUsers);
  };

  const startRoute = () => {
    if (selectedRoute.length < 2) {
      Alert.alert('Rota Seçin', 'En az 2 checkpoint seçmelisiniz.');
      return;
    }

    setIsRunning(true);
    setUserRoute([]);
    setCurrentCheckpointIndex(0);
    Alert.alert('Koşu Başladı!', 'Seçilen rotayı takip edin.');
  };

  const stopRoute = () => {
    setIsRunning(false);
    setCurrentCheckpointIndex(0);
    Alert.alert('Koşu Bitti!', 'Rotanız tamamlandı.');
  };

  const clearRoute = () => {
    setSelectedRoute([]);
    setUserRoute([]);
    setIsRunning(false);
    setCurrentCheckpointIndex(0);
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Harita yükleniyor...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Bölge veya semt ara..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: showOtherUsers ? theme.colors.primary : theme.colors.surface }]}
          onPress={toggleOtherUsers}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={showOtherUsers ? theme.colors.background : theme.colors.textSecondary} 
          />
        </TouchableOpacity>
      </View>

      {/* Route Controls */}
      {selectedRoute.length > 0 && (
        <View style={[styles.routeControls, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.routeTitle, { color: theme.colors.text }]}>
            Seçilen Rota ({selectedRoute.length} checkpoint)
            {isRunning && (
              <Text style={[styles.routeProgress, { color: theme.colors.primary }]}>
                {' '}- {currentCheckpointIndex + 1}/{selectedRoute.length}
              </Text>
            )}
          </Text>
          <View style={styles.routeButtons}>
            {!isRunning ? (
              <TouchableOpacity
                style={[styles.routeButton, { backgroundColor: theme.colors.primary }]}
                onPress={startRoute}
              >
                <Ionicons name="play" size={16} color={theme.colors.background} />
                <Text style={[styles.routeButtonText, { color: theme.colors.background }]}>
                  Koşuya Başla
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.routeButton, { backgroundColor: theme.colors.error }]}
                onPress={stopRoute}
              >
                <Ionicons name="stop" size={16} color={theme.colors.background} />
                <Text style={[styles.routeButtonText, { color: theme.colors.background }]}>
                  Koşuyu Bitir
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.routeButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
              onPress={clearRoute}
            >
              <Ionicons name="trash" size={16} color={theme.colors.text} />
              <Text style={[styles.routeButtonText, { color: theme.colors.text }]}>
                Temizle
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Search Results */}
      {showSearchResults && searchResults.length > 0 && (
        <View style={[styles.searchResults, { backgroundColor: theme.colors.surface }]}>
          <ScrollView style={styles.searchResultsList}>
            {searchResults.map((territory) => (
              <TouchableOpacity
                key={territory.id}
                style={styles.searchResultItem}
                onPress={() => handleSearchResultPress(territory)}
              >
                <View style={styles.searchResultInfo}>
                  <Text style={[styles.searchResultTitle, { color: theme.colors.text }]}>
                    {territory.name}
                  </Text>
                  <Text style={[styles.searchResultSubtitle, { color: theme.colors.textSecondary }]}>
                    {territory.district} • {territory.score} puan
                  </Text>
                  {territory.isCaptured && (
                    <Text style={[styles.searchResultCaptured, { color: theme.colors.primary }]}>
                      Yakalayan: {territory.capturedBy?.displayName}
                    </Text>
                  )}
                </View>
                <Ionicons 
                  name={territory.isCaptured ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={territory.isCaptured ? theme.colors.primary : theme.colors.textSecondary} 
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Map */}
      <MapViewComponent
        territories={showOtherUsers ? territories : territories.filter(t => !t.isCaptured)}
        userLocation={userLocation || undefined}
        onTerritoryPress={handleTerritoryPress}
        onCheckpointPress={handleCheckpointPress}
        showUserLocation={true}
        showTerritories={true}
        selectedRoute={selectedRoute}
        userRoute={userRoute}
        isRunning={isRunning}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    alignItems: 'center',
    gap: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeControls: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  routeProgress: {
    fontSize: 14,
    fontWeight: '500',
  },
  routeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  routeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  routeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchResults: {
    maxHeight: 200,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 999,
  },
  searchResultsList: {
    padding: 8,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  searchResultSubtitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  searchResultCaptured: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default MapScreen; 