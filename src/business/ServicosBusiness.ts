import { Servicos } from '../types/Servicos';
import { ServicosData } from '../data/ServicosData';
import { GeoService } from '../services/APIlocalizacao';
import { ValidationError, GoogleMapsAPIError } from '../utils/CustomErrors';
import { CreateServicoDto, UpdateServicoDto } from '../dto/ServicosDto';


const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export class ServicosBusiness {
    private servicosData: ServicosData;
    private geoService: GeoService;

    constructor(servicosData: ServicosData, geoService: GeoService) {
        this.servicosData = servicosData;
        this.geoService = geoService;
    }

    async createServico(servicoDto: CreateServicoDto): Promise<Servicos> {
        if (!GOOGLE_API_KEY) {
            throw new GoogleMapsAPIError("A chave GOOGLE_MAPS_API_KEY não está configurada.");
        }
        try {
            const fullAddress = servicoDto.endereco + ", " + servicoDto.cidade; 
            
            const { latitude, longitude } = await this.geoService.getCoordenadas(
                fullAddress,
                GOOGLE_API_KEY
            );

            const dadosParaSalvar = {
                ...servicoDto, 
                latitude: latitude, 
                longitude: longitude, 
            } as Servicos; 

            return this.servicosData.create(dadosParaSalvar);
        } catch (error: any) {
            if (error instanceof ValidationError || error instanceof GoogleMapsAPIError) {
                throw error;
            }
            throw new Error(`Erro ao processar o endereço: ${error.message}`);
        }
    }

    async getServicos(cidade?: string, gratuito?: boolean, categoria?: string): Promise<Servicos[]> {
        return this.servicosData.getAll(cidade, gratuito, categoria);
    }

    async getServicoById(id: number): Promise<Servicos | undefined> {
        if (!id) {
            throw new ValidationError('ID do serviço é obrigatório.');
        }
        return this.servicosData.getById(id);
    }

    async updateServico(id: number, servicoDto: UpdateServicoDto): Promise<Servicos | undefined> {
        if (!id) {
            throw new ValidationError('ID do serviço é obrigatório.');
        }
        return this.servicosData.update(id, servicoDto as Partial<Servicos>);
    }

    async deleteServico(id: number): Promise<boolean> {
        if (!id) {
            throw new ValidationError('ID do serviço é obrigatório.');
        }
        return this.servicosData.delete(id);
    }
}
