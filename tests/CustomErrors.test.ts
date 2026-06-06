import { ValidationError, GoogleMapsAPIError } from "../src/utils/CustomErrors";

describe("CustomErrors", () => {
  // Teste: Verifica a classe ValidationError
  test("ValidationError deve ser uma instância de Error e ter o nome correto", () => {
    const errorMessage = "Campo obrigatório faltando.";
    const error = new ValidationError(errorMessage);

    // Deve ser uma instância da classe de erro
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ValidationError);

    // Deve ter a mensagem e o nome corretos
    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe("ValidationError");
  });

  // Teste: Verifica a classe GoogleMapsAPIError
  test("GoogleMapsAPIError deve ser uma instância de Error e ter o nome correto", () => {
    const errorMessage = "Falha na comunicação com a API do Google Maps.";
    const error = new GoogleMapsAPIError(errorMessage);

    // Deve ser uma instância da classe de erro
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(GoogleMapsAPIError);

    // Deve ter a mensagem e o nome corretos
    expect(error.message).toBe(errorMessage);
    expect(error.name).toBe("GoogleMapsAPIError");
  });
});
