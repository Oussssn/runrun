import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
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
}

interface MapViewProps {
  territories?: Territory[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  onTerritoryPress?: (territory: Territory) => void;
  showUserLocation?: boolean;
  showTerritories?: boolean;
}

const MapViewComponent: React.FC<MapViewProps> = ({
  territories = [],
  userLocation,
  onTerritoryPress,
  showUserLocation = true,
  showTerritories = true
}) => {
  const { theme } = useTheme();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState({
    latitude: 41.0082, // Istanbul center
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Istanbul boundaries
  const istanbulBounds = {
    latitude: 41.0082,
    longitude: 28.9784,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  useEffect(() => {
    if (userLocation) {
      setRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [userLocation]);

  const handleRegionChange = (newRegion: any) => {
    setRegion(newRegion);
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        mapType="standard"
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

        {/* Territory center markers */}
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
            />
          );
        })}
      </MapView>
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
});

export default MapViewComponent; 