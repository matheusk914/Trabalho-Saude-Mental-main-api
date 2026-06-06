
import axios from 'axios';
import { GoogleMapsAPIError, ValidationError } from '../utils/CustomErrors';

export interface coordenadas {
    latitude: number;
    longitude: number;
}

const GEOCODING_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export class GeoService {

    public async getCoordenadas(address: string, apiKey: string): Promise<coordenadas> {
        try {
            const response = await axios.get(GEOCODING_URL, {
                params: {
                    address: address,
                    key: apiKey,
                },
            });

            const resultados = response.data.results;

            if (!resultados || resultados.length === 0) {
                throw new ValidationError("Endereço inválido ou não encontrado pelo serviço de Geocoding.");
            }

            const locatizacao = resultados[0].geometry.location;

            return {
                latitude: locatizacao.lat,
                longitude: locatizacao.lng
            };
            
        } catch (error: any) {
            throw new GoogleMapsAPIError(`Falha ao obter coordenadas: ${error.message}`);
        }
    }
}
