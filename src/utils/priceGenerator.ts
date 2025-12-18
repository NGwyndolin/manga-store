/**
 * Genera un precio aleatorio entre un rango mínimo y máximo
 * @param min - Precio mínimo en euros
 * @param max - Precio máximo en euros
 * @returns Precio aleatorio con 2 decimales
 */
export function generateRandomPrice(min: number = 7, max: number = 15): number {
  const price = Math.random() * (max - min) + min;
  return Math.round(price * 100) / 100; // Redondear a 2 decimales
}

/**
 * Genera un stock aleatorio entre un rango mínimo y máximo
 * @param min - Stock mínimo
 * @param max - Stock máximo
 * @returns Stock aleatorio (número entero)
 */
export function generateRandomStock(min: number = 5, max: number = 50): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formatea un precio a formato de moneda europea
 * @param price - Precio a formatear
 * @returns String con formato de moneda (ej. "12,99 €")
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

/**
 * Calcula el precio total de múltiples items
 * @param items - Array de objetos con price y quantity
 * @returns Precio total calculado
 */
export function calculateTotal(items: { price: number; quantity: number }[]): number {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return Math.round(total * 100) / 100;
}
