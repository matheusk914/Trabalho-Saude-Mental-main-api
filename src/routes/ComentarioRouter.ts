import { Router } from "express";
import { ComentarioController } from "../controller/ComentarioController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const comentarioRouter = Router({ mergeParams: true });
const comentarioController = new ComentarioController();

// GET /servicos/:servico_id/comentarios — público
comentarioRouter.get("/", comentarioController.getByServicoId);

// POST /servicos/:servico_id/comentarios — autenticado
comentarioRouter.post("/", AuthMiddleware.authenticate, comentarioController.create);

// PUT /comentarios/:id — autenticado (dono ou admin, validado na Business)
comentarioRouter.put("/:id", AuthMiddleware.authenticate, comentarioController.update);

// DELETE /comentarios/:id — autenticado (dono ou admin, validado na Business)
comentarioRouter.delete("/:id", AuthMiddleware.authenticate, comentarioController.delete);

export { comentarioRouter };
