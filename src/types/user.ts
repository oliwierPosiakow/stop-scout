export interface User {
  username: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loginError: string | null;
  registerError: string | null;
}
