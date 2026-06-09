import { ServicosBusiness } from "../src/business/ServicosBusiness";

describe("ServicosBusiness.createServico", () => {
  test("deve usar coordenadas já enviadas pelo frontend sem chamar geocodificação", async () => {
    const create = jest.fn(async (dto: any) => ({ ...dto }));
    const geoService = {
      getCoordenadas: jest.fn(async () => {
        throw new Error("GEOCODE_SHOULD_NOT_RUN");
      }),
    };

    const business = new ServicosBusiness({ create } as any, geoService as any);

    const dto = {
      nome: "Clínica Teste",
      tipo: "Clínica",
      cidade: "Muriaé",
      endereco: "Rua Teste",
      telefone: "",
      gratuito: false,
      categoria: "Saúde",
      latitude: -19.92,
      longitude: -43.94,
    };

    const result = await business.createServico(dto as any);

    expect(create).toHaveBeenCalledWith(expect.objectContaining({
      latitude: -19.92,
      longitude: -43.94,
    }));
    expect(result.latitude).toBe(-19.92);
    expect(result.longitude).toBe(-43.94);
    expect(geoService.getCoordenadas).not.toHaveBeenCalled();
  });
});
