'use client';

import { useState, useEffect, useCallback } from 'react';
import { organizationsApi } from '@/lib/api/organizations';
import type { Organization, PaginatedResponse } from '@codecrew/shared';

interface UseOrganizationsReturn {
  organizations: Organization[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
}

export function useOrganizations(initialPage = 1, limit = 10): UseOrganizationsReturn {
  const [data, setData] = useState<PaginatedResponse<Organization> | null>(null);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await organizationsApi.list({ page, limit });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  return {
    organizations: data?.data ?? [],
    pagination: {
      page: data?.meta.page ?? page,
      limit: data?.meta.limit ?? limit,
      total: data?.meta.total ?? 0,
      totalPages: data?.meta.totalPages ?? 0,
    },
    isLoading,
    error,
    refetch: fetchOrganizations,
    setPage,
  };
}
