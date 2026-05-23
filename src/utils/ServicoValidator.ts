interface ServicoInput {
    nome?: string;
    cidade?: string;
    endereco?: string;
    categoria?: string;
    gratuito?: boolean;
}

export function validateRequiredFields(input: ServicoInput): string[] {
    const requiredFields: (keyof ServicoInput)[] = ['nome', 'cidade', 'endereco', 'categoria'];
    const missingFields: string[] = [];

    for (const field of requiredFields) {
        if (!input[field] || (typeof input[field] === 'string' && input[field].trim() === '')) {
            missingFields.push(field);
        }
    }
    
   

    return missingFields;
}