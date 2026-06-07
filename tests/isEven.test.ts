import { isEven } from "../src/utils/isEven";

describe("isEven", () => {
  test("deve retornar verdadeiro para um número par", () => {
    expect(isEven(2)).toBe(true);
    expect(isEven(0)).toBe(true);
    expect(isEven(100)).toBe(true);
  });

  test("deve retornar falso para um número ímpar", () => {
    expect(isEven(1)).toBe(false);
    expect(isEven(3)).toBe(false);
    expect(isEven(99)).toBe(false);
  });

  test("deve retornar verdadeiro para números pares negativos", () => {
    expect(isEven(-2)).toBe(true);
    expect(isEven(-100)).toBe(true);
  });

  test("deve retornar falso para números ímpares negativos", () => {
    expect(isEven(-1)).toBe(false);
    expect(isEven(-99)).toBe(false);
  });

  test("deve retornar falso para números de ponto flutuante", () => {
    expect(isEven(2.5)).toBe(false);
  });
});
