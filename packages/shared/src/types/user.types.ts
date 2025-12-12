import { CcRole, ClientRole } from './common.types';

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  organizationId: string | null;
  ccRole: CcRole | null;
  clientRole: ClientRole | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  organizationId: string | null;
  ccRole: CcRole | null;
  clientRole: ClientRole | null;
}

export interface UserWithOrganization extends User {
  organization: {
    id: string;
    name: string;
    slug: string;
  } | null;
}
