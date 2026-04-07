export interface SigninDto {
  username: string;
  password: string;
  rememberMe?: boolean | null;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user?: any; // Replace with User model when integrated
}
