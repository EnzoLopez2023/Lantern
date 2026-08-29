import { apiUrl, type TokenProvider } from './http';
import { authorizedHeaders } from './authHeaders';

let tokenProvider: TokenProvider | null = null;

export const configureApiTokenProvider = (provider: TokenProvider | null): void => {
  tokenProvider = provider;
};

export const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
  const token = tokenProvider ? await tokenProvider() : null;
  return fetch(apiUrl(path), {
    ...options,
    headers: authorizedHeaders(options.headers, token),
  });
};

export const apiWrite = async (path: string, options: RequestInit): Promise<Response> => {
  const response = await apiFetch(path, options);
  if (!response.ok) throw new Error(`Remote write failed (${response.status}).`);
  return response;
};
