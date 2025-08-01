import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Text } from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import MapViewComponent from '../components/map/MapView';
import ApiService from '../services/api';

const MapScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [territories, setTerritories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeMap();
  }, []);

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

  const loadTerritories = async () => {
    try {
      // For now, create sample Istanbul territories
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
          isCaptured: false,
          score: 100,
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
            id: '1',
            displayName: 'Test Runner',
          },
          score: 150,
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
          isCaptured: false,
          score: 120,
        },
      ];
      
      setTerritories(sampleTerritories);
    } catch (error) {
      console.error('Territory loading error:', error);
    }
  };

  const handleTerritoryPress = (territory: any) => {
    Alert.alert(
      territory.name,
      `Bölge: ${territory.district}\nPuan: ${territory.score}\n${
        territory.isCaptured 
          ? `Yakalayan: ${territory.capturedBy?.displayName}` 
          : 'Bu bölge henüz yakalanmamış!'
      }`,
      [
        { text: 'Kapat', style: 'cancel' },
        ...(territory.isCaptured ? [] : [
          { 
            text: 'Yakala!', 
            onPress: () => captureTerritory(territory.id),
            style: 'default'
          }
        ])
      ]
    );
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

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Harita yükleniyor...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapViewComponent
        territories={territories}
        userLocation={userLocation}
        onTerritoryPress={handleTerritoryPress}
        showUserLocation={true}
        showTerritories={true}
      />
    </View>
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
});

export default MapScreen; 