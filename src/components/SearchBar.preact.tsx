import { useState } from 'preact/hooks';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <form method="get" action="/tienda" class="relative" role="search">
      <label for="search-input" class="sr-only">Buscar mangas</label>
      <input
        id="search-input"
        type="search"
        name="search"
        value={query}
        onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
        placeholder="Buscar mangas..."
        class="w-full px-4 py-2 pr-12 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        autocomplete="off"
        minLength={2}
      />
      <button
        type="submit"
        disabled={!query.trim() || query.trim().length < 2}
        class="absolute right-2 top-1/2 -translate-y-1/2 text-dark-500 hover:text-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Buscar"
      >
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}
