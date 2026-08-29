import { runtimeConfig } from '../config/runtimeConfig';
import { sameOriginApiPath } from './apiPath';

export type TokenProvider = () => Promise<string | null>;

export const apiUrl = (path: string): string => {
  if (runtimeConfig.configurationError) throw new Error(runtimeConfig.configurationError);
  return sameOriginApiPath(path);
};

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details: unknown = null,
  ) {
    super(message);
  }
}

export async function requestJson<T>(
  path: string,
  options: RequestInit = {},
  tokenProvider?: TokenProvider,
): Promise<T> {
  const token = tokenProvider ? await tokenProvider() : null;
  const response = await fetch(apiUrl(path), {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.text();
    let details: unknown = body || null;
    if (body) {
      try {
        details = JSON.parse(body);
      } catch {
        // Keep non-JSON server evidence as text.
      }
    }
    const detailMessage = details && typeof details === 'object'
      ? (details as { message?: unknown; error?: unknown }).message
        ?? (details as { error?: unknown }).error
      : null;
    throw new ApiError(
      response.status,
      typeof detailMessage === 'string' ? detailMessage : `Request failed (${response.status})`,
      details,
    );
  }
  return response.json() as Promise<T>;
}
