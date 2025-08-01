import { ISTANBUL_BOUNDS, TERRITORY_GRID_SIZE, CAPTURE_RADIUS } from '../istanbul/constants';

export interface TerritoryGrid {
  id: string;
  latitude: number;
  longitude: number;
  district: string;
  isCaptured: boolean;
  owner?: string;
  captureTime?: Date;
}

export class TerritoryCalculator {
  static generateTerritoryGrid(): TerritoryGrid[] {
    const territories: TerritoryGrid[] = [];
    
    // Generate grid within Istanbul bounds
    for (let lat = ISTANBUL_BOUNDS.south; lat <= ISTANBUL_BOUNDS.north; lat += TERRITORY_GRID_SIZE) {
      for (let lon = ISTANBUL_BOUNDS.west; lon <= ISTANBUL_BOUNDS.east; lon += TERRITORY_GRID_SIZE) {
        const territoryId = `territory_${lat.toFixed(4)}_${lon.toFixed(4)}`;
        const district = this.getDistrictFromCoordinates(lat, lon);
        
        territories.push({
          id: territoryId,
          latitude: lat,
          longitude: lon,
          district,
          isCaptured: false,
        });
      }
    }
    
    return territories;
  }

  static isLocationInTerritory(
    userLat: number,
    userLon: number,
    territoryLat: number,
    territoryLon: number
  ): boolean {
    const distance = this.calculateDistance(userLat, userLon, territoryLat, territoryLon);
    return distance <= CAPTURE_RADIUS;
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
    return R * c; // Distance in kilometers
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static getDistrictFromCoordinates(latitude: number, longitude: number): string {
    // Simplified district mapping - in real app, this would use actual district boundaries
    const districts = [
      'Beşiktaş',
      'Kadıköy',
      'Şişli',
      'Beyoğlu',
      'Üsküdar',
      'Fatih',
      'Bakırköy',
      'Maltepe',
      'Kartal',
      'Pendik',
      'Tuzla',
      'Sultanbeyli',
      'Sancaktepe',
      'Çekmeköy',
      'Ümraniye',
      'Ataşehir',
      'Sarıyer',
      'Kağıthane',
      'Sultangazi',
      'Gaziosmanpaşa',
      'Eyüpsultan',
      'Bayrampaşa',
      'Esenler',
      'Bağcılar',
      'Güngören',
      'Zeytinburnu',
      'Küçükçekmece',
      'Avcılar',
      'Esenyurt',
      'Büyükçekmece',
      'Çatalca',
      'Silivri',
      'Şile',
    ];

    // Simple hash-based district selection
    const hash = Math.abs(latitude + longitude);
    const index = Math.floor(hash) % districts.length;
    return districts[index];
  }

  static calculateTerritoryPoints(territory: TerritoryGrid, isLandmark: boolean = false): number {
    let basePoints = 100; // Base points for regular territory
    
    if (isLandmark) {
      basePoints = 200; // Extra points for landmarks
    }
    
    // Bonus points for districts with fewer territories
    const districtBonus = this.getDistrictBonus(territory.district);
    
    return basePoints + districtBonus;
  }

  private static getDistrictBonus(district: string): number {
    // Some districts might have bonus points due to difficulty or prestige
    const bonusDistricts: { [key: string]: number } = {
      'Fatih': 50, // Historical district
      'Beşiktaş': 30, // Popular district
      'Kadıköy': 30, // Popular district
      'Beyoğlu': 40, // Tourist district
      'Sarıyer': 20, // Forest areas
    };
    
    return bonusDistricts[district] || 0;
  }

  static calculateExperienceGain(
    territory: TerritoryGrid,
    isLandmark: boolean = false,
    isSpecialLandmark: boolean = false
  ): number {
    let baseExperience = 50; // Base experience for regular territory
    
    if (isLandmark) {
      baseExperience = 100;
    }
    
    if (isSpecialLandmark) {
      baseExperience = 250;
    }
    
    // Bonus experience for certain districts
    const districtBonus = this.getDistrictExperienceBonus(territory.district);
    
    return baseExperience + districtBonus;
  }

  private static getDistrictExperienceBonus(district: string): number {
    const experienceBonus: { [key: string]: number } = {
      'Fatih': 25, // Historical significance
      'Beşiktaş': 15, // Popular area
      'Kadıköy': 15, // Popular area
      'Beyoğlu': 20, // Tourist area
      'Sarıyer': 10, // Natural beauty
    };
    
    return experienceBonus[district] || 0;
  }

  static isLocationInIstanbul(latitude: number, longitude: number): boolean {
    return (
      latitude >= ISTANBUL_BOUNDS.south &&
      latitude <= ISTANBUL_BOUNDS.north &&
      longitude >= ISTANBUL_BOUNDS.west &&
      longitude <= ISTANBUL_BOUNDS.east
    );
  }

  static getTerritoryIdFromCoordinates(latitude: number, longitude: number): string {
    // Round to grid size to get territory ID
    const gridLat = Math.round(latitude / TERRITORY_GRID_SIZE) * TERRITORY_GRID_SIZE;
    const gridLon = Math.round(longitude / TERRITORY_GRID_SIZE) * TERRITORY_GRID_SIZE;
    
    return `territory_${gridLat.toFixed(4)}_${gridLon.toFixed(4)}`;
  }
}

export default TerritoryCalculator; 