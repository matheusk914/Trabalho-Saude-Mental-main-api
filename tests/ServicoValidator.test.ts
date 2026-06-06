import { validateRequiredFields } from "../src/utils/ServicoValidator";

describe("Teste Unitário: validateRequiredFields", () => {
    
    const baseValidInput = {
        nome: "Clínica Teste",
        cidade: "Muriaé",
        endereco: "Rua das Flores",
        categoria: "Saúde Mental",
        gratuito: true 
    };

    test("deve retornar um array vazio quando todos os campos obrigatórios estão presentes", () => {
        const result = validateRequiredFields(baseValidInput);
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });

    test("deve identificar 'nome' como campo ausente", () => {
        const input = { ...baseValidInput, nome: undefined };
        const result = validateRequiredFields(input);
        expect(result).toEqual(["nome"]);
    });
    
    test("deve identificar 'endereco' como ausente quando é uma string vazia", () => {
        const input = { ...baseValidInput, endereco: "" };
        const result = validateRequiredFields(input);
        expect(result).toEqual(["endereco"]);
    });

    test("deve identificar 'cidade' como ausente quando contém apenas espaços em branco", () => {
        const input = { ...baseValidInput, cidade: "   " };
        const result = validateRequiredFields(input);
        expect(result).toEqual(["cidade"]);
    });

    test("deve retornar todos os campos ausentes em um array", () => {
        const input = {
            nome: "Serviço Completo",
            cidade: undefined,
            endereco: " ",
            categoria: undefined,
        };
        const result = validateRequiredFields(input);
        expect(result).toEqual(["cidade", "endereco", "categoria"]);
        expect(result.length).toBe(3);
    });
});