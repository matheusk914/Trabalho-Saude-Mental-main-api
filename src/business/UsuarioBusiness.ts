import UsuarioData from "../data/UsuarioData";
import { Usuario } from "../types/Usuario";
import { UsuarioInput } from "../types/Usuario";

class UsuarioBusiness {
  async detalhar(id: number): Promise<Usuario | undefined> {
    const usuario = await UsuarioData.findById(id);
    if (!usuario) {
      return undefined;
    }
    return usuario as Usuario;
  }
  async listar(query: any): Promise<Usuario[]> {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const filters = {
      nome: query.nome as string,
      email: query.email as string,
      telefone: query.telefone as string,
      sort_by: query.sort_by as string,
      order: query.order as "asc" | "desc",
      limit: limit,
      offset: offset,
    };
    const usuarios = await UsuarioData.findAllWithFilters(filters);

    return usuarios as Usuario[];
  }

  async cadastrar(
    dados: UsuarioInput
  ): Promise<Usuario | { error: string } | undefined> {
    const usuarioExistente = await UsuarioData.findByEmail(dados.email);
    if (usuarioExistente) {
      return { error: "E-mail já cadastrado." };
    }

    const dadosParaCriar = {
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
      telefone: dados.telefone,
      role: dados.role,
    };

    const novoUsuario = await UsuarioData.create(dadosParaCriar);

    return novoUsuario as Usuario;
  }

  async atualizar(
    id: number,
    dados: Partial<UsuarioInput>
  ): Promise<Usuario | undefined> {
    let dadosParaAtualizar: Partial<Omit<Usuario, "id" | "data_cadastro">> = {};

    if (dados.senha) {
      dadosParaAtualizar.senha = dados.senha;
    }
    if (dados.nome) dadosParaAtualizar.nome = dados.nome;
    if (dados.email) dadosParaAtualizar.email = dados.email;
    if (dados.telefone !== undefined)
      dadosParaAtualizar.telefone = dados.telefone;

    const count = await UsuarioData.update(id, dadosParaAtualizar);
    if (count === 0) {
      return undefined;
    }

    return this.detalhar(id);
  }

  async remover(id: number): Promise<boolean> {
    const count = await UsuarioData.remove(id);
    return count > 0;
  }
}
export default new UsuarioBusiness();
