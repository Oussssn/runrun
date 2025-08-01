import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { startRun, stopRun } from '../store/slices/gameSlice';
import ApiService from '../services/api';

interface RunStats {
  distance: number;
  duration: number;
  averageSpeed: number;
  maxSpeed: number;
  calories: number;
}

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
}

const RunningScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { isRunning } = useSelector((state: RootState) => state.game);
  
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [route, setRoute] = useState<LocationPoint[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationPoint | null>(null);
  const [runStats, setRunStats] = useState<RunStats>({
    distance: 0,
    duration: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    calories: 0
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    requestLocationPermission();
    return () => {
      stopLocationTracking();
    };
  }, []);

  useEffect(() => {
    if (isRunning && startTime) {
      // Update duration every second
      timerRef.current = setInterval(() => {
        const currentTime = Date.now();
        const duration = Math.floor((currentTime - startTime) / 1000);
        setRunStats(prev => ({ ...prev, duration }));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, startTime]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'GPS koşu takibi için konum izni gereklidir.');
        return;
      }

      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      
      const initialLocation: LocationPoint = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: Date.now(),
        speed: location.coords.speed || 0,
      };
      
      setCurrentLocation(initialLocation);
    } catch (error) {
      console.error('Location permission error:', error);
      Alert.alert('Hata', 'Konum alınamadı.');
    }
  };

  const startLocationTracking = async () => {
    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000, // Update every second
          distanceInterval: 1, // Update every 1 meter
        },
        (location) => {
          const newPoint: LocationPoint = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: Date.now(),
            speed: location.coords.speed || 0,
          };

          setCurrentLocation(newPoint);
          setRoute(prevRoute => {
            const updatedRoute = [...prevRoute, newPoint];
            
            // Calculate stats
            if (updatedRoute.length > 1) {
              const distance = calculateTotalDistance(updatedRoute);
              const speeds = updatedRoute.map(p => p.speed || 0).filter(s => s > 0);
              const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
              const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
              const calories = Math.floor(distance * 65); // Rough calculation: 65 cal/km
              
              setRunStats(prev => ({
                ...prev,
                distance,
                maxSpeed: maxSpeed * 3.6, // m/s to km/h
                averageSpeed: averageSpeed * 3.6, // m/s to km/h
                calories
              }));
            }
            
            return updatedRoute;
          });

          // Center map on current location
          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: newPoint.latitude,
              longitude: newPoint.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }, 1000);
          }
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error('Location tracking error:', error);
      Alert.alert('Hata', 'GPS takibi başlatılamadı.');
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
      setLocationSubscription(null);
    }
  };

  const calculateTotalDistance = (points: LocationPoint[]): number => {
    if (points.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const distance = calculateDistance(points[i-1], points[i]);
      totalDistance += distance;
    }
    return totalDistance;
  };

  const calculateDistance = (point1: LocationPoint, point2: LocationPoint): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
    const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDuration = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRun = async () => {
    if (!currentLocation) {
      Alert.alert('Hata', 'GPS konumu alınamadı. Lütfen bekleyin.');
      return;
    }

    const runId = `run_${Date.now()}`;
    dispatch(startRun(runId));
    setStartTime(Date.now());
    setRoute([currentLocation]);
    setRunStats({ distance: 0, duration: 0, averageSpeed: 0, maxSpeed: 0, calories: 0 });
    
    await startLocationTracking();
  };

  const handleStopRun = async () => {
    dispatch(stopRun());
    stopLocationTracking();
    
    if (route.length > 1 && runStats.distance > 0) {
      await saveRunToBackend();
    }
    
    Alert.alert(
      'Koşu Tamamlandı!',
      `Mesafe: ${runStats.distance.toFixed(2)} km\nSüre: ${formatDuration(runStats.duration)}\nOrtalama Hız: ${runStats.averageSpeed.toFixed(1)} km/h\nKalori: ${runStats.calories} kcal`,
      [
        { text: 'Tamam', onPress: resetRun }
      ]
    );
  };

  const saveRunToBackend = async () => {
    try {
      const runData = {
        userId: 'ddd076cd-bb05-49b9-b5e7-5a378243e24b', // Test user ID - would come from auth
        route: route.map(p => ({ latitude: p.latitude, longitude: p.longitude })),
        startPoint: { latitude: route[0].latitude, longitude: route[0].longitude },
        endPoint: { latitude: route[route.length - 1].latitude, longitude: route[route.length - 1].longitude },
        distanceMeters: Math.round(runStats.distance * 1000),
        duration: formatDuration(runStats.duration),
        averageSpeedKmh: runStats.averageSpeed,
        maxSpeedKmh: runStats.maxSpeed,
        caloriesBurned: runStats.calories
      };

      const response = await ApiService.createUserRun(runData);
      
      if (response.success) {
        console.log('Run saved successfully:', response.data);
      } else {
        console.error('Failed to save run:', response.error);
      }
    } catch (error) {
      console.error('Error saving run:', error);
    }
  };

  const resetRun = () => {
    setRoute([]);
    setRunStats({ distance: 0, duration: 0, averageSpeed: 0, maxSpeed: 0, calories: 0 });
    setStartTime(null);
  };

  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        {currentLocation && (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation={true}
            showsMyLocationButton={false}
            followsUserLocation={isRunning}
            mapType="standard"
          >
            {/* Running route */}
            {route.length > 1 && (
              <Polyline
                coordinates={route.map(point => ({
                  latitude: point.latitude,
                  longitude: point.longitude,
                }))}
                strokeColor="#FF6B6B"
                strokeWidth={4}
              />
            )}
            
            {/* Start point marker */}
            {route.length > 0 && (
              <Marker
                coordinate={{
                  latitude: route[0].latitude,
                  longitude: route[0].longitude,
                }}
                title="Başlangıç"
                pinColor="green"
              />
            )}
            
            {/* End point marker */}
            {route.length > 1 && !isRunning && (
              <Marker
                coordinate={{
                  latitude: route[route.length - 1].latitude,
                  longitude: route[route.length - 1].longitude,
                }}
                title="Bitiş"
                pinColor="red"
              />
            )}
          </MapView>
        )}
      </View>

      {/* Stats Overlay */}
      <View style={[styles.statsOverlay, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {runStats.distance.toFixed(2)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              km
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {formatDuration(runStats.duration)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              süre
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {runStats.averageSpeed.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              km/h
            </Text>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {runStats.maxSpeed.toFixed(1)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              max hız
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.text }]}>
              {runStats.calories}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              kcal
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: isRunning ? '#4CAF50' : theme.colors.text }]}>
              {isRunning ? '●' : '○'}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
              durum
            </Text>
          </View>
        </View>
      </View>

      {/* Control Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.runButton,
            {
              backgroundColor: isRunning ? '#FF5252' : '#4CAF50',
            },
          ]}
          onPress={isRunning ? handleStopRun : handleStartRun}
          disabled={!currentLocation}
        >
          <Text style={styles.buttonText}>
            {isRunning ? '🛑 Koşuyu Durdur' : '🏃‍♂️ Koşuyu Başlat'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  statsOverlay: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  runButton: {
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: 'white',
  },
});

export default RunningScreen; 