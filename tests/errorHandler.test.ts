import { throwErrorIfNegative } from "../src/utils/errorHandler";

describe("Tratamento de erros", () => {
  test("deve lançar um erro se o número for negativo", () => {
    expect(() => throwErrorIfNegative(-1)).toThrow(
      "Número não pode ser negativo."
    );
  });

  test("não deve lançar um erro se o número for positivo", () => {
    expect(throwErrorIfNegative(1)).toBe(1);
  });

  test("não deve lançar um erro se o número for zero", () => {
    expect(throwErrorIfNegative(0)).toBe(0);
  });
});
