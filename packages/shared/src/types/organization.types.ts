import { SowLevel } from './common.types';
import { UserPublic } from './user.types';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  totalPoints: number;
  usedPoints: number;
  sowLevel: SowLevel;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationWithUsers extends Organization {
  users: UserPublic[];
}

export interface OrganizationSummary {
  id: string;
  name: string;
  slug: string;
  sowLevel: SowLevel;
  pointsRemaining: number;
}
