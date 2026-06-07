import { Request, Response } from "express";
import { AvaliacaoBusiness } from "../business/AvaliacaoBusiness";
import { Avaliacao } from "../types/Avaliacao";

export class AvaliacaoController {
  private avaliacaoBusiness: AvaliacaoBusiness;

  constructor() {
    this.avaliacaoBusiness = new AvaliacaoBusiness();
  }

  public getAvaliacoes = async (req: Request, res: Response) => {
    try {
      const avaliacoes = await this.avaliacaoBusiness.getAllAvaliacoes();

      res.status(200).send(avaliacoes);
    } catch (error: any) {
      console.error("Erro ao listar todas as avaliações:", error);
      res
        .status(500)
        .send({ message: "Erro interno ao listar todas as avaliações." });
    }
  };

  createAvaliacao = async (req: Request, res: Response): Promise<void> => {
    try {
      const { servico_id, usuario_id, nota, comentario } = req.body;
      const avaliacao: Avaliacao = { servico_id, usuario_id, nota, comentario };
      const newAvaliacao = await this.avaliacaoBusiness.createAvaliacao(
        avaliacao
      );
      res.status(201).send(newAvaliacao);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

  getAvaliacoesByServicoId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const servico_id = Number(req.params.servico_id);
      const avaliacoes = await this.avaliacaoBusiness.getAvaliacoesByServicoId(
        servico_id
      );
      res.status(200).send(avaliacoes);
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

  updateAvaliacao = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const { nota, comentario } = req.body;
      const avaliacao: Partial<Avaliacao> = { nota, comentario };
      const updatedAvaliacao = await this.avaliacaoBusiness.updateAvaliacao(
        id,
        avaliacao
      );
      if (updatedAvaliacao) {
        res.status(200).send(updatedAvaliacao);
      } else {
        res.status(404).send({ message: "Avaliação não encontrada." });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };

  deleteAvaliacao = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const success = await this.avaliacaoBusiness.deleteAvaliacao(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).send({ message: "Avaliação não encontrada." });
      }
    } catch (error: any) {
      res.status(400).send({ message: error.message });
    }
  };
}
