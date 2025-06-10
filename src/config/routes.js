import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import StockMovements from '../pages/StockMovements';
import Suppliers from '../pages/Suppliers';
import Alerts from '../pages/Alerts';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  products: {
    id: 'products',
    label: 'Products',
    path: '/products',
    icon: 'Package',
    component: Products
  },
  stockMovements: {
    id: 'stockMovements',
    label: 'Stock Movements',
    path: '/stock-movements',
    icon: 'ArrowUpDown',
    component: StockMovements
  },
  suppliers: {
    id: 'suppliers',
    label: 'Suppliers',
    path: '/suppliers',
    icon: 'Truck',
    component: Suppliers
  },
  alerts: {
    id: 'alerts',
    label: 'Alerts',
    path: '/alerts',
    icon: 'AlertTriangle',
    component: Alerts
  }
};

export const routeArray = Object.values(routes);