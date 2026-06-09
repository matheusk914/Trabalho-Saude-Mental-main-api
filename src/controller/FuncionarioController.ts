import { Request, Response } from "express";
import FuncionarioBusiness from "../business/FuncionarioBusiness";
import { Funcionario } from "../types/Funcionario";

class FuncionarioController {
  async listarFuncionarios(req: Request, res: Response): Promise<void> {
    try {
      const funcionarios = await FuncionarioBusiness.listar();
      res.status(200).json(funcionarios);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async detalharFuncionario(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const funcionario = await FuncionarioBusiness.detalhar(id);
      if (funcionario) {
        res.status(200).json(funcionario);
      } else {
        res.status(404).json({ error: "Funcionário não encontrado." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async cadastrarFuncionario(req: Request, res: Response): Promise<void> {
    try {
      const novoFuncionario: Funcionario = req.body;
      const resultado = await FuncionarioBusiness.cadastrar(novoFuncionario);
      if (resultado && "error" in resultado) {
        res.status(400).json(resultado);
        return;
      }
      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizarFuncionario(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const dadosAtualizados: Partial<Funcionario> = req.body;
      const funcionarioAtualizado = await FuncionarioBusiness.atualizar(id, dadosAtualizados);
      if (funcionarioAtualizado) {
        res.status(200).json(funcionarioAtualizado);
      } else {
        res.status(404).json({ error: "Funcionário não encontrado." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async removerFuncionario(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const sucesso = await FuncionarioBusiness.remover(id);
      if (sucesso) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Funcionário não encontrado." });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new FuncionarioController();
