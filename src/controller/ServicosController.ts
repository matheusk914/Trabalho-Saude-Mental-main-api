import { Request, Response } from 'express';
import { ServicosBusiness } from '../business/ServicosBusiness';
import { CreateServicoDto, UpdateServicoDto } from '../dto/ServicosDto';
import { ValidationError, GoogleMapsAPIError } from '../utils/CustomErrors';
import { ServicosData } from '../data/ServicosData';
import { GeoService } from '../services/APIlocalizacao';

export class ServicosController {
    private servicosBusiness: ServicosBusiness;

    constructor(servicosData: ServicosData, geoService: GeoService) {
        this.servicosBusiness = new ServicosBusiness(servicosData, geoService);
    }

    createServico = async (req: Request, res: Response): Promise<void> => {
        try {
            const { nome, tipo, cidade, endereco, telefone, gratuito, categoria } = req.body;
            const servicoDto = new CreateServicoDto(nome, tipo, cidade, endereco, telefone, gratuito, categoria);
            const newServico = await this.servicosBusiness.createServico(servicoDto);
            res.status(201).send(newServico);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                res.status(400).send({ message: error.message });
            } else if (error instanceof GoogleMapsAPIError) {
                res.status(500).send({ message: error.message });
            } else {
                res.status(500).send({ message: 'Erro interno do servidor.' });
            }
        }
    }

    getServicos = async (req: Request, res: Response): Promise<void> => {
        try {
            const { cidade, gratuito, categoria } = req.query;
            const servicos = await this.servicosBusiness.getServicos(
                cidade as string,
                gratuito ? (gratuito === 'true') : undefined,
                categoria as string
            );
            res.status(200).send(servicos);
        } catch (error: any) {
            res.status(500).send({ message: 'Erro interno do servidor.' });
        }
    }

    getServicoById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const servico = await this.servicosBusiness.getServicoById(id);
            if (servico) {
                res.status(200).send(servico);
            } else {
                res.status(404).send({ message: 'Serviço não encontrado.' });
            }
        } catch (error: any) {
            if (error instanceof ValidationError) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(500).send({ message: 'Erro interno do servidor.' });
            }
        }
    }

    updateServico = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const { nome, tipo, cidade, endereco, telefone, gratuito, categoria } = req.body;
            const servicoDto = new UpdateServicoDto(nome, tipo, cidade, endereco, telefone, gratuito, categoria);
            const updatedServico = await this.servicosBusiness.updateServico(id, servicoDto);
            if (updatedServico) {
                res.status(200).send(updatedServico);
            } else {
                res.status(404).send({ message: 'Serviço não encontrado.' });
            }
        } catch (error: any) {
            if (error instanceof ValidationError) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(500).send({ message: 'Erro interno do servidor.' });
            }
        }
    }

    deleteServico = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = Number(req.params.id);
            const success = await this.servicosBusiness.deleteServico(id);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).send({ message: 'Serviço não encontrado.' });
            }
        } catch (error: any) {
            if (error instanceof ValidationError) {
                res.status(400).send({ message: error.message });
            } else {
                res.status(500).send({ message: 'Erro interno do servidor.' });
            }
        }
    }
}
