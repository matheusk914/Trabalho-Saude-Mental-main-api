export interface Funcionario {
    id?: number;
    servico_id: number;
    nome: string;
    cargo: string;
    email: string;
    telefone?: string;
    data_admissao?: Date;
    salario?: number;
    senha: string;
}
