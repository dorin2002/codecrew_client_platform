import { FileLinkType } from './common.types';

export interface FileLink {
  id: string;
  organizationId: string;
  name: string;
  url: string;
  linkType: FileLinkType;
  description: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}
