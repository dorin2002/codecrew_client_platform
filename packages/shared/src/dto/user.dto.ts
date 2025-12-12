import { CcRole, ClientRole } from '../types/common.types';

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  organizationId?: string;
  ccRole?: CcRole;
  clientRole?: ClientRole;
}

export interface UpdateUserDto {
  name?: string;
  isActive?: boolean;
  ccRole?: CcRole;
  clientRole?: ClientRole;
}
