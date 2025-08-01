import * as Location from 'expo-location';
import { Location as LocationType } from '../../store/slices/locationSlice';

export class LocationService {
  private static locationSubscription: Location.LocationSubscription | null = null;

  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Location permission request failed:', error);
      return false;
    }
  }

  static async getCurrentLocation(): Promise<LocationType | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 1000,
        distanceInterval: 10,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
        speed: location.coords.speed || undefined,
        heading: location.coords.heading || undefined,
      };
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }

  static async startLocationTracking(
    onLocationUpdate: (location: LocationType) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        onError?.('Konum izni reddedildi');
        return;
      }

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (location) => {
          const locationData: LocationType = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
            speed: location.coords.speed || undefined,
            heading: location.coords.heading || undefined,
          };
          onLocationUpdate(locationData);
        }
      );
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      onError?.('Konum takibi başlatılamadı');
    }
  }

  static stopLocationTracking(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static isLocationInIstanbul(latitude: number, longitude: number): boolean {
    // Istanbul boundaries (approximate)
    const istanbulBounds = {
      north: 41.2,
      south: 40.8,
      east: 29.3,
      west: 28.5,
    };

    return (
      latitude >= istanbulBounds.south &&
      latitude <= istanbulBounds.north &&
      longitude >= istanbulBounds.west &&
      longitude <= istanbulBounds.east
    );
  }

  static getDistrictFromCoordinates(latitude: number, longitude: number): string {
    // This would be replaced with actual district mapping logic
    // For now, return a mock district based on coordinates
    const districts = [
      'Beşiktaş',
      'Kadıköy',
      'Şişli',
      'Beyoğlu',
      'Üsküdar',
      'Fatih',
      'Bakırköy',
      'Maltepe',
    ];

    // Simple hash-based district selection
    const hash = Math.abs(latitude + longitude);
    const index = Math.floor(hash) % districts.length;
    return districts[index];
  }
}

export default LocationService; 