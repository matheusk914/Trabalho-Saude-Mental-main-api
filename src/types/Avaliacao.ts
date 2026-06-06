export interface Avaliacao {
    id?: number;
    servico_id: number;
    usuario_id: number;
    nota: number;
    comentario?: string;
    data?: Date;
}
