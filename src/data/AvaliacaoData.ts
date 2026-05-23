import { Avaliacao } from "../types/Avaliacao";
import { connection as dbConnection } from "../dbConnection";

export class AvaliacaoData {
  async create(avaliacao: Avaliacao): Promise<Avaliacao> {
    const [newAvaliacao] = await dbConnection("avaliacoes")
      .insert(avaliacao)
      .returning("*");
    return newAvaliacao;
  }

  async getByServicoId(servico_id: number): Promise<Avaliacao[]> {
    const avaliacoes = await dbConnection("avaliacoes")
        .select("id", "servico_id", "usuario_id", "nota", "comentario") 
        .where({ servico_id });
    return avaliacoes as Avaliacao[];
  }

  async getById(id: number): Promise<Avaliacao | undefined> {
    return dbConnection('avaliacoes').where({ id }).first(); 
  }

  async update(
    id: number,
    avaliacao: Partial<Avaliacao>
  ): Promise<Avaliacao | undefined> {
    const [updatedAvaliacao] = await dbConnection("avaliacoes")
      .where({ id })
      .update(avaliacao)
      .returning("*");
    return updatedAvaliacao;
  }

  async delete(id: number): Promise<boolean> {
    const deletedCount = await dbConnection("avaliacoes").where({ id }).del();
    return deletedCount > 0;
  }

  async getAll(): Promise<Avaliacao[]> {
    try {
      const avaliacoes = await dbConnection("avaliacoes").select(
      "id", "servico_id","usuario_id","nota","comentario" );
      return avaliacoes as Avaliacao[];
    } catch (error: any) {
      throw new Error(error.sqlMessage || error.message);
    }
  }
}
