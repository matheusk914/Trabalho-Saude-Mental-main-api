import { Router } from "express";
import { AvaliacaoController } from "../controller/AvaliacaoController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";

const avaliacaoRouter = Router();
const avaliacaoController = new AvaliacaoController();

avaliacaoRouter.get("/", avaliacaoController.getAvaliacoes);
avaliacaoRouter.post("/", AuthMiddleware.authenticate, avaliacaoController.createAvaliacao);
avaliacaoRouter.get("/:servico_id",avaliacaoController.getAvaliacoesByServicoId);
avaliacaoRouter.put("/:id", AuthMiddleware.authenticate,AuthorizationMiddleware.authorizeReviewOwner, avaliacaoController.updateAvaliacao);
avaliacaoRouter.delete("/:id", AuthMiddleware.authenticate,  AuthorizationMiddleware.authorizeReviewOwner, avaliacaoController.deleteAvaliacao);

export { avaliacaoRouter };
