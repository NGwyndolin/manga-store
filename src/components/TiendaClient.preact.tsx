import { useState, useEffect, useRef } from 'preact/hooks';
import type { Manga, PageInfo } from '../types/index';
import MangaCard from './MangaCard.preact';
import { getMangaCatalog } from '../services/anilistApi';

interface Props {
  genres: string[];
}

export default function TiendaClient({ genres }: Props) {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    total: 0,
    currentPage: 1,
    lastPage: 1,
    hasNextPage: false,
    perPage: 12,
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc'>('popularity');
  
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [page, setPage] = useState(1);

  const filtersRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search') || '';
    const genreParam = params.get('genre') || '';
    const pageParam = parseInt(params.get('page') || '1');
    
    setSearch(searchParam);
    setGenre(genreParam);
    setPage(pageParam);
    
    loadCatalog(searchParam, genreParam, pageParam);
    
    const subtitle = document.getElementById('catalog-subtitle');
    if (subtitle) {
      if (searchParam) {
        subtitle.textContent = `Resultados para: "${searchParam}"`;
      } else if (genreParam) {
        subtitle.textContent = `Género: ${genreParam}`;
      } else {
        subtitle.textContent = 'Explora nuestra colección de mangas';
      }
    }
  }, []);

  // Hook para animaciones GSAP
  useEffect(() => {
    if (loading || mangas.length === 0) return;

    const loadGsap = async () => {
      const { gsap } = await import('gsap');
      
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        // Animar panel de filtros usando ref
        if (filtersRef.current) {
          gsap.from(filtersRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
          });
        }

        // Animar información de resultados
        const resultsInfo = document.getElementById('results-info');
        if (resultsInfo) {
          gsap.from(resultsInfo, {
            x: -20,
            opacity: 0,
            duration: 0.5,
            delay: 0.2
          });
        }

        // Animar grid de mangas usando ref
        if (gridRef.current) {
          const cards = gridRef.current.children;
          gsap.from(cards, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: {
              amount: 0.8,
              grid: [2, 4],
              from: 'start'
            },
            ease: 'power2.out',
            delay: 0.3
          });
        }

        // Animar paginación usando ref
        if (paginationRef.current) {
          gsap.from(paginationRef.current, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: 0.8
          });
        }
      }, 50);
    };

    loadGsap();
  }, [loading, mangas.length]);

  const loadCatalog = async (searchParam: string, genreParam: string, pageParam: number) => {
    setLoading(true);
    try {
      const result = await getMangaCatalog(
        pageParam,
        12,
        searchParam || undefined,
        genreParam || undefined
      );
      setMangas(result.mangas);
      setPageInfo(result.pageInfo);
      console.log(`✓ Loaded ${result.mangas.length} mangas`);
    } catch (error) {
      console.error('Error loading catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (newGenre: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (newGenre) params.set('genre', newGenre);
    window.location.href = `/tienda${params.toString() ? '?' + params.toString() : ''}`;
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (genre) params.set('genre', genre);
    if (newPage > 1) params.set('page', newPage.toString());
    window.location.href = `/tienda${params.toString() ? '?' + params.toString() : ''}`;
  };

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

  if (loading) {
    return (
      <div class="text-center py-20">
        <div class="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p class="text-dark-600">Cargando catálogo...</p>
      </div>
    );
  }

  if (mangas.length === 0) {
    return (
      <div class="text-center py-20">
        <svg class="w-24 h-24 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="font-display text-2xl text-dark-700 mb-2">
          No se encontraron resultados
        </h3>
        <p class="text-dark-600 mb-6">
          {search || genre ? 'Intenta ajustar tus filtros o búsqueda' : 'No se pudieron cargar los mangas.'}
        </p>
        <a href="/tienda" class="btn-primary">
          Ver Todo el Catálogo
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Filtros y Ordenamiento */}
      <div ref={filtersRef} class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filtro por género */}
          <div>
            <label for="genre-select" class="form-label">Filtrar por Género</label>
            <select
              id="genre-select"
              value={genre}
              onChange={(e) => handleGenreChange((e.target as HTMLSelectElement).value)}
              class="form-input"
            >
              <option value="">Todos los géneros</option>
              {genres.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Ordenamiento */}
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
        </div>

        {/* Filtros activos */}
        {(search || genre) && (
          <div class="mt-4 flex flex-wrap gap-2 items-center">
            <span class="text-sm text-dark-600">Filtros activos:</span>
            {search && (
              <span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Búsqueda: "{search}"
                <a href="/tienda" class="hover:text-primary-900">✕</a>
              </span>
            )}
            {genre && (
              <span class="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Género: {genre}
                <a
                  href={search ? `/tienda?search=${encodeURIComponent(search)}` : '/tienda'}
                  class="hover:text-secondary-900"
                >
                  ✕
                </a>
              </span>
            )}
            <a href="/tienda" class="text-sm text-primary-600 hover:text-primary-700 underline ml-2">
              Limpiar todos los filtros
            </a>
          </div>
        )}
      </div>

      {/* Información de resultados */}
      <div class="mb-6" id="results-info">
        <p class="text-dark-600">
          Mostrando {sortedMangas.length} de {pageInfo.total} resultados
          {page > 1 && ` - Página ${page}`}
        </p>
      </div>

      {/* Grid de Mangas */}
      <div ref={gridRef} class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {sortedMangas.map((manga) => (
          <MangaCard key={manga.id} manga={manga} />
        ))}
      </div>

      {/* Paginación */}
      {pageInfo.lastPage > 1 && (
        <nav ref={paginationRef} class="flex justify-center items-center gap-2 flex-wrap">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            class="px-4 py-2 border border-dark-300 rounded-lg hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Anterior
          </button>

          {Array.from({ length: Math.min(5, pageInfo.lastPage) }, (_, i) => {
            let pageNum = i + 1;
            if (pageInfo.lastPage > 5) {
              if (page <= 3) pageNum = i + 1;
              else if (page >= pageInfo.lastPage - 2) pageNum = pageInfo.lastPage - 4 + i;
              else pageNum = page - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                class={`px-4 py-2 rounded-lg transition-colors ${
                  page === pageNum
                    ? 'bg-primary-500 text-white'
                    : 'border border-dark-300 hover:bg-dark-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={!pageInfo.hasNextPage}
            class="px-4 py-2 border border-dark-300 rounded-lg hover:bg-dark-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Siguiente →
          </button>
        </nav>
      )}
    </div>
  );
}
