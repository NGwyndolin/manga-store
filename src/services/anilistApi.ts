import { GraphQLClient, gql } from 'graphql-request';
import type { AniListResponse, Manga, MangaFromAPI } from '../types/index';
import { appConfig } from './config';
import { generateRandomPrice, generateRandomStock } from '../utils/priceGenerator';

/**
 * Cliente GraphQL configurado para AniList API
 */
const client = new GraphQLClient(appConfig.anilistApiUrl, {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

/**
 * Query GraphQL para obtener catálogo de mangas
 */
const MANGA_CATALOG_QUERY = gql`
  query GetMangaCatalog($page: Int, $perPage: Int, $search: String, $genre: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: MANGA, search: $search, genre: $genre, sort: POPULARITY_DESC) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        description
        genres
        averageScore
        popularity
        status
        volumes
        chapters
      }
    }
  }
`;

/**
 * Query GraphQL para obtener un manga específico por ID
 */
const MANGA_BY_ID_QUERY = gql`
  query GetMangaById($id: Int!) {
    Media(id: $id, type: MANGA) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        large
        medium
      }
      description
      genres
      averageScore
      popularity
      status
      volumes
      chapters
    }
  }
`;

/**
 * Query GraphQL para obtener mangas populares (para home destacados)
 */
const POPULAR_MANGA_QUERY = gql`
  query GetPopularManga($perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(type: MANGA, sort: [POPULARITY_DESC, SCORE_DESC]) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        description
        genres
        averageScore
        popularity
        status
        volumes
        chapters
      }
    }
  }
`;

/**
 * Enriquece un manga de la API con precio y stock aleatorios
 */
function enrichMangaWithStoreData(manga: MangaFromAPI): Manga {
  return {
    ...manga,
    price: generateRandomPrice(appConfig.minPrice, appConfig.maxPrice),
    stock: generateRandomStock(appConfig.minStock, appConfig.maxStock),
  };
}

/**
 * Obtiene un catálogo de mangas con paginación y filtros
 */
export async function getMangaCatalog(
  page: number = 1,
  perPage: number = appConfig.itemsPerPage,
  search?: string,
  genre?: string
): Promise<{ mangas: Manga[]; pageInfo: AniListResponse['Page']['pageInfo'] }> {
  try {
    // Construir variables solo con valores definidos
    const variables: any = {
      page,
      perPage,
    };

    // Solo añadir search y genre si tienen valores
    if (search && search.trim()) {
      variables.search = search.trim();
    }
    
    if (genre && genre.trim()) {
      variables.genre = genre.trim();
    }

    console.log('Fetching mangas with variables:', variables);

    const data = await client.request<AniListResponse>(MANGA_CATALOG_QUERY, variables);

    const mangas = data.Page.media.map(enrichMangaWithStoreData);

    console.log(`Fetched ${mangas.length} mangas from AniList API`);

    return {
      mangas,
      pageInfo: data.Page.pageInfo,
    };
  } catch (error) {
    console.error('Error fetching manga catalog:', error);
    throw new Error('No se pudo cargar el catálogo de mangas');
  }
}

/**
 * Obtiene un manga específico por su ID
 */
export async function getMangaById(id: number): Promise<Manga | null> {
  try {
    const data = await client.request<{ Media: MangaFromAPI }>(MANGA_BY_ID_QUERY, { id });

    if (!data.Media) {
      return null;
    }

    return enrichMangaWithStoreData(data.Media);
  } catch (error) {
    console.error(`Error fetching manga with id ${id}:`, error);
    return null;
  }
}

/**
 * Obtiene mangas populares para la sección destacados
 */
export async function getPopularMangas(limit: number = 6): Promise<Manga[]> {
  try {
    const data = await client.request<AniListResponse>(POPULAR_MANGA_QUERY, {
      perPage: limit,
    });

    return data.Page.media.map(enrichMangaWithStoreData);
  } catch (error) {
    console.error('Error fetching popular mangas:', error);
    throw new Error('No se pudieron cargar los mangas populares');
  }
}

/**
 * Busca mangas por título
 */
export async function searchMangas(query: string, limit: number = 20): Promise<Manga[]> {
  try {
    const { mangas } = await getMangaCatalog(1, limit, query);
    return mangas;
  } catch (error) {
    console.error('Error searching mangas:', error);
    return [];
  }
}

/**
 * Obtiene todos los géneros disponibles (lista estática basada en AniList)
 */
export function getAvailableGenres(): string[] {
  return [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Hentai',
    'Horror',
    'Mystery',
    'Psychological',
    'Romance',
    'Sci-Fi',
    'Slice of Life',
    'Sports',
    'Supernatural',
    'Thriller',
  ];
}
