// ===================================
// TIPOS PARA MANGA (ANILIST API)
// ===================================

export interface MangaTitle {
  romaji: string;
  english: string | null;
  native: string;
}

export interface MangaCoverImage {
  large: string;
  medium: string;
}

export interface MangaFromAPI {
  id: number;
  title: MangaTitle;
  coverImage: MangaCoverImage;
  description: string | null;
  genres: string[];
  averageScore: number | null;
  popularity: number;
  status: string;
  volumes: number | null;
  chapters: number | null;
}

export interface Manga extends MangaFromAPI {
  price: number;
  stock: number;
}

export interface PageInfo {
  total: number;
  currentPage: number;
  lastPage: number;
  hasNextPage: boolean;
  perPage: number;
}

export interface AniListResponse {
  Page: {
    pageInfo: PageInfo;
    media: MangaFromAPI[];
  };
}

// ===================================
// TIPOS PARA CARRITO DE COMPRA
// ===================================

export interface CartItem {
  mangaId: number;
  title: string;
  price: number;
  quantity: number;
  coverImage: string;
  maxStock: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// ===================================
// TIPOS PARA BÚSQUEDA
// ===================================

export interface SearchState {
  query: string;
  isSearching: boolean;
  results: Manga[];
}

// ===================================
// TIPOS PARA DASHBOARD
// ===================================

export interface DashboardMetrics {
  mangasSoldToday: number;
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
}

export interface TopSellingGenre {
  genre: string;
  sales: number;
  percentage: number;
}

export interface RecentOrder {
  id: string;
  manga: string;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'shipped';
}

export interface DashboardData {
  metrics: DashboardMetrics;
  topGenres: TopSellingGenre[];
  recentOrders: RecentOrder[];
}

// ===================================
// TIPOS PARA COMUNIDAD
// ===================================

export interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  testimonial: string;
  rating: number;
  joinDate: string;
  favoriteGenre: string;
}

export interface RandomUser {
  name: {
    first: string;
    last: string;
  };
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
  email: string;
  registered: {
    date: string;
  };
}

export interface RandomUserResponse {
  results: RandomUser[];
}

// ===================================
// TIPOS PARA FORMULARIO DE CONTACTO
// ===================================

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FormValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormValidationErrors;
}

export interface FormSubmitResult {
  success: boolean;
  message: string;
}

// ===================================
// TIPOS PARA UBICACIÓN (MAPA)
// ===================================

export interface StoreLocation {
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: {
    weekday: string;
    weekend: string;
  };
  phone: string;
  email: string;
}

// ===================================
// TIPOS PARA CONFIGURACIÓN
// ===================================

export interface AppConfig {
  storeName: string;
  storeEmail: string;
  anilistApiUrl: string;
  minPrice: number;
  maxPrice: number;
  minStock: number;
  maxStock: number;
  itemsPerPage: number;
}
