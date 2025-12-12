export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export type SowLevel = 'BRONZE' | 'SILVER' | 'GOLD';
export type CcRole = 'ADMIN' | 'COORDINATOR';
export type ClientRole = 'ADMIN' | 'USER';
export type FileLinkType = 'GOOGLE_DRIVE' | 'FIGMA' | 'OTHER';
