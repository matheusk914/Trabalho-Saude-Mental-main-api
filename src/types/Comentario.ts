export interface Comentario {
    id?: number;
    servico_id: number;
    usuario_id: number;
    texto: string;
    criado_em?: Date;
    atualizado_em?: Date;
}

export interface ComentarioComAutor {
    id: number;
    servico_id: number;
    usuario_id: number;
    texto: string;
    criado_em: Date;
    atualizado_em: Date;
    nome_usuario: string;
}
