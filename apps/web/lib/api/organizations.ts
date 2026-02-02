import { apiClient } from './client';
import type {
  Organization,
  PaginatedResponse,
  CreateOrganizationDto,
  UpdateOrganizationDto
} from '@codecrew/shared';

export const organizationsApi = {
  list: (params?: { page?: number; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiClient<PaginatedResponse<Organization>>(
      `/organizations${query ? `?${query}` : ''}`
    );
  },

  get: (id: string) =>
    apiClient<Organization>(`/organizations/${id}`),

  create: (data: CreateOrganizationDto) =>
    apiClient<Organization>('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateOrganizationDto) =>
    apiClient<Organization>(`/organizations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiClient<void>(`/organizations/${id}`, {
      method: 'DELETE',
    }),
};
