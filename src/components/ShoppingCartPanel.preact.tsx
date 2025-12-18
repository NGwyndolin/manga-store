import { useStore } from '@nanostores/preact';
import { $cart, cartStore } from '../stores/cartStore';
import type { CartItem } from '../types/index';


export default function ShoppingCartPanel() {
  const cart = useStore($cart);


  const closeCart = () => {
    const cartPanel = document.getElementById('shopping-cart-panel');
    if (cartPanel) {
      cartPanel.classList.add('hidden');
    }
  };


  const updateQuantity = (id: number, newQuantity: number) => {
    cartStore.updateQuantity(id, newQuantity);
  };


  const removeItem = (id: number) => {
    cartStore.removeItem(id);
  };


  const clearCart = () => {
    cartStore.clearCart();
  };


  // Protección contra undefined durante hidratación
  const totalItems = cart?.items ? cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) : 0;
  const items = cart?.items || [];
  const total = cart?.total || 0;


  return (
    <div
      id="shopping-cart-panel"
      class="hidden fixed inset-0 z-50"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'shopping-cart-panel') {
          closeCart();
        }
      }}
    >
      {/* Overlay oscuro */}
      <div class="absolute inset-0 bg-black bg-opacity-60" />
      
      {/* Panel del carrito */}
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div class="flex items-center justify-between p-6 border-b border-dark-200">
          <h2 class="font-display text-2xl text-dark-900 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Carrito ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            class="text-dark-500 hover:text-dark-700 transition-colors"
            aria-label="Cerrar carrito"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>


        {/* Contenido */}
        {items.length === 0 ? (
          <div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <svg class="w-24 h-24 text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 class="font-display text-xl text-dark-700 mb-2">Tu carrito está vacío</h3>
            <p class="text-dark-600 mb-4">Añade algunos mangas increíbles</p>
            <button
              onClick={closeCart}
              class="btn-primary"
            >
              Continuar Comprando
            </button>
          </div>
        ) : (
          <>
            {/* Lista de items */}
            <div class="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item: CartItem) => (
                <div key={item.mangaId} class="flex gap-4 bg-dark-50 rounded-lg p-4">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    class="w-20 h-28 object-cover rounded"
                  />
                  <div class="flex-1 min-w-0">
                    <h4 class="font-semibold text-dark-900 line-clamp-2 mb-2">
                      {item.title}
                    </h4>
                    <p class="text-primary-600 font-bold mb-3">
                      €{item.price.toFixed(2)}
                    </p>
                    <div class="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.mangaId, item.quantity - 1)}
                        class="w-8 h-8 flex items-center justify-center border border-dark-300 rounded hover:bg-dark-100 transition-colors"
                        aria-label="Disminuir cantidad"
                      >
                        −
                      </button>
                      <span class="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.mangaId, item.quantity + 1)}
                        class="w-8 h-8 flex items-center justify-center border border-dark-300 rounded hover:bg-dark-100 transition-colors"
                        disabled={item.quantity >= item.maxStock}
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.mangaId)}
                        class="ml-auto text-red-600 hover:text-red-700 transition-colors"
                        aria-label="Eliminar del carrito"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>


            {/* Footer con total */}
            <div class="border-t border-dark-200 p-6 bg-dark-50 space-y-4">
              <div class="flex justify-between items-center text-lg">
                <span class="font-semibold text-dark-700">Subtotal:</span>
                <span class="font-bold text-dark-900">€{total.toFixed(2)}</span>
              </div>
              
              <button class="btn-primary w-full">
                Proceder al Pago
              </button>
              
              <button
                onClick={clearCart}
                class="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Vaciar Carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
