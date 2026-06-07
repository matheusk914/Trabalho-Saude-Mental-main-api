import FuncionarioData from "../data/FuncionarioData";
import { Funcionario } from "../types/Funcionario";
import * as bcrypt from "bcryptjs";

const SALT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

class FuncionarioBusiness {
  async detalhar(id: number): Promise<Funcionario | undefined> {
    const funcionario = await FuncionarioData.findById(id);
    if (!funcionario) {
      return undefined;
    }
    return funcionario as Funcionario;
  }

  async listar(): Promise<Funcionario[]> {
    const funcionarios = await FuncionarioData.findAll();
    return funcionarios as Funcionario[];
  }

  async cadastrar(
    dados: Funcionario
  ): Promise<Funcionario | { error: string } | undefined> {
    if (!dados.nome || !dados.cargo || !dados.email || !dados.senha || dados.servico_id) {
      throw new Error("Nome, cargo, email, senha e o ID do local de atuação são obrigatórios.");
    }

    const funcionarioExistente = await FuncionarioData.findByEmail(dados.email);
    if (funcionarioExistente) {
      return { error: "E-mail já cadastrado." };
    }

    const senhaHash = await bcrypt.hash(dados.senha, SALT_ROUNDS);

    const dataAdmissao = dados.data_admissao
      ? new Date(dados.data_admissao)
      : undefined;

    const dadosParaCriar = {
      ...dados,
      senha: senhaHash,
      data_admissao: dataAdmissao,
    };

    const novoFuncionario = await FuncionarioData.create(dadosParaCriar);
    return novoFuncionario as Funcionario;
  }

  async atualizar(
    id: number,
    dados: Partial<Funcionario>
  ): Promise<Funcionario | undefined> {
    if (dados.senha) {
      dados.senha = await bcrypt.hash(dados.senha, SALT_ROUNDS);
    }
    const count = await FuncionarioData.update(id, dados);
    if (count === 0) {
      return undefined;
    }
    return this.detalhar(id);
  }

  async remover(id: number): Promise<boolean> {
    const count = await FuncionarioData.remove(id);
    return count > 0;
  }
}
export default new FuncionarioBusiness();
