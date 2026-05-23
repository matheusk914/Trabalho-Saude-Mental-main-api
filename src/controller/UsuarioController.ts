import { Request, Response } from "express";
import UsuarioBusiness from "../business/UsuarioBusiness";
import { Usuario, UsuarioInput } from "../types/Usuario";

class UsuarioController {
  async detalharUsuario(req: Request, res: Response): Promise<Response> {
    const idString = req.params.id as string;
    const id = parseInt(idString, 10);
    if (isNaN(id)) {
      return res
        .status(400)
        .send({ message: "O ID do usuário deve ser um número válido." });
    }
    try {
      const usuario = await UsuarioBusiness.detalhar(id);
      if (!usuario) {
        return res.status(404).send({ message: "Usuário não encontrado." });
      }
      return res.json(usuario);
    } catch (error) {
      console.error("Erro ao detalhar usuário:", error);
      return res
        .status(500)
        .send({ message: "Erro interno ao buscar usuário." });
    }
  }

  async listarUsuarios(req: Request, res: Response): Promise<Response> {
    const queryParams = req.query;

    try {
      const usuarios = await UsuarioBusiness.listar(queryParams);

      return res.json(usuarios);
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res
        .status(500)
        .send({ message: "Erro interno ao listar usuários." });
    }
  }
  async cadastrarUsuario(req: Request, res: Response): Promise<Response> {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
      return res
        .status(400)
        .send({ message: "Campos obrigatórios: nome, email e senha." });
    }
    try {
      const resultado = await UsuarioBusiness.cadastrar({
        nome,
        email,
        senha,
        telefone,
        role: "user",
      });

      if (resultado && "error" in resultado) {
        return res.status(409).send({ message: resultado.error });
      }

      return res.status(201).json(resultado);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      return res
        .status(500)
        .send({ message: "Erro interno ao cadastrar usuário." });
    }
  }

  async atualizarUsuario(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string, 10);
    const dadosParaAtualizar = req.body;

    if (Object.keys(dadosParaAtualizar).length === 0) {
      return res
        .status(400)
        .send({ message: "Nenhum dado fornecido para atualização." });
    }

    try {
      const usuarioAtualizado = await UsuarioBusiness.atualizar(
        id,
        dadosParaAtualizar
      );

      if (!usuarioAtualizado) {
        return res
          .status(404)
          .send({ message: "Usuário não encontrado para atualização." });
      }
      return res.json(usuarioAtualizado);
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      return res
        .status(500)
        .send({ message: "Erro interno ao atualizar usuário." });
    }
  }

  async removerUsuario(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id as string, 10);

    try {
      const removido = await UsuarioBusiness.remover(id);

      if (!removido) {
        return res
          .status(404)
          .send({ message: "Usuário não encontrado para exclusão." });
      }
      return res.status(204).send();
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      return res
        .status(500)
        .send({ message: "Erro interno ao remover usuário." });
    }
  }
}
export default new UsuarioController();
