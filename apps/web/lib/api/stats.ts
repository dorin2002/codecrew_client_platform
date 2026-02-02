import { apiClient } from './client';

export interface DashboardStats {
  totalOrganizations: number;
  totalUsers: number;
  openRequests: number;
  totalPoints: number;
  usedPoints: number;
}

export interface RecentOrganization {
  id: string;
  name: string;
  slug: string;
  sowLevel: string;
  createdAt: string;
}

export const statsApi = {
  getDashboardStats: () => apiClient<DashboardStats>('/stats/dashboard'),

  getRecentOrganizations: (limit: number = 5) =>
    apiClient<RecentOrganization[]>(`/stats/recent-organizations?limit=${limit}`),
};
