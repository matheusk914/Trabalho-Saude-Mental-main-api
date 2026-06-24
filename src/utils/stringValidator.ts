export const isNonEmptyString = (input: unknown): boolean => {
  return typeof input === "string" && input.trim().length > 0;
};
