import { atom } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Manga } from '../types/index';

export interface CartItem {
  manga: Manga;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// Función auxiliar para calcular el total
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.manga.price * item.quantity, 0);
}

// Valor inicial del carrito
const initialCart: Cart = {
  items: [],
  total: 0,
};

// Store persistente del carrito - EXPORTADO DIRECTAMENTE
export const $cart = persistentAtom<Cart>(
  'manga-cart',
  initialCart,
  {
    encode: JSON.stringify,
    decode: (str) => {
      try {
        const parsed = JSON.parse(str);
        // Asegurarse de que siempre tenga la estructura correcta
        return {
          items: Array.isArray(parsed.items) ? parsed.items : [],
          total: typeof parsed.total === 'number' ? parsed.total : 0,
        };
      } catch (e) {
        console.error('Error parsing cart from storage:', e);
        return initialCart;
      }
    },
  }
);

// Acciones del carrito
export const cartStore = {
  // Añadir item al carrito
  addItem: (manga: Manga, quantity: number = 1) => {
    const currentCart = $cart.get();
    
    // Protección adicional
    if (!currentCart || !Array.isArray(currentCart.items)) {
      console.warn('Cart not initialized properly, resetting...');
      $cart.set(initialCart);
      return cartStore.addItem(manga, quantity);
    }
    
    const existingItemIndex = currentCart.items.findIndex(
      (item) => item.manga.id === manga.id
    );

    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      newItems = currentCart.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: Math.min(item.quantity + quantity, manga.stock) }
          : item
      );
    } else {
      newItems = [...currentCart.items, { manga, quantity: Math.min(quantity, manga.stock) }];
    }

    $cart.set({
      items: newItems,
      total: calculateTotal(newItems),
    });
  },

  // Actualizar cantidad de un item
  updateQuantity: (mangaId: number, quantity: number) => {
    const currentCart = $cart.get();
    
    if (!currentCart || !Array.isArray(currentCart.items)) {
      console.warn('Cart not initialized properly');
      return;
    }
    
    const newItems = currentCart.items.map((item) =>
      item.manga.id === mangaId
        ? { ...item, quantity: Math.max(0, Math.min(quantity, item.manga.stock)) }
        : item
    ).filter(item => item.quantity > 0);

    $cart.set({
      items: newItems,
      total: calculateTotal(newItems),
    });
  },

  // Eliminar item del carrito
  removeItem: (mangaId: number) => {
    const currentCart = $cart.get();
    
    if (!currentCart || !Array.isArray(currentCart.items)) {
      console.warn('Cart not initialized properly');
      return;
    }
    
    const newItems = currentCart.items.filter((item) => item.manga.id !== mangaId);

    $cart.set({
      items: newItems,
      total: calculateTotal(newItems),
    });
  },

  // Vaciar carrito
  clearCart: () => {
    $cart.set(initialCart);
  },
};
