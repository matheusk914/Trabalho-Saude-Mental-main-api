import { Router } from "express";
import UsuarioController from "../controller/UsuarioController";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";

const userRouter = Router();

userRouter.get("/", AuthMiddleware.authenticate, AuthorizationMiddleware.authorizeAdminOnly, UsuarioController.listarUsuarios);
userRouter.get("/:id",  AuthMiddleware.authenticate,
  AuthorizationMiddleware.authorizeOwner, UsuarioController.detalharUsuario);
userRouter.post("/", UsuarioController.cadastrarUsuario);

userRouter.put(
  "/:id",
  AuthMiddleware.authenticate,
  AuthorizationMiddleware.authorizeOwner,
  UsuarioController.atualizarUsuario
);

userRouter.delete(
  "/:id",
  AuthMiddleware.authenticate,
  AuthorizationMiddleware.authorizeOwner,
  UsuarioController.removerUsuario
);

export default userRouter;
