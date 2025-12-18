import { persistentAtom } from '@nanostores/persistent';
import { computed } from 'nanostores';
import type { Manga, CartItem } from '../types/index';

export interface Cart {
  items: CartItem[];
  total: number;
}

// Función auxiliar para calcular el total
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
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

// EXPORTACIONES DERIVADAS para el componente ShoppingCart
export const cartItems = computed($cart, (cart) => cart.items);
export const totalItems = computed($cart, (cart) => 
  cart.items.reduce((sum, item) => sum + item.quantity, 0)
);
export const totalPrice = computed($cart, (cart) => cart.total);

// Re-exportar el tipo CartItem para uso en otros archivos
export type { CartItem };

// FUNCIONES EXPORTADAS directamente
export const incrementQuantity = (mangaId: number): void => {
  const currentCart = $cart.get();
  
  if (!currentCart || !Array.isArray(currentCart.items)) {
    console.warn('Cart not initialized properly');
    return;
  }
  
  const newItems = currentCart.items.map((item) =>
    item.mangaId === mangaId
      ? { ...item, quantity: Math.min(item.quantity + 1, item.maxStock) }
      : item
  );

  $cart.set({
    items: newItems,
    total: calculateTotal(newItems),
  });
};

export const decrementQuantity = (mangaId: number): void => {
  const currentCart = $cart.get();
  
  if (!currentCart || !Array.isArray(currentCart.items)) {
    console.warn('Cart not initialized properly');
    return;
  }
  
  const newItems = currentCart.items.map((item) =>
    item.mangaId === mangaId && item.quantity > 1
      ? { ...item, quantity: item.quantity - 1 }
      : item
  );

  $cart.set({
    items: newItems,
    total: calculateTotal(newItems),
  });
};

export const removeFromCart = (mangaId: number): void => {
  const currentCart = $cart.get();
  
  if (!currentCart || !Array.isArray(currentCart.items)) {
    console.warn('Cart not initialized properly');
    return;
  }
  
  const newItems = currentCart.items.filter((item) => item.mangaId !== mangaId);

  $cart.set({
    items: newItems,
    total: calculateTotal(newItems),
  });
};

export const clearCart = (): void => {
  $cart.set(initialCart);
};

// Acciones del carrito (mantener compatibilidad con código existente)
export const cartStore = {
  // Añadir item al carrito
  addItem: (manga: Manga, quantity: number = 1): void => {
    const currentCart = $cart.get();
    
    // Protección adicional
    if (!currentCart || !Array.isArray(currentCart.items)) {
      console.warn('Cart not initialized properly, resetting...');
      $cart.set(initialCart);
      return cartStore.addItem(manga, quantity);
    }
    
    const existingItemIndex = currentCart.items.findIndex(
      (item) => item.mangaId === manga.id
    );

    let newItems: CartItem[];

    if (existingItemIndex >= 0) {
      newItems = currentCart.items.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxStock) }
          : item
      );
    } else {
      // Crear nuevo CartItem con la estructura correcta
      const newCartItem: CartItem = {
        mangaId: manga.id,
        title: manga.title.romaji,
        price: manga.price,
        quantity: Math.min(quantity, manga.stock),
        coverImage: manga.coverImage.large,
        maxStock: manga.stock
      };
      newItems = [...currentCart.items, newCartItem];
    }

    $cart.set({
      items: newItems,
      total: calculateTotal(newItems),
    });
  },

  // Actualizar cantidad de un item
  updateQuantity: (mangaId: number, quantity: number): void => {
    const currentCart = $cart.get();
    
    if (!currentCart || !Array.isArray(currentCart.items)) {
      console.warn('Cart not initialized properly');
      return;
    }
    
    const newItems = currentCart.items.map((item) =>
      item.mangaId === mangaId
        ? { ...item, quantity: Math.max(0, Math.min(quantity, item.maxStock)) }
        : item
    ).filter(item => item.quantity > 0);

    $cart.set({
      items: newItems,
      total: calculateTotal(newItems),
    });
  },

  // Eliminar item del carrito
  removeItem: (mangaId: number): void => {
    removeFromCart(mangaId);
  },

  // Vaciar carrito
  clearCart: (): void => {
    clearCart();
  },
};
