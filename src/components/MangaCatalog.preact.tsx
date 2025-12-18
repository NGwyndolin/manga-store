import { useState, useEffect } from 'preact/hooks';
import type { Manga, PageInfo } from '../types/index';
import MangaCard from './MangaCard.preact';
import ShoppingCart from './ShoppingCart.preact';

interface Props {
  initialMangas: Manga[];
  initialPageInfo: PageInfo;
  genres: string[];
  initialSearch?: string;
  initialGenre?: string;
  initialPage?: number;
}

export default function MangaCatalog({ 
  initialMangas, 
  initialPageInfo, 
  genres,
  initialSearch = '',
  initialGenre = '',
  initialPage = 1
}: Props) {
  const [mangas] = useState<Manga[]>(initialMangas);
  const [pageInfo] = useState<PageInfo>(initialPageInfo);
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc'>('popularity');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#cart') {
      setShowCart(true);
    }
  }, []);

  const getSortedMangas = () => {
    const sorted = [...mangas];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'popularity':
      default:
        return sorted.sort((a, b) => b.popularity - a.popularity);
    }
  };

  const sortedMangas = getSortedMangas();

  return (
    <div>
      {/* Filtros y Ordenamiento */}
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Filtro por género - Formulario HTML puro */}
          <form method="get" action="/tienda" id="genre-filter-form">
            {initialSearch && <input type="hidden" name="search" value={initialSearch} />}
            <label for="genre-select" class="form-label">Filtrar por Género</label>
            <select
              id="genre-select"
              name="genre"
              value={initialGenre}
              onChange={(e) => {
                const form = (e.target as HTMLSelectElement).form;
                if (form) form.submit();
              }}
              class="form-input"
            >
              <option value="">Todos los géneros</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </form>

          {/* Ordenamiento (solo cliente) */}
          <div>
            <label for="sort-select" class="form-label">Ordenar por</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy((e.target as HTMLSelectElement).value as any)}
              class="form-input"
            >
              <option value="popularity">Popularidad</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>

          {/* Botón Ver Carrito */}
          <div class="flex items-end">
            <button
              onClick={() => setShowCart(!showCart)}
              class="btn-primary w-full"
              type="button"
            >
              {showCart ? 'Ocultar Carrito' : 'Ver Carrito'}
            </button>
          </div>
        </div>

        {/* Filtros activos */}
        {(initialSearch || initialGenre) && (
          <div class="mt-4 flex flex-wrap gap-2 items-center">
            <span class="text-sm text-dark-600">Filtros activos:</span>
            {initialSearch && (
              <span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Búsqueda: "{initialSearch}"
                <a
                  href="/tienda"
                  class="hover:text-primary-900"
                  aria-label="Limpiar búsqueda"
                >
                  ✕
                </a>
              </span>
            )}
            {initialGenre && (
              <span class="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Género: {initialGenre}
                <a
                  href={initialSearch ? `/tienda?search=${encodeURIComponent(initialSearch)}` : '/tienda'}
                  class="hover:text-secondary-900"
                  aria-label="Limpiar género"
                >
                  ✕
                </a>
              </span>
            )}
            <a
              href="/tienda"
              class="text-sm text-primary-600 hover:text-primary-700 underline ml-2"
            >
              Limpiar todos los filtros
            </a>
          </div>
        )}
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Catálogo de Mangas */}
        <div class={showCart ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {/* Información de resultados */}
          <div class="mb-6">
            <p class="text-dark-600">
              Mostrando {sortedMangas.length} de {pageInfo.total} resultados
              {initialPage > 1 && ` - Página ${initialPage}`}
            </p>
          </div>

          {/* Grid de Mangas */}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMangas.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>

          {/* Paginación */}
          {pageInfo.lastPage > 1 && (
            <nav class="mt-12 flex justify-center items-center gap-2 flex-wrap" aria-label="Paginación">
              {/* Botón Anterior */}
              {pageInfo.currentPage > 1 ? (
                <a
                  href={`/tienda?${new URLSearchParams({
                    ...(initialSearch && { search: initialSearch }),
                    ...(initialGenre && { genre: initialGenre }),
                    page: (pageInfo.currentPage - 1).toString()
                  }).toString()}`}
                  class="px-4 py-2 border border-dark-300 rounded-lg hover:bg-dark-50 transition-colors"
                >
                  ← Anterior
                </a>
              ) : (
                <span class="px-4 py-2 border border-dark-300 rounded-lg opacity-50 cursor-not-allowed">
                  ← Anterior
                </span>
              )}

              {/* Números de página */}
              <div class="flex gap-2 flex-wrap">
                {Array.from({ length: Math.min(5, pageInfo.lastPage) }, (_, i) => {
                  let pageNumber;
                  if (pageInfo.lastPage <= 5) {
                    pageNumber = i + 1;
                  } else if (pageInfo.currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (pageInfo.currentPage >= pageInfo.lastPage - 2) {
                    pageNumber = pageInfo.lastPage - 4 + i;
                  } else {
                    pageNumber = pageInfo.currentPage - 2 + i;
                  }

                  const isActive = pageInfo.currentPage === pageNumber;
                  const url = `/tienda?${new URLSearchParams({
                    ...(initialSearch && { search: initialSearch }),
                    ...(initialGenre && { genre: initialGenre }),
                    ...(pageNumber > 1 && { page: pageNumber.toString() })
                  }).toString()}`;

                  return isActive ? (
                    <span
                      key={pageNumber}
                      class="px-4 py-2 rounded-lg bg-primary-500 text-white"
                      aria-current="page"
                    >
                      {pageNumber}
                    </span>
                  ) : (
                    <a
                      key={pageNumber}
                      href={url}
                      class="px-4 py-2 border border-dark-300 rounded-lg hover:bg-dark-50 transition-colors"
                    >
                      {pageNumber}
                    </a>
                  );
                })}
              </div>

              {/* Botón Siguiente */}
              {pageInfo.hasNextPage ? (
                <a
                  href={`/tienda?${new URLSearchParams({
                    ...(initialSearch && { search: initialSearch }),
                    ...(initialGenre && { genre: initialGenre }),
                    page: (pageInfo.currentPage + 1).toString()
                  }).toString()}`}
                  class="px-4 py-2 border border-dark-300 rounded-lg hover:bg-dark-50 transition-colors"
                >
                  Siguiente →
                </a>
              ) : (
                <span class="px-4 py-2 border border-dark-300 rounded-lg opacity-50 cursor-not-allowed">
                  Siguiente →
                </span>
              )}
            </nav>
          )}
        </div>

        {/* Carrito de Compras */}
        {showCart && (
          <div class="lg:col-span-1">
            <div class="sticky top-24">
              <ShoppingCart />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
