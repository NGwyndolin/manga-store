import type { DashboardData, TopSellingGenre, RecentOrder } from '../types/index';

/**
 * Genera datos simulados para el dashboard
 */
export function generateDashboardData(): DashboardData {
  const topGenres: TopSellingGenre[] = [
    { genre: 'Shonen', sales: 1250, percentage: 32 },
    { genre: 'Seinen', sales: 980, percentage: 25 },
    { genre: 'Fantasy', sales: 720, percentage: 18 },
    { genre: 'Romance', sales: 560, percentage: 14 },
    { genre: 'Horror', sales: 430, percentage: 11 },
  ];

  const recentOrders: RecentOrder[] = [
    {
      id: 'ORD-2025-1234',
      manga: 'One Piece Vol. 108',
      amount: 12.99,
      timestamp: new Date(Date.now() - 5 * 60000),
      status: 'completed',
    },
    {
      id: 'ORD-2025-1235',
      manga: 'Chainsaw Man Vol. 15',
      amount: 11.50,
      timestamp: new Date(Date.now() - 15 * 60000),
      status: 'shipped',
    },
    {
      id: 'ORD-2025-1236',
      manga: 'Berserk Deluxe Edition Vol. 9',
      amount: 14.99,
      timestamp: new Date(Date.now() - 25 * 60000),
      status: 'pending',
    },
    {
      id: 'ORD-2025-1237',
      manga: 'Jujutsu Kaisen Vol. 24',
      amount: 9.99,
      timestamp: new Date(Date.now() - 35 * 60000),
      status: 'completed',
    },
    {
      id: 'ORD-2025-1238',
      manga: 'Tokyo Ghoul:re Vol. 16',
      amount: 10.50,
      timestamp: new Date(Date.now() - 45 * 60000),
      status: 'shipped',
    },
  ];

  return {
    metrics: {
      mangasSoldToday: 347,
      totalRevenue: 4523.80,
      activeUsers: 1829,
      conversionRate: 3.2,
    },
    topGenres,
    recentOrders,
  };
}

/**
 * Actualiza las métricas simulando ventas en tiempo real
 */
export function updateMetricsRealtime(currentMetrics: DashboardData['metrics']): DashboardData['metrics'] {
  return {
    mangasSoldToday: currentMetrics.mangasSoldToday + Math.floor(Math.random() * 3),
    totalRevenue: Number((currentMetrics.totalRevenue + (Math.random() * 30)).toFixed(2)),
    activeUsers: currentMetrics.activeUsers + Math.floor(Math.random() * 10) - 5,
    conversionRate: Number((currentMetrics.conversionRate + (Math.random() * 0.2 - 0.1)).toFixed(1)),
  };
}
