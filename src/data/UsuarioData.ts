import { connection as db } from "../dbConnection";
import { Usuario } from "../types/Usuario";

interface UserListFilters {
  nome?: string;
  email?: string;
  telefone?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

type UsuarioDB = Omit<Usuario, "id"> & { id: number };

class UsuarioData {
  private tableName = "usuarios";

  async findById(id: number): Promise<UsuarioDB | undefined> {
    return db(this.tableName).where({ id }).select("*").first();
  }

  async findByEmail(email: string): Promise<UsuarioDB | undefined> {
    return db(this.tableName).where({ email }).first();
  }

  async create(
    dados: Omit<Usuario, "id" | "data_cadastro"> & { senha: string }
  ): Promise<UsuarioDB> {
    const [novoUsuario] = await db(this.tableName).insert(dados).returning("*");

    return novoUsuario;
  }

  async update(
    id: number,
    dados: Partial<Omit<Usuario, "id" | "data_cadastro">>
  ): Promise<number> {
    return db(this.tableName).where({ id }).update(dados);
  }

  async remove(id: number): Promise<number> {
    return db(this.tableName).where({ id }).del();
  }

  async findAllWithFilters(filters: UserListFilters): Promise<UsuarioDB[]> {
    let query = db(this.tableName).select('id', 
    'nome', 
    'email', 
    'data_cadastro', 
    'telefone', 
    'role');
    
    if (filters.nome) {
      query = query.where("nome", "like", `%${filters.nome}%`);
    }
    if (filters.email) {
      query = query.where("email", "like", `%${filters.email}%`);
    }
    if (filters.telefone) {
      query = query.where("telefone", "like", `%${filters.telefone}%`);
    }

    const sortColumn = filters.sort_by || "id";
    const sortOrder = filters.order || "asc";
    query = query.orderBy(sortColumn, sortOrder);

    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.offset(filters.offset);
    }

    return query as Promise<UsuarioDB[]>;
  }
}
export default new UsuarioData();
