export class CreateServicoDto {
    nome: string;
    tipo: string;
    cidade: string;
    endereco: string;
    telefone: string;
    gratuito: boolean;
    categoria: string;
    latitude?: number;
    longitude?: number;

    constructor(nome: string, tipo: string, cidade: string, endereco: string, telefone: string, gratuito: boolean, categoria: string, latitude?: number, longitude?: number) {
        this.nome = nome;
        this.tipo = tipo;
        this.cidade = cidade;
        this.endereco = endereco;
        this.telefone = telefone;
        this.gratuito = gratuito;
        this.categoria = categoria;
        this.latitude = latitude;
        this.longitude = longitude;
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
    latitude?: number;
    longitude?: number;

    constructor(nome?: string, tipo?: string, cidade?: string, endereco?: string, telefone?: string, gratuito?: boolean, categoria?: string, latitude?: number, longitude?: number) {
        this.nome = nome;
        this.tipo = tipo;
        this.cidade = cidade;
        this.endereco = endereco;
        this.telefone = telefone;
        this.gratuito = gratuito;
        this.categoria = categoria;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
