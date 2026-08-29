import { requestJson } from './http';

export interface HealthResponse {
  ok?: boolean;
  status?: string;
  service?: string;
  [key: string]: unknown;
}

export interface VersionResponse {
  version?: string;
  commit?: string;
  build?: string;
  [key: string]: unknown;
}

export const getHealth = (): Promise<HealthResponse> => requestJson('/api/live');
export const getVersion = (): Promise<VersionResponse> => requestJson('/version.json');
