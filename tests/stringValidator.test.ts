import { isNonEmptyString } from "../src/utils/stringValidator";

describe("Validação isNonEmptyString", () => {
  test("deve retornar verdadeiro para uma string válida e não vazia", () => {
    expect(isNonEmptyString("Sessão de Terapia")).toBe(true);
    expect(isNonEmptyString("Dr. Almeida")).toBe(true);
  });

  test("deve retornar falso para strings vazias ou com apenas espaços em branco", () => {
    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString("   ")).toBe(false);
  });

  test("deve retornar falso para entradas que não são strings (null, undefined, number)", () => {
    expect(isNonEmptyString(null)).toBe(false);
    expect(isNonEmptyString(undefined)).toBe(false);
    expect(isNonEmptyString(12345)).toBe(false);
    expect(isNonEmptyString({})).toBe(false);
  });
});
