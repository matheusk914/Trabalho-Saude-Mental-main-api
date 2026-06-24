import { Servicos } from '../types/Servicos';
import { connection as dbConnection } from '../dbConnection';

export class ServicosData {
    async create(servico: Servicos): Promise<Servicos> {
        const [newServico] = await dbConnection('servicos').insert(servico).returning('*');
        return newServico;
    }

    async getAll(cidade?: string, gratuito?: boolean, categoria?: string): Promise<Servicos[]> {
        let query = dbConnection('servicos');
        if (cidade) {
            query = query.where('cidade', 'like', `%${cidade}%`);
        }
        if (gratuito !== undefined) {
            query = query.where('gratuito', gratuito);
        }
        if (categoria) {
            query = query.where('categoria', 'like', `%${categoria}%`);
        }
        return query;
    }

    async getById(id: number): Promise<Servicos | undefined> {
        return dbConnection('servicos').where({ id }).first();
    }

    async update(id: number, servico: Partial<Servicos>): Promise<Servicos | undefined> {
        const [updatedServico] = await dbConnection('servicos').where({ id }).update(servico).returning('*');
        return updatedServico;
    }

    async delete(id: number): Promise<boolean> {
        const deletedCount = await dbConnection('servicos').where({ id }).del();
        return deletedCount > 0;
    }
}
