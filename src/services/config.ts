import type { AppConfig, StoreLocation } from '../types/index';

/**
 * Configuración global de la aplicación
 * Lee variables de entorno y proporciona valores por defecto
 */
export const appConfig: AppConfig = {
  storeName: import.meta.env.PUBLIC_STORE_NAME || 'Akihabara Manga Store',
  storeEmail: import.meta.env.PUBLIC_STORE_EMAIL || 'contacto@akihabaramanga.jp',
  anilistApiUrl: import.meta.env.PUBLIC_ANILIST_API_URL || 'https://graphql.anilist.co',
  minPrice: Number(import.meta.env.PUBLIC_MIN_PRICE) || 7,
  maxPrice: Number(import.meta.env.PUBLIC_MAX_PRICE) || 15,
  minStock: Number(import.meta.env.PUBLIC_MIN_STOCK) || 5,
  maxStock: Number(import.meta.env.PUBLIC_MAX_STOCK) || 50,
  itemsPerPage: Number(import.meta.env.PUBLIC_ITEMS_PER_PAGE) || 12,
};

/**
 * Ubicación de la tienda física
 */
export const storeLocation: StoreLocation = {
  name: appConfig.storeName,
  address: '1-1 Sotokanda, Chiyoda City, Tokyo 101-0021, Japan',
  coordinates: {
    lat: Number(import.meta.env.PUBLIC_STORE_LOCATION_LAT) || 35.7022,
    lng: Number(import.meta.env.PUBLIC_STORE_LOCATION_LNG) || 139.7744,
  },
  hours: {
    weekday: '10:00 - 20:00',
    weekend: '10:00 - 21:00',
  },
  phone: '+81 3-1234-5678',
  email: appConfig.storeEmail,
};
