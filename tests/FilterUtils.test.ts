export const sanitizeFilterInput = (input: string | undefined): string | undefined => {
  if (!input) {
    return undefined;
  }

  const sanitized = input.trim().toLowerCase();
  return sanitized.length > 0 ? sanitized : undefined;
};

describe("FilterUtils", () => {
  // Teste: Verifica se a função sanitiza corretamente uma string (usando exemplo de Muriae)
  test("deve sanitizar uma string normal (trim + lowercase) usando o exemplo de Muriae", () => {
    const input = "Muriae MG";
    const expected = "muriae mg";
    expect(sanitizeFilterInput(input)).toBe(expected);
  });

  // Teste: Retorna undefined quando a entrada é undefined
  test("deve retornar undefined para entrada undefined", () => {
    expect(sanitizeFilterInput(undefined)).toBeUndefined();
  });

  // Teste: Retorna undefined para string vazia ou composta apenas por espaços
  test("deve retornar undefined para string vazia ou contendo apenas espaços", () => {
    expect(sanitizeFilterInput("")).toBeUndefined();
    expect(sanitizeFilterInput("   ")).toBeUndefined();
  });

  // Teste: Não altera uma string que já está sanitizada (usando exemplo de Uba)
  test("deve retornar a mesma string se ela já estiver sanitizada (exemplo Uba)", () => {
    const input = "uba mg";
    expect(sanitizeFilterInput(input)).toBe(input);
  });
});
