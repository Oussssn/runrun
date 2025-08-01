// İstanbul'a özel sabitler ve veriler

export const ISTANBUL_BOUNDS = {
  north: 41.2,
  south: 40.8,
  east: 29.3,
  west: 28.5,
};

export const ISTANBUL_DISTRICTS = [
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
  'Çanakkale',
  'Gebze',
  'Darıca',
  'Kocaeli',
  'İzmit',
  'Gölcük',
  'Körfez',
  'Dilovası',
  'Kartepe',
  'Başiskele',
  'Kandıra',
  'İzmit',
  'Gölcük',
  'Körfez',
  'Dilovası',
  'Kartepe',
  'Başiskele',
  'Kandıra',
] as const;

export const ISTANBUL_LANDMARKS = [
  {
    id: 'ayasofya',
    name: 'Ayasofya',
    district: 'Fatih',
    coordinates: { latitude: 41.0086, longitude: 28.9802 },
    points: 500,
    isSpecial: true,
  },
  {
    id: 'topkapi',
    name: 'Topkapı Sarayı',
    district: 'Fatih',
    coordinates: { latitude: 41.0115, longitude: 28.9834 },
    points: 400,
    isSpecial: true,
  },
  {
    id: 'sultanahmet',
    name: 'Sultanahmet Camii',
    district: 'Fatih',
    coordinates: { latitude: 41.0054, longitude: 28.9768 },
    points: 400,
    isSpecial: true,
  },
  {
    id: 'galata',
    name: 'Galata Kulesi',
    district: 'Beyoğlu',
    coordinates: { latitude: 41.0256, longitude: 28.9744 },
    points: 300,
    isSpecial: true,
  },
  {
    id: 'dolmabahce',
    name: 'Dolmabahçe Sarayı',
    district: 'Beşiktaş',
    coordinates: { latitude: 41.0392, longitude: 29.0002 },
    points: 350,
    isSpecial: true,
  },
  {
    id: 'bosphorus_bridge',
    name: 'Boğaziçi Köprüsü',
    district: 'Beşiktaş',
    coordinates: { latitude: 41.0392, longitude: 29.0377 },
    points: 600,
    isSpecial: true,
  },
  {
    id: 'fatih_sultan_mehmet_bridge',
    name: 'Fatih Sultan Mehmet Köprüsü',
    district: 'Sarıyer',
    coordinates: { latitude: 41.0889, longitude: 29.0567 },
    points: 600,
    isSpecial: true,
  },
  {
    id: 'yavuz_sultan_selim_bridge',
    name: 'Yavuz Sultan Selim Köprüsü',
    district: 'Sarıyer',
    coordinates: { latitude: 41.2028, longitude: 29.1111 },
    points: 600,
    isSpecial: true,
  },
] as const;

export const POPULAR_RUNNING_ROUTES = [
  {
    id: 'emirgan_park',
    name: 'Emirgan Korusu',
    district: 'Sarıyer',
    coordinates: { latitude: 41.1089, longitude: 29.0567 },
    distance: 5.2, // km
    difficulty: 'easy',
  },
  {
    id: 'belgrad_forest',
    name: 'Belgrad Ormanı',
    district: 'Sarıyer',
    coordinates: { latitude: 41.1833, longitude: 28.9833 },
    distance: 8.5, // km
    difficulty: 'medium',
  },
  {
    id: 'macka_park',
    name: 'Maçka Parkı',
    district: 'Şişli',
    coordinates: { latitude: 41.0472, longitude: 28.9878 },
    distance: 3.1, // km
    difficulty: 'easy',
  },
  {
    id: 'bebek_coastal',
    name: 'Bebek Sahil Yolu',
    district: 'Beşiktaş',
    coordinates: { latitude: 41.0778, longitude: 29.0433 },
    distance: 4.8, // km
    difficulty: 'easy',
  },
  {
    id: 'kadikoy_coastal',
    name: 'Kadıköy Sahil Yolu',
    district: 'Kadıköy',
    coordinates: { latitude: 40.9903, longitude: 29.0278 },
    distance: 6.2, // km
    difficulty: 'easy',
  },
] as const;

export const TERRITORY_GRID_SIZE = 0.01; // Approximately 1km x 1km grid
export const CAPTURE_RADIUS = 0.005; // 500 meters capture radius
export const MIN_RUNNING_SPEED = 2.0; // km/h - minimum speed to count as running
export const MAX_RUNNING_SPEED = 15.0; // km/h - maximum speed to count as running

export const POINTS_PER_TERRITORY = 100;
export const POINTS_PER_LANDMARK = 200;
export const POINTS_PER_SPECIAL_LANDMARK = 500;
export const EXPERIENCE_PER_TERRITORY = 50;
export const EXPERIENCE_PER_LANDMARK = 100;
export const EXPERIENCE_PER_SPECIAL_LANDMARK = 250;

export const LEVEL_EXPERIENCE_REQUIREMENT = 1000; // Base experience needed for level 2
export const EXPERIENCE_MULTIPLIER = 1.5; // Experience needed increases by 50% each level 