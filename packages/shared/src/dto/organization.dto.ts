import { SowLevel } from '../types/common.types';

export interface CreateOrganizationDto {
  name: string;
  slug?: string;
  totalPoints?: number;
  sowLevel?: SowLevel;
}

export interface UpdateOrganizationDto {
  name?: string;
  totalPoints?: number;
  usedPoints?: number;
  sowLevel?: SowLevel;
  isActive?: boolean;
}
