export const resolveAnalogyContent = <T>(children: T | undefined, body: T | undefined): T | undefined =>
  children ?? body;
