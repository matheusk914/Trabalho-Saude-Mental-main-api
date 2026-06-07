export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  data_cadastro: Date;
  telefone: string;
  role: "user" | "admin";
}

export interface UsuarioInput {
  nome: string;
  email: string;
  senha: string;
  telefone: string;
  role: "user" | "admin";
}
