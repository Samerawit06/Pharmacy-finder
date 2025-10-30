export interface User {
  id: number;
  userName: string;
  email: string;
  role: string;
  passwordHash: string;
  pharmacies?: any[];
}

export interface UserRegister {
  userName: string;
  email: string;
  password: string;
  role: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  username: string;
  message?: string;
}
