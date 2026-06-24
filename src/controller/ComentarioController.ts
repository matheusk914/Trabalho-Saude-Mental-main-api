import { Request, Response } from "express";
import { ComentarioBusiness } from "../business/ComentarioBusiness";

export class ComentarioController {
    private comentarioBusiness: ComentarioBusiness;

    constructor() {
        this.comentarioBusiness = new ComentarioBusiness();
    }

    getByServicoId = async (req: Request, res: Response): Promise<void> => {
        try {
            const servico_id = Number(req.params.servico_id);
            const comentarios = await this.comentarioBusiness.getByServicoId(servico_id);
            res.status(200).send(comentarios);
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    };

    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const servico_id = Number(req.params.servico_id);
            const usuario_id = req.user!.userId;
            const { texto } = req.body;

            const novo = await this.comentarioBusiness.create({
                servico_id,
                usuario_id,
                texto,
            });

            res.status(201).send(novo);
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    };

    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const { texto } = req.body;
            const usuarioId = req.user!.userId;
            const userRole = req.user!.role;

            const atualizado = await this.comentarioBusiness.update(id, texto, usuarioId, userRole);

            if (!atualizado) {
                res.status(404).send({ error: "Comentário não encontrado." });
                return;
            }

            res.status(200).send(atualizado);
        } catch (error: any) {
            const status = error.message.includes("só pode editar") ? 403 : 400;
            res.status(status).send({ error: error.message });
        }
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const usuarioId = req.user!.userId;
            const userRole = req.user!.role;

            await this.comentarioBusiness.delete(id, usuarioId, userRole);
            res.status(204).send();
        } catch (error: any) {
            const status = error.message.includes("só pode excluir") ? 403
                : error.message.includes("não encontrado") ? 404
                : 400;
            res.status(status).send({ error: error.message });
        }
    };
}
