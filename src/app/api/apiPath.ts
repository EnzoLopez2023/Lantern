export const sameOriginApiPath = (value: string): string => {
  const path = value.trim();
  const containsControlCharacter = [...path].some(character => {
    const codePoint = character.codePointAt(0) ?? 0;
    return codePoint <= 31 || codePoint === 127;
  });
  if (
    !path.startsWith('/')
    || path.startsWith('//')
    || path.includes('\\')
    || containsControlCharacter
  ) {
    throw new Error('Lantern API requests must use an origin-relative path beginning with a single slash.');
  }
  return path;
};
