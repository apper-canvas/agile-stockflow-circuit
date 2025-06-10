import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '@/components/organisms/PageHeader';
import AlertsFilterTabs from '@/components/organisms/AlertsFilterTabs';
import AlertsList from '@/components/organisms/AlertsList';
import EmptyState from '@/components/organisms/EmptyState';
import ErrorState from '@/components/organisms/ErrorState';
import { alertService, productService } from '@/services'; // Ensure paths are correct

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [alertsResult, productsResult] = await Promise.all([
        alertService.getAll(),
        productService.getAll()
      ]);

      setAlerts(alertsResult);
      setProducts(productsResult);
    } catch (err) {
      setError(err.message || 'Failed to load alerts');
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    try {
      const alertToUpdate = alerts.find(a => a.id === alertId);
      if (!alertToUpdate) return;

      await alertService.update(alertId, {
        ...alertToUpdate,
        acknowledgedAt: new Date().toISOString()
      });

      toast.success('Alert acknowledged');
      await loadData();
    } catch (err) {
      toast.error('Failed to acknowledge alert');
      console.error('Acknowledge alert error:', err);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return alert.triggered && !alert.acknowledgedAt;
    if (filter === 'acknowledged') return alert.acknowledgedAt;
    return true;
  });

  const activeAlertsCount = alerts.filter(a => a.triggered && !a.acknowledgedAt).length;
  const acknowledgedAlertsCount = alerts.filter(a => a.acknowledgedAt).length;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-surface-200 rounded w-full mb-6"></div>
        </div>
        <AlertsList isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to Load Alerts"
        message={error}
        onRetry={loadData}
      />
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <PageHeader
        title="Alerts"
        description="Monitor stock level warnings"
        onRefresh={loadData}
      />

      <AlertsFilterTabs
        filter={filter}
        onFilterChange={setFilter}
        totalAlerts={alerts.length}
        activeAlertsCount={activeAlertsCount}
        acknowledgedAlertsCount={acknowledgedAlertsCount}
      />

      {filteredAlerts.length === 0 ? (
        <EmptyState
          iconName="Bell"
          title={filter === 'active' ? 'No Active Alerts' : 'No Alerts Found'}
          message={filter === 'active'
            ? 'All stock levels are within normal ranges'
            : 'No alerts match the current filter'
          }
        />
      ) : (
        <AlertsList
          alerts={filteredAlerts}
          products={products}
          acknowledgeAlert={acknowledgeAlert}
        />
      )}
    </div>
  );
}

export default AlertsPage;