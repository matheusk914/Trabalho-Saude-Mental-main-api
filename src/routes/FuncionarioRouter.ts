import { Router } from "express";
import FuncionarioController from "../controller/FuncionarioController";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";

const router = Router();

router.get("/",  FuncionarioController.listarFuncionarios);
router.get("/:id", FuncionarioController.detalharFuncionario);
router.post("/",  AuthMiddleware.authenticate, AuthorizationMiddleware.authorizeAdminOnly, FuncionarioController.cadastrarFuncionario);
router.put("/:id",  AuthMiddleware.authenticate, AuthorizationMiddleware.authorizeOwner, FuncionarioController.atualizarFuncionario);
router.delete("/:id",  AuthMiddleware.authenticate, AuthorizationMiddleware.authorizeOwner, FuncionarioController.removerFuncionario);

export default router;
