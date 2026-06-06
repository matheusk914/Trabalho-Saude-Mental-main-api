import { Router } from "express";
import { ServicosController } from "../controller/ServicosController";
import { AuthorizationMiddleware } from "../middlewares/AuthorizationMiddleware";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ServicosData } from "../data/ServicosData";
import { GeoService } from "../services/APIlocalizacao";

const servicosRouter = Router();

export const createServicosRouter = (servicosData: ServicosData, geoService: GeoService) => {
    const servicosController = new ServicosController(servicosData, geoService);

    servicosRouter.post("/", AuthMiddleware.authenticate, AuthorizationMiddleware.authorizeAdminOnly, servicosController.createServico);
    servicosRouter.get("/", servicosController.getServicos);
    servicosRouter.get("/:id", servicosController.getServicoById);
    servicosRouter.put("/:id", AuthMiddleware.authenticate, AuthorizationMiddleware.authorizeAdminOnly, servicosController.updateServico);
    servicosRouter.delete("/:id", AuthMiddleware.authenticate, AuthorizationMiddleware.authorizeAdminOnly, servicosController.deleteServico);

    return servicosRouter;
};
