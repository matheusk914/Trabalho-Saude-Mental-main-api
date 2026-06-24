import { Comentario, ComentarioComAutor } from "../types/Comentario";
import { connection as dbConnection } from "../dbConnection";

export class ComentarioData {
    async create(comentario: Comentario): Promise<ComentarioComAutor> {
        const [novo] = await dbConnection("comentarios")
            .insert({
                servico_id: comentario.servico_id,
                usuario_id: comentario.usuario_id,
                texto: comentario.texto,
            })
            .returning("*");

        const resultado = await dbConnection("comentarios")
            .join("usuarios", "comentarios.usuario_id", "usuarios.id")
            .select(
                "comentarios.id",
                "comentarios.servico_id",
                "comentarios.usuario_id",
                "comentarios.texto",
                "comentarios.criado_em",
                "comentarios.atualizado_em",
                "usuarios.nome as nome_usuario"
            )
            .where("comentarios.id", novo.id)
            .first();

        return resultado as ComentarioComAutor;
    }

    async getByServicoId(servico_id: number): Promise<ComentarioComAutor[]> {
        const comentarios = await dbConnection("comentarios")
            .join("usuarios", "comentarios.usuario_id", "usuarios.id")
            .select(
                "comentarios.id",
                "comentarios.servico_id",
                "comentarios.usuario_id",
                "comentarios.texto",
                "comentarios.criado_em",
                "comentarios.atualizado_em",
                "usuarios.nome as nome_usuario"
            )
            .where("comentarios.servico_id", servico_id)
            .orderBy("comentarios.criado_em", "desc");

        return comentarios as ComentarioComAutor[];
    }

    async getById(id: number): Promise<Comentario | undefined> {
        return dbConnection("comentarios").where({ id }).first();
    }

    async update(id: number, texto: string): Promise<ComentarioComAutor | undefined> {
        const count = await dbConnection("comentarios")
            .where({ id })
            .update({ texto, atualizado_em: new Date() });

        if (count === 0) return undefined;

        const atualizado = await dbConnection("comentarios")
            .join("usuarios", "comentarios.usuario_id", "usuarios.id")
            .select(
                "comentarios.id",
                "comentarios.servico_id",
                "comentarios.usuario_id",
                "comentarios.texto",
                "comentarios.criado_em",
                "comentarios.atualizado_em",
                "usuarios.nome as nome_usuario"
            )
            .where("comentarios.id", id)
            .first();

        return atualizado as ComentarioComAutor;
    }

    async delete(id: number): Promise<boolean> {
        const deletedCount = await dbConnection("comentarios").where({ id }).del();
        return deletedCount > 0;
    }
}
