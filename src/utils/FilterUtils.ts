export const sanitizeFilterInput = (input: string | undefined): string | undefined => {
  if (!input) {
    return undefined;
  }
  const sanitized = input.trim().toLowerCase();
  return sanitized.length > 0 ? sanitized : undefined;
};
