import { atom } from 'nanostores';
import type { SearchState } from '@/types';

/**
 * Store para el estado de búsqueda
 */
export const searchState = atom<SearchState>({
  query: '',
  isSearching: false,
  results: [],
});

/**
 * Establece el query de búsqueda
 */
export function setSearchQuery(query: string): void {
  searchState.set({
    ...searchState.get(),
    query,
  });
}

/**
 * Establece el estado de búsqueda (cargando o no)
 */
export function setSearching(isSearching: boolean): void {
  searchState.set({
    ...searchState.get(),
    isSearching,
  });
}

/**
 * Establece los resultados de búsqueda
 */
export function setSearchResults(results: SearchState['results']): void {
  searchState.set({
    ...searchState.get(),
    results,
    isSearching: false,
  });
}

/**
 * Limpia la búsqueda
 */
export function clearSearch(): void {
  searchState.set({
    query: '',
    isSearching: false,
    results: [],
  });
}
