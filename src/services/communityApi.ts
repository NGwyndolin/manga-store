import type { RandomUserResponse, CommunityMember } from '../types/index';

const RANDOM_USER_API_URL = 'https://randomuser.me/api/';

/**
 * Lista de testimonios predefinidos para la comunidad
 */
const testimonials = [
  'Esta tienda tiene la mejor colección de mangas en Akihabara. ¡Siempre encuentro las últimas novedades!',
  'El personal es súper amable y me ayudaron a encontrar exactamente lo que buscaba.',
  'Precios competitivos y excelente calidad. Mi tienda favorita de mangas sin duda.',
  'La ubicación es perfecta, justo en el corazón de Akihabara. ¡No puedo pedir más!',
  'Gran variedad de géneros. Desde shonen hasta josei, tienen de todo.',
  'Compro aquí desde hace años y nunca me han decepcionado. ¡Altamente recomendado!',
  'Las recomendaciones del staff son siempre acertadas. Descubrí muchas joyas gracias a ellos.',
  'Envíos rápidos y productos bien empaquetados. Servicio impecable.',
];

/**
 * Géneros de manga aleatorios para asignar a miembros
 */
const favoriteGenres = [
  'Shonen',
  'Seinen',
  'Shojo',
  'Josei',
  'Isekai',
  'Romance',
  'Fantasy',
  'Horror',
  'Slice of Life',
  'Psychological',
];

/**
 * Obtiene miembros de la comunidad desde Random User API
 */
export async function getCommunityMembers(count: number = 8): Promise<CommunityMember[]> {
  try {
    const response = await fetch(`${RANDOM_USER_API_URL}?results=${count}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch community members');
    }

    const data: RandomUserResponse = await response.json();

    return data.results.map((user, index) => ({
      id: `member-${index + 1}`,
      name: `${user.name.first} ${user.name.last}`,
      avatar: user.picture.large,
      testimonial: testimonials[Math.floor(Math.random() * testimonials.length)],
      rating: Math.floor(Math.random() * 2) + 4, // Rating entre 4 y 5
      joinDate: user.registered.date,
      favoriteGenre: favoriteGenres[Math.floor(Math.random() * favoriteGenres.length)],
    }));
  } catch (error) {
    console.error('Error fetching community members:', error);
    
    // Devolver datos de respaldo en caso de error
    return generateFallbackMembers(count);
  }
}

/**
 * Genera miembros de respaldo si la API falla
 */
function generateFallbackMembers(count: number): CommunityMember[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `fallback-member-${i + 1}`,
    name: `Usuario ${i + 1}`,
    avatar: `https://i.pravatar.cc/300?img=${i + 1}`,
    testimonial: testimonials[i % testimonials.length],
    rating: Math.floor(Math.random() * 2) + 4,
    joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
    favoriteGenre: favoriteGenres[i % favoriteGenres.length],
  }));
}
