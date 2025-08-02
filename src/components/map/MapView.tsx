import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE, Callout, Polyline } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Territory {
  id: string;
  name: string;
  district: string;
  coordinates: any;
  isCaptured: boolean;
  capturedBy?: {
    id: string;
    displayName: string;
    photoUrl?: string;
  };
  score: number;
  captureTime?: string;
}

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

interface MapViewProps {
  territories?: Territory[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onTerritoryPress?: (territory: Territory) => void;
  onCheckpointPress?: (checkpoint: Checkpoint) => void;
  showUserLocation?: boolean;
  showTerritories?: boolean;
  selectedRoute?: Checkpoint[];
  userRoute?: Array<{ latitude: number; longitude: number }>;
  isRunning?: boolean;
}

const MapViewComponent: React.FC<MapViewProps> = ({
  territories = [],
  userLocation,
  onTerritoryPress,
  onCheckpointPress,
  showUserLocation = true,
  showTerritories = true,
  selectedRoute = [],
  userRoute = [],
  isRunning = false
}) => {
  const { theme } = useTheme();
  const mapRef = useRef<MapView>(null);
  
  // Istanbul center coordinates
  const istanbulCenter = {
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [region, setRegion] = useState(istanbulCenter);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  // Sample checkpoints
  const checkpoints: Checkpoint[] = [
    {
      id: 'cp1',
      name: 'Taksim Meydanı',
      coordinate: { latitude: 41.0370, longitude: 28.9850 },
      type: 'start'
    },
    {
      id: 'cp2',
      name: 'Galata Kulesi',
      coordinate: { latitude: 41.0256, longitude: 28.9744 },
      type: 'checkpoint'
    },
    {
      id: 'cp3',
      name: 'Sultanahmet',
      coordinate: { latitude: 41.0058, longitude: 28.9784 },
      type: 'checkpoint'
    },
    {
      id: 'cp4',
      name: 'Beşiktaş İskelesi',
      coordinate: { latitude: 41.0425, longitude: 29.0058 },
      type: 'finish'
    },
    {
      id: 'cp5',
      name: 'Kadıköy Meydanı',
      coordinate: { latitude: 40.9909, longitude: 29.0303 },
      type: 'checkpoint'
    },
    {
      id: 'cp6',
      name: 'Maçka Parkı',
      coordinate: { latitude: 41.0450, longitude: 28.9850 },
      type: 'checkpoint'
    },
    {
      id: 'cp7',
      name: 'Emirgan Korusu',
      coordinate: { latitude: 41.1080, longitude: 29.0550 },
      type: 'checkpoint'
    },
    {
      id: 'cp8',
      name: 'Bebek Sahili',
      coordinate: { latitude: 41.0770, longitude: 29.0430 },
      type: 'checkpoint'
    }
  ];

  // Generate grid cells
  const generateGrid = () => {
    const gridCells = [];
    const startLat = 40.8;
    const endLat = 41.2;
    const startLng = 28.5;
    const endLng = 29.5;
    const cellSize = 0.02; // ~2km cells

    for (let lat = startLat; lat < endLat; lat += cellSize) {
      for (let lng = startLng; lng < endLng; lng += cellSize) {
        gridCells.push({
          id: `grid_${lat}_${lng}`,
          coordinates: [
            { latitude: lat, longitude: lng },
            { latitude: lat + cellSize, longitude: lng },
            { latitude: lat + cellSize, longitude: lng + cellSize },
            { latitude: lat, longitude: lng + cellSize },
          ]
        });
      }
    }
    return gridCells;
  };

  const gridCells = generateGrid();

  useEffect(() => {
    if (userLocation && isMapReady) {
      const newRegion = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setIsFollowingUser(true);
      
      // Animate to user location
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  }, [userLocation, isMapReady]);

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  const handleRegionChange = (newRegion: any) => {
    // Only update region if it's a significant change
    const latDiff = Math.abs(newRegion.latitude - region.latitude);
    const lngDiff = Math.abs(newRegion.longitude - region.longitude);
    
    if (latDiff > 0.001 || lngDiff > 0.001) {
      setRegion(newRegion);
      // Stop following user when they manually move the map
      setIsFollowingUser(false);
    }
  };

  const goToUserLocation = () => {
    if (userLocation) {
      const newRegion = {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      setIsFollowingUser(true);
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  };

  const getTerritoryColor = (territory: Territory) => {
    if (!territory.isCaptured) {
      return 'rgba(255, 255, 255, 0.3)'; // Uncaptured - transparent white
    }
    return 'rgba(0, 255, 0, 0.6)'; // Captured - green
  };

  const getTerritoryBorderColor = (territory: Territory) => {
    if (!territory.isCaptured) {
      return 'rgba(255, 255, 255, 0.8)'; // Uncaptured - white border
    }
    return 'rgba(0, 255, 0, 1)'; // Captured - green border
  };

  const getMarkerIcon = (territory: Territory) => {
    if (territory.isCaptured) {
      return '🏆'; // Trophy for captured
    }
    return '🎯'; // Target for uncaptured
  };

  const getCheckpointIcon = (checkpoint: Checkpoint) => {
    switch (checkpoint.type) {
      case 'start':
        return '🏁';
      case 'finish':
        return '🎯';
      default:
        return '🚩';
    }
  };

  const getCheckpointColor = (checkpoint: Checkpoint) => {
    if (checkpoint.isSelected) return '#FF6B35';
    switch (checkpoint.type) {
      case 'start':
        return '#28A745';
      case 'finish':
        return '#DC3545';
      default:
        return '#007AFF';
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'ios' ? undefined : PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        onMapReady={handleMapReady}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={false} // Hide default button
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        mapType="standard"
        followsUserLocation={isFollowingUser} // Only follow when user wants to
        customMapStyle={[
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]}
      >
        {/* Grid cells */}
        {gridCells.map((cell) => (
          <Polygon
            key={cell.id}
            coordinates={cell.coordinates}
            fillColor="rgba(200, 200, 200, 0.1)"
            strokeColor="rgba(200, 200, 200, 0.3)"
            strokeWidth={1}
          />
        ))}

        {/* User location marker */}
        {userLocation && showUserLocation && (
          <Marker
            coordinate={userLocation}
            title="Konumunuz"
            description="Şu anki konumunuz"
            pinColor="blue"
          />
        )}

        {/* Territory polygons */}
        {showTerritories && territories.map((territory) => (
          <Polygon
            key={territory.id}
            coordinates={territory.coordinates}
            fillColor={getTerritoryColor(territory)}
            strokeColor={getTerritoryBorderColor(territory)}
            strokeWidth={2}
            tappable={true}
            onPress={() => onTerritoryPress?.(territory)}
          />
        ))}

        {/* Territory center markers with callouts */}
        {showTerritories && territories.map((territory) => {
          const center = getPolygonCenter(territory.coordinates);
          return (
            <Marker
              key={`marker-${territory.id}`}
              coordinate={center}
              title={territory.name}
              description={`${territory.district} - ${territory.score} puan`}
              pinColor={territory.isCaptured ? 'green' : 'red'}
              onPress={() => onTerritoryPress?.(territory)}
            >
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <View style={styles.calloutHeader}>
                    <Text style={styles.calloutTitle}>{territory.name}</Text>
                    <Text style={styles.calloutEmoji}>
                      {getMarkerIcon(territory)}
                    </Text>
                  </View>
                  <Text style={styles.calloutDistrict}>{territory.district}</Text>
                  <Text style={styles.calloutScore}>{territory.score} puan</Text>
                  {territory.isCaptured && territory.capturedBy && (
                    <View style={styles.calloutCaptured}>
                      <Text style={styles.calloutCapturedText}>
                        Yakalayan: {territory.capturedBy.displayName}
                      </Text>
                      {territory.captureTime && (
                        <Text style={styles.calloutDate}>
                          {new Date(territory.captureTime).toLocaleDateString('tr-TR')}
                        </Text>
                      )}
                    </View>
                  )}
                  {!territory.isCaptured && (
                    <Text style={styles.calloutAvailable}>
                      Henüz yakalanmamış!
                    </Text>
                  )}
                </View>
              </Callout>
            </Marker>
          );
        })}

        {/* Checkpoints */}
        {checkpoints.map((checkpoint) => (
          <Marker
            key={checkpoint.id}
            coordinate={checkpoint.coordinate}
            title={checkpoint.name}
            description={`Checkpoint - ${checkpoint.type}`}
            pinColor={getCheckpointColor(checkpoint)}
            onPress={() => onCheckpointPress?.(checkpoint)}
            tracksViewChanges={false}
          >
            <View style={[styles.checkpointMarker, { backgroundColor: getCheckpointColor(checkpoint) }]}>
              <Text style={styles.checkpointIcon}>
                {getCheckpointIcon(checkpoint)}
              </Text>
            </View>
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <View style={styles.calloutHeader}>
                  <Text style={styles.calloutTitle}>{checkpoint.name}</Text>
                  <Text style={styles.calloutEmoji}>
                    {getCheckpointIcon(checkpoint)}
                  </Text>
                </View>
                <Text style={styles.calloutDistrict}>
                  {checkpoint.type === 'start' ? 'Başlangıç' : 
                   checkpoint.type === 'finish' ? 'Bitiş' : 'Checkpoint'}
                </Text>
                <Text style={styles.calloutAvailable}>
                  Rota seçmek için tıklayın
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Selected route */}
        {selectedRoute.length > 1 && (
          <Polyline
            coordinates={selectedRoute.map(cp => cp.coordinate)}
            strokeColor="#007AFF"
            strokeWidth={4}
            lineDashPattern={[10, 5]}
          />
        )}

        {/* User route (completed path) */}
        {userRoute.length > 1 && (
          <Polyline
            coordinates={userRoute}
            strokeColor="#FF6B35"
            strokeWidth={6}
          />
        )}

        {/* User route (upcoming path) */}
        {isRunning && userRoute.length > 0 && selectedRoute.length > 0 && (
          <Polyline
            coordinates={[
              userRoute[userRoute.length - 1],
              ...selectedRoute.map(cp => cp.coordinate)
            ]}
            strokeColor="#007AFF"
            strokeWidth={4}
            lineDashPattern={[5, 5]}
          />
        )}
      </MapView>

      {/* Custom Location Button */}
      <TouchableOpacity
        style={[
          styles.locationButton,
          { 
            backgroundColor: isFollowingUser ? theme.colors.primary : theme.colors.surface,
            borderColor: theme.colors.border
          }
        ]}
        onPress={goToUserLocation}
      >
        <Ionicons
          name={isFollowingUser ? "navigate" : "navigate-outline"}
          size={24}
          color={isFollowingUser ? theme.colors.background : theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

// Helper function to calculate polygon center
const getPolygonCenter = (coordinates: any[]) => {
  if (!coordinates || coordinates.length === 0) {
    return { latitude: 0, longitude: 0 };
  }

  const latSum = coordinates.reduce((sum, coord) => sum + coord.latitude, 0);
  const lngSum = coordinates.reduce((sum, coord) => sum + coord.longitude, 0);

  return {
    latitude: latSum / coordinates.length,
    longitude: lngSum / coordinates.length,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  locationButton: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  calloutContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  calloutEmoji: {
    fontSize: 20,
  },
  calloutDistrict: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  calloutScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  calloutCaptured: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  calloutCapturedText: {
    fontSize: 12,
    color: '#28A745',
    fontWeight: '500',
  },
  calloutDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  calloutAvailable: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
    marginTop: 4,
  },
  checkpointMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkpointIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MapViewComponent; 