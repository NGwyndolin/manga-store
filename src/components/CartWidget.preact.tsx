import { useStore } from '@nanostores/preact';
import { $cart } from '../stores/cartStore';
import type { CartItem } from '../stores/cartStore';

export default function CartWidget() {
  const cart = useStore($cart);
  
  // Protección contra undefined durante hidratación
  const itemCount = cart?.items ? cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) : 0;

  const toggleCart = () => {
    const cartPanel = document.getElementById('shopping-cart-panel');
    if (cartPanel) {
      cartPanel.classList.toggle('hidden');
    }
  };

  return (
    <button
      onClick={toggleCart}
      class="relative p-2 text-dark-700 hover:text-primary-500 transition-colors"
      aria-label="Carrito de compras"
      type="button"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      {itemCount > 0 && (
        <span class="absolute -top-1 -right-1 bg-primary-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
