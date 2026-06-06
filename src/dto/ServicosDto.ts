export class CreateServicoDto {
    nome: string;
    tipo: string;
    cidade: string;
    endereco: string;
    telefone: string;
    gratuito: boolean;
    categoria: string;

    constructor(nome: string, tipo: string, cidade: string, endereco: string, telefone: string, gratuito: boolean, categoria: string) {
        this.nome = nome;
        this.tipo = tipo;
        this.cidade = cidade;
        this.endereco = endereco;
        this.telefone = telefone;
        this.gratuito = gratuito;
        this.categoria = categoria;
    }
}

export class UpdateServicoDto {
    nome?: string;
    tipo?: string;
    cidade?: string;
    endereco?: string;
    telefone?: string;
    gratuito?: boolean;
    categoria?: string;

    constructor(nome?: string, tipo?: string, cidade?: string, endereco?: string, telefone?: string, gratuito?: boolean, categoria?: string) {
        this.nome = nome;
        this.tipo = tipo;
        this.cidade = cidade;
        this.endereco = endereco;
        this.telefone = telefone;
        this.gratuito = gratuito;
        this.categoria = categoria;
    }
}
