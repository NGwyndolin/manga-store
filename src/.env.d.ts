/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_ANILIST_API_URL: string;
  readonly PUBLIC_STORE_NAME: string;
  readonly PUBLIC_STORE_EMAIL: string;
  readonly PUBLIC_STORE_LOCATION_LAT: string;
  readonly PUBLIC_STORE_LOCATION_LNG: string;
  readonly PUBLIC_MIN_PRICE: string;
  readonly PUBLIC_MAX_PRICE: string;
  readonly PUBLIC_MIN_STOCK: string;
  readonly PUBLIC_MAX_STOCK: string;
  readonly PUBLIC_ITEMS_PER_PAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
