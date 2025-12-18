import { useState } from 'preact/hooks';
import { useStore } from '@nanostores/preact';
import { $cart, cartStore } from '../stores/cartStore';
import type { Manga } from '../types/index';

interface Props {
  manga: Manga;
}

export default function MangaCard({ manga }: Props) {
  const cart = useStore($cart);
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  const currentCartItem = cart?.items ? cart.items.find(item => item.manga.id === manga.id) : null;
  const currentCartQuantity = currentCartItem ? currentCartItem.quantity : 0;
  const availableStock = manga.stock - currentCartQuantity;
  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    const quantityToAdd = Math.min(quantity, availableStock);
    cartStore.addItem(manga, quantityToAdd);
    
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    const clampedQuantity = Math.max(1, Math.min(newQuantity, availableStock));
    setQuantity(clampedQuantity);
  };

  return (
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col group">
      <div class="relative aspect-[3/4] overflow-hidden bg-dark-100">
        <img
          src={manga.coverImage.large}
          alt={manga.title.romaji}
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isOutOfStock && (
          <div class="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span class="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
              Agotado
            </span>
          </div>
        )}
        {manga.averageScore && (
          <div class="absolute top-2 right-2 bg-yellow-400 text-dark-900 px-2 py-1 rounded-full text-sm font-bold flex items-center gap-1">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {(manga.averageScore / 10).toFixed(1)}
          </div>
        )}
      </div>

      <div class="p-4 flex flex-col flex-grow">
        <h3 class="font-semibold text-lg text-dark-900 mb-2 line-clamp-2 min-h-[3.5rem]">
          {manga.title.romaji}
        </h3>

        {manga.genres && manga.genres.length > 0 && (
          <div class="flex flex-wrap gap-1 mb-3">
            {manga.genres.slice(0, 2).map((genre) => (
              <span key={genre} class="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                {genre}
              </span>
            ))}
            {manga.genres.length > 2 && (
              <span class="text-xs bg-dark-100 text-dark-600 px-2 py-1 rounded">
                +{manga.genres.length - 2}
              </span>
            )}
          </div>
        )}

        <div class="text-sm text-dark-600 mb-3 space-y-1">
          {manga.volumes && <p>Volúmenes: {manga.volumes}</p>}
          <p class={`font-medium ${isOutOfStock ? 'text-red-600' : availableStock < 5 ? 'text-orange-600' : 'text-green-600'}`}>
            {isOutOfStock ? 'Sin stock' : `Stock: ${availableStock}`}
          </p>
        </div>

        <div class="mt-auto pt-3 border-t border-dark-200">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl font-bold text-primary-600">
              €{manga.price.toFixed(2)}
            </span>
          </div>

          {!isOutOfStock && (
            <div class="flex items-center gap-2 mb-3">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                class="w-8 h-8 flex items-center justify-center border border-dark-300 rounded hover:bg-dark-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Disminuir cantidad"
                type="button"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={availableStock}
                value={quantity}
                onInput={(e) => handleQuantityChange(parseInt((e.target as HTMLInputElement).value) || 1)}
                class="w-16 text-center border border-dark-300 rounded py-1"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= availableStock}
                class="w-8 h-8 flex items-center justify-center border border-dark-300 rounded hover:bg-dark-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Aumentar cantidad"
                type="button"
              >
                +
              </button>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}
          </button>
        </div>

        {showNotification && (
          <div class="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm text-center animate-fade-in">
            ✓ Añadido al carrito
          </div>
        )}
      </div>
    </div>
  );
}
