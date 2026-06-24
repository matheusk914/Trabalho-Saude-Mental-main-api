export const throwErrorIfNegative = (num: number): number => {
  if (num < 0) {
    throw new Error("Número não pode ser negativo.");
  }
  return num;
};
