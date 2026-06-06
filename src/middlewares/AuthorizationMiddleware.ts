import { Request, Response, NextFunction } from "express";
import { AvaliacaoData } from "../data/AvaliacaoData";


const avaliacaoData = new AvaliacaoData();

export class AuthorizationMiddleware {
  static authorizeOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const authenticatedUserId = req.user?.userId;
      const targetUserId = Number(req.params.id);
      const userRole = req.user?.role;
      if (!authenticatedUserId) {
        return res.status(401).send({ error: "Usuário não autenticado" });
      }
      if (authenticatedUserId !== targetUserId && userRole !== "admin") {
        return res
          .status(403)
          .send({
            error:
              "Você só pode visualizar, editar ou deletar sua própria conta",
          });
      }
      next();
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }
  static authorizeAdminOnly(req: Request, res: Response, next: NextFunction) {
    try {
      const userRole = req.user?.role;

      if (userRole !== 'admin') {
        return res.status(403).send({ 
          error: 'Acesso negado. Apenas administradores podem realizar esta ação.' 
        });
      }
      next();
    } catch (error: any) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async authorizeReviewOwner(req: Request, res: Response, next: NextFunction) {
        try {
            const authenticatedUserId = req.user?.userId;
            const userRole = req.user?.role;
            const reviewId = Number(req.params.id);

            if (!authenticatedUserId) {
                return res.status(401).send({ error: 'Usuário não autenticado' });
            }

            if (userRole === 'admin') {
                return next();
            }

            const avaliacao = await avaliacaoData.getById(reviewId);
        
            if (!avaliacao) {
                return res.status(404).send({ error: 'Avaliação não encontrada.' });
            }

            if (avaliacao.usuario_id !== authenticatedUserId) {
                return res.status(403).send({ error: 'Você só pode alterar suas próprias avaliações.' });
            }

            next();
        } catch (error: any) {
            return res.status(500).send({ error: error.message });
        }
    }

}
