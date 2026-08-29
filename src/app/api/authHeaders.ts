export const authorizedHeaders = (
  input: HeadersInit | undefined,
  token: string | null,
): Headers => {
  const headers = new Headers(input);
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};
