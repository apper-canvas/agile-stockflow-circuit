import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './components/ApperIcon';
import { routeArray } from './config/routes';

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const currentRoute = routeArray.find(route => route.path === location.pathname);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex-shrink-0 h-16 bg-white border-b border-surface-200 px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-surface-100 rounded-lg transition-colors"
          >
            <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
          </button>
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="text-white" size={20} />
            </div>
            <h1 className="font-heading font-bold text-xl text-gray-900">StockFlow Pro</h1>
          </div>
        </div>

        {/* Page title for mobile */}
        <div className="md:hidden">
          <h2 className="font-medium text-gray-900">{currentRoute?.label}</h2>
        </div>

        {/* User info */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="text-white" size={16} />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 bg-surface-50 border-r border-surface-200 flex-col z-40">
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {routeArray.map((route) => (
              <NavLink
                key={route.id}
                to={route.path}
                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white shadow-sm border-l-4 border-accent' 
                    : 'text-secondary hover:bg-white hover:text-gray-900 hover:-translate-y-0.5 hover:shadow-sm'
                  }
                `}
              >
                <ApperIcon name={route.icon} size={20} />
                <span className="font-medium">{route.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden fixed inset-0 bg-black/50 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="md:hidden fixed left-0 top-16 bottom-0 w-64 bg-surface-50 border-r border-surface-200 z-50"
              >
                <nav className="p-4 space-y-2">
                  {routeArray.map((route) => (
                    <NavLink
                      key={route.id}
                      to={route.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => `
                        flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-white shadow-sm border-l-4 border-accent' 
                          : 'text-secondary hover:bg-white hover:text-gray-900'
                        }
                      `}
                    >
                      <ApperIcon name={route.icon} size={20} />
                      <span className="font-medium">{route.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Layout;