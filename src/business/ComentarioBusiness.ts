import { Comentario, ComentarioComAutor } from "../types/Comentario";
import { ComentarioData } from "../data/ComentarioData";

export class ComentarioBusiness {
    private comentarioData: ComentarioData;

    constructor() {
        this.comentarioData = new ComentarioData();
    }

    async getByServicoId(servico_id: number): Promise<ComentarioComAutor[]> {
        if (!servico_id || isNaN(servico_id)) {
            throw new Error("servico_id inválido.");
        }
        return this.comentarioData.getByServicoId(servico_id);
    }

    async create(comentario: Comentario): Promise<ComentarioComAutor> {
        if (!comentario.servico_id || isNaN(comentario.servico_id)) {
            throw new Error("servico_id é obrigatório.");
        }
        if (!comentario.usuario_id || isNaN(comentario.usuario_id)) {
            throw new Error("usuario_id é obrigatório.");
        }
        if (!comentario.texto || comentario.texto.trim().length === 0) {
            throw new Error("O texto do comentário é obrigatório.");
        }
        if (comentario.texto.trim().length > 1000) {
            throw new Error("O comentário não pode ultrapassar 1000 caracteres.");
        }

        return this.comentarioData.create({
            ...comentario,
            texto: comentario.texto.trim(),
        });
    }

    async update(
        id: number,
        texto: string,
        usuarioId: number,
        userRole: string
    ): Promise<ComentarioComAutor | undefined> {
        if (!id || isNaN(id)) {
            throw new Error("ID do comentário é obrigatório.");
        }
        if (!texto || texto.trim().length === 0) {
            throw new Error("O texto do comentário é obrigatório.");
        }
        if (texto.trim().length > 1000) {
            throw new Error("O comentário não pode ultrapassar 1000 caracteres.");
        }

        const comentario = await this.comentarioData.getById(id);
        if (!comentario) {
            throw new Error("Comentário não encontrado.");
        }

        if (comentario.usuario_id !== usuarioId && userRole !== "admin") {
            throw new Error("Você só pode editar seus próprios comentários.");
        }

        return this.comentarioData.update(id, texto.trim());
    }

    async delete(id: number, usuarioId: number, userRole: string): Promise<boolean> {
        if (!id || isNaN(id)) {
            throw new Error("ID do comentário é obrigatório.");
        }

        const comentario = await this.comentarioData.getById(id);
        if (!comentario) {
            throw new Error("Comentário não encontrado.");
        }

        if (comentario.usuario_id !== usuarioId && userRole !== "admin") {
            throw new Error("Você só pode excluir seus próprios comentários.");
        }

        return this.comentarioData.delete(id);
    }
}
