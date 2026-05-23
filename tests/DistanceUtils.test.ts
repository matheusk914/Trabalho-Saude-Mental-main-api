import { calculateDistance } from "../src/utils/DistanceUtils";

describe("DistanceUtils - calculateDistance", () => {
  const muriaeLat = -21.1306;
  const muriaeLon = -42.3664;
  const ubaLat = -21.12;
  const ubaLon = -42.94;
  const expectedDistance = 59.51;

  // Teste: Verifica o cálculo da distância entre duas cidades conhecidas
  test("deve calcular corretamente a distância entre duas cidades conhecidas (Muriaé e Ubá)", () => {
    const distance = calculateDistance(
      muriaeLat,
      muriaeLon,
      ubaLat,
      ubaLon
    );

    expect(distance).toBeCloseTo(expectedDistance, 1);
  });

  // Teste: Distância de um ponto para ele mesmo deve ser zero
  test("deve retornar 0 ao calcular a distância de um ponto para ele mesmo", () => {
    const distance = calculateDistance(
      muriaeLat,
      muriaeLon,
      muriaeLat,
      muriaeLon
    );
    expect(distance).toBe(0);
  });

  // Teste: A distância deve ser simétrica (A→B = B→A)
  test("deve respeitar a simetria: distância de A para B deve ser igual à de B para A", () => {
    const distanceAB = calculateDistance(
      muriaeLat,
      muriaeLon,
      ubaLat,
      ubaLon
    );
    const distanceBA = calculateDistance(
      ubaLat,
      ubaLon,
      muriaeLat,
      muriaeLon
    );
    expect(distanceAB).toBe(distanceBA);
  });
});
