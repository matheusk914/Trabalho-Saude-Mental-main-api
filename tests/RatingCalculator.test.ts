import { calculateAverageRating } from "../src/utils/RatingCalculator";

describe("Teste Unitário Avançado: calculateAverageRating", () => {
    
    test("deve retornar 0 se a lista de avaliações for vazia ou nula", () => {
        expect(calculateAverageRating([])).toBe(0);
    });

    test("deve calcular a média correta para notas válidas", () => {
        const reviews = [
            { nota: 5 }, 
            { nota: 5 }, 
            { nota: 4 }, 
            { nota: 4 }, 
        ]; 
        expect(calculateAverageRating(reviews)).toBe(4.5);
    });
    
    test("deve ignorar notas fora do intervalo [1, 5] ao calcular a média", () => {
        const reviews = [
            { nota: 5 }, 
            { nota: 1 }, 
            { nota: 10 }, 
            { nota: 0 },  
            { nota: 3 }, 
        ]; 
        expect(calculateAverageRating(reviews)).toBe(3.0);
    });

    test("deve arredondar o resultado para uma casa decimal", () => {
        const reviews = [
            { nota: 5 }, 
            { nota: 4 }, 
            { nota: 4 }, 
            { nota: 3 }, 
            { nota: 3 },
            { nota: 3 },
        ]; 
        expect(calculateAverageRating(reviews)).toBe(3.7);
    });
    
    test("deve retornar 0 se todas as avaliações forem inválidas", () => {
        const reviews = [
            { nota: 0 }, 
            { nota: 6 }, 
            { nota: 100 }, 
        ];
        expect(calculateAverageRating(reviews)).toBe(0);
    });
});