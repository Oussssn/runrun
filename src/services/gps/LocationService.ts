import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number;
  timestamp: number;
}

export interface RoutePoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
  accuracy?: number;
}

class LocationService {
  private locationSubscription: Location.LocationSubscription | null = null;
  private isTracking = false;
  private routePoints: RoutePoint[] = [];
  private onLocationUpdate?: (location: LocationData) => void;
  private onRouteUpdate?: (route: RoutePoint[]) => void;

  async requestPermissions(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(): Promise<LocationData | null> {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        speed: location.coords.speed || 0,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  startLocationTracking(
    onLocationUpdate: (location: LocationData) => void,
    onRouteUpdate?: (route: RoutePoint[]) => void
  ) {
    if (this.isTracking) {
      console.warn('Location tracking is already active');
      return;
    }

    this.onLocationUpdate = onLocationUpdate;
    this.onRouteUpdate = onRouteUpdate;
    this.isTracking = true;
    this.routePoints = [];

    this.locationSubscription = Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, // Update every 5 seconds
        distanceInterval: 10, // Update every 10 meters
      },
      (location) => {
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          accuracy: location.coords.accuracy || 0,
          speed: location.coords.speed || 0,
          timestamp: location.timestamp,
        };

        // Add to route points
        const routePoint: RoutePoint = {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          timestamp: locationData.timestamp,
          speed: locationData.speed,
          accuracy: locationData.accuracy,
        };

        this.routePoints.push(routePoint);

        // Notify listeners
        this.onLocationUpdate?.(locationData);
        this.onRouteUpdate?.(this.routePoints);
      }
    );
  }

  stopLocationTracking() {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
    this.isTracking = false;
    this.onLocationUpdate = undefined;
    this.onRouteUpdate = undefined;
  }

  getRoutePoints(): RoutePoint[] {
    return [...this.routePoints];
  }

  clearRoute() {
    this.routePoints = [];
  }

  calculateDistance(points: RoutePoint[]): number {
    if (points.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      totalDistance += this.calculateDistanceBetweenPoints(prev, curr);
    }
    return totalDistance;
  }

  calculateAverageSpeed(points: RoutePoint[]): number {
    if (points.length < 2) return 0;

    const speeds = points
      .map(point => point.speed || 0)
      .filter(speed => speed > 0);

    if (speeds.length === 0) return 0;

    const totalSpeed = speeds.reduce((sum, speed) => sum + speed, 0);
    return totalSpeed / speeds.length;
  }

  calculateDuration(points: RoutePoint[]): number {
    if (points.length < 2) return 0;

    const startTime = points[0].timestamp;
    const endTime = points[points.length - 1].timestamp;
    return (endTime - startTime) / 1000; // Convert to seconds
  }

  private calculateDistanceBetweenPoints(point1: RoutePoint, point2: RoutePoint): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (point1.latitude * Math.PI) / 180;
    const φ2 = (point2.latitude * Math.PI) / 180;
    const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  isTracking(): boolean {
    return this.isTracking;
  }
}

export default new LocationService(); 