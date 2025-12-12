export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    ccRole: string | null;
    clientRole: string | null;
    organizationId: string | null;
  };
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}
