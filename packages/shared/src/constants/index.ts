export const SOW_LEVELS = ['BRONZE', 'SILVER', 'GOLD'] as const;

export const POINTS_BY_SOW: Record<string, number> = {
  BRONZE: 50,
  SILVER: 100,
  GOLD: 200,
};

export const CC_ROLES = ['ADMIN', 'COORDINATOR'] as const;
export const CLIENT_ROLES = ['ADMIN', 'USER'] as const;
export const FILE_LINK_TYPES = ['GOOGLE_DRIVE', 'FIGMA', 'OTHER'] as const;
