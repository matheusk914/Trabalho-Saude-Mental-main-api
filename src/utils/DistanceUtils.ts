/**
 * Converte graus para radianos.
 * @param deg Valor em graus.
 * @returns Valor em radianos.
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Calcula a distância entre dois pontos geográficos (latitude e longitude) usando a fórmula de Haversine.
 * @param lat1 Latitude do ponto 1.
 * @param lon1 Longitude do ponto 1.
 * @param lat2 Latitude do ponto 2.
 * @param lon2 Longitude do ponto 2.
 * @returns Distância em quilômetros (km).
 */

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em km

  return distance;
};
