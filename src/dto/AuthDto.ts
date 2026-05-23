export interface SignupInput {
  nome: string;
  email: string;
  password: string;
  telefone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "user" | "admin";
  };
}
