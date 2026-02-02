'use client';

import { useState, useEffect, useCallback } from 'react';
import { statsApi, DashboardStats, RecentOrganization } from '../api/stats';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statsApi.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch stats'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export function useRecentOrganizations(limit: number = 5) {
  const [organizations, setOrganizations] = useState<RecentOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOrganizations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await statsApi.getRecentOrganizations(limit);
      setOrganizations(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch recent organizations'));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return { organizations, loading, error, refetch: fetchOrganizations };
}
