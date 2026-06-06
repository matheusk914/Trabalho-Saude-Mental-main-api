import { Avaliacao } from "../types/Avaliacao";
import { AvaliacaoData } from "../data/AvaliacaoData";

export class AvaliacaoBusiness {
  private avaliacaoData: AvaliacaoData;

  constructor() {
    this.avaliacaoData = new AvaliacaoData();
  }

  public async getAllAvaliacoes(): Promise<Avaliacao[]> {
    try {
      const avaliacoes = await this.avaliacaoData.getAll();
      return avaliacoes;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async createAvaliacao(avaliacao: Avaliacao): Promise<Avaliacao> {
    if (!avaliacao.servico_id || !avaliacao.usuario_id || !avaliacao.nota) {
      throw new Error("servico_id, usuario_id e nota são obrigatórios.");
    }
    if (avaliacao.nota < 1 || avaliacao.nota > 5) {
      throw new Error("A nota deve ser entre 1 e 5.");
    }
    return this.avaliacaoData.create({ ...avaliacao, data: new Date() });
  }

  async getAvaliacoesByServicoId(servico_id: number): Promise<Avaliacao[]> {
    if (!servico_id) {
      throw new Error("servico_id é obrigatório.");
    }
    return this.avaliacaoData.getByServicoId(servico_id);
  }

  async updateAvaliacao(
    id: number,
    avaliacao: Partial<Avaliacao>
  ): Promise<Avaliacao | undefined> {
    if (!id) {
      throw new Error("ID da avaliação é obrigatório.");
    }
    if (
      avaliacao.nota !== undefined &&
      (avaliacao.nota < 1 || avaliacao.nota > 5)
    ) {
      throw new Error("A nota deve ser entre 1 e 5.");
    }
    return this.avaliacaoData.update(id, avaliacao);
  }

  async deleteAvaliacao(id: number): Promise<boolean> {
    if (!id) {
      throw new Error("ID da avaliação é obrigatório.");
    }
    return this.avaliacaoData.delete(id);
  }
}
