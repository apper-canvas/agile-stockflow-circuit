import HomePage from '@/components/pages/HomePage';
import DashboardPage from '@/components/pages/DashboardPage';
import ProductsPage from '@/components/pages/ProductsPage';
import StockMovementsPage from '@/components/pages/StockMovementsPage';
import SuppliersPage from '@/components/pages/SuppliersPage';
import AlertsPage from '@/components/pages/AlertsPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: HomePage
  },
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: DashboardPage
  },
  products: {
    id: 'products',
    label: 'Products',
    path: '/products',
    icon: 'Package',
    component: ProductsPage
  },
  stockMovements: {
    id: 'stockMovements',
    label: 'Stock Movements',
    path: '/stock-movements',
    icon: 'ArrowUpDown',
    component: StockMovementsPage
  },
  suppliers: {
    id: 'suppliers',
    label: 'Suppliers',
    path: '/suppliers',
    icon: 'Truck',
    component: SuppliersPage
  },
  alerts: {
    id: 'alerts',
    label: 'Alerts',
    path: '/alerts',
icon: 'AlertTriangle',
    component: AlertsPage
  }
};

export const routeArray = Object.values(routes);