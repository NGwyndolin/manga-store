import { useStore } from '@nanostores/preact';
import { 
  cartItems, 
  totalItems, 
  totalPrice, 
  incrementQuantity, 
  decrementQuantity, 
  removeFromCart,
  clearCart 
} from '../stores/cartStore';
import { formatPrice } from '../utils/priceGenerator';

export default function ShoppingCart() {
  const $cartItems = useStore(cartItems);
  const $totalItems = useStore(totalItems);
  const $totalPrice = useStore(totalPrice);

  const handleCheckout = () => {
    if ($cartItems.length === 0) return;
    
    alert('¡Gracias por tu compra! Esta es una demo, no se procesará ningún pago real.');
    clearCart();
  };

  if ($cartItems.length === 0) {
    return (
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="font-display text-2xl mb-6">Carrito de Compras</h2>
        <div class="text-center py-8">
          <svg class="w-20 h-20 mx-auto text-dark-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p class="text-dark-600 mb-2">Tu carrito está vacío</p>
          <p class="text-sm text-dark-500">¡Añade algunos mangas increíbles!</p>
        </div>
      </div>
    );
  }

  return (
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-display text-2xl">Carrito de Compras</h2>
        <span class="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
          {$totalItems} {$totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Items del carrito */}
      <div class="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {$cartItems.map((item) => (
          <div key={item.mangaId} class="flex gap-3 border-b border-dark-200 pb-4">
            {/* Imagen */}
            <img
              src={item.coverImage}
              alt={item.title}
              class="w-16 h-24 object-cover rounded"
            />

            {/* Info */}
            <div class="flex-1">
              <h3 class="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
              <p class="text-primary-600 font-bold mb-2">
                {formatPrice(item.price)}
              </p>

              {/* Controles de cantidad */}
              <div class="flex items-center gap-2">
                <button
                  onClick={() => decrementQuantity(item.mangaId)}
                  class="w-7 h-7 flex items-center justify-center border border-dark-300 rounded hover:bg-dark-100 transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  -
                </button>
                <span class="w-8 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => incrementQuantity(item.mangaId)}
                  disabled={item.quantity >= item.maxStock}
                  class="w-7 h-7 flex items-center justify-center border border-dark-300 rounded hover:bg-dark-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.mangaId)}
                  class="ml-auto text-red-600 hover:text-red-700 transition-colors"
                  aria-label="Eliminar del carrito"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Subtotal */}
              <p class="text-sm text-dark-600 mt-2">
                Subtotal: {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div class="border-t border-dark-200 pt-4 space-y-2">
        <div class="flex justify-between text-dark-700">
          <span>Subtotal</span>
          <span>{formatPrice($totalPrice)}</span>
        </div>
        <div class="flex justify-between text-dark-700">
          <span>Envío</span>
          <span class="text-green-600">GRATIS</span>
        </div>
        <div class="flex justify-between text-xl font-bold text-dark-900 pt-2 border-t border-dark-200">
          <span>Total</span>
          <span class="text-primary-600">{formatPrice($totalPrice)}</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div class="mt-6 space-y-2">
        <button
          onClick={handleCheckout}
          class="btn-primary w-full"
        >
          Proceder al Pago
        </button>
        <button
          onClick={() => clearCart()}
          class="btn-outline w-full"
        >
          Vaciar Carrito
        </button>
      </div>

      {/* Mensaje de envío gratis */}
      <div class="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
        <p class="text-sm text-green-700 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          ¡Envío gratis en todos los pedidos!
        </p>
      </div>
    </div>
  );
}
