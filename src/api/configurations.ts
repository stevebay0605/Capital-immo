import api from './client';
import type { ApiConfiguration } from './types';

export interface ConfigQueryParams {
  group?: string;
}

export interface ConfigurationPayload {
  key: string;
  value: unknown;
  type: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array';
  group: string;
  label: string;
}

export interface ConfigurationUpdatePayload {
  value: unknown;
  type?: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array';
  group?: string;
  label?: string;
}

export const getConfigurations = async (params?: ConfigQueryParams) => {
  const response = await api.get<ApiConfiguration[]>('/configurations', { params });
  return response.data;
};

export const getConfiguration = async (key: string) => {
  const response = await api.get<{ key: string; value: unknown }>(`/configurations/${key}`);
  return response.data;
};

export const createConfiguration = async (payload: ConfigurationPayload) => {
  const response = await api.post<{ message: string }>('/configurations', payload);
  return response.data;
};

export const updateConfiguration = async (key: string, payload: ConfigurationUpdatePayload) => {
  const response = await api.put<{ message: string }>(`/configurations/${key}`, payload);
  return response.data;
};

export const deleteConfiguration = async (key: string) => {
  const response = await api.delete<{ message: string }>(`/configurations/${key}`);
  return response.data;
};

export const bulkUpdateConfigurations = async (
  configs: Array<{ key: string; value: unknown; type?: 'string' | 'integer' | 'float' | 'boolean' | 'json' | 'array' }>
) => {
  const response = await api.post<{ message: string }>('/configurations/bulk', { configs });
  return response.data;
};

export const clearConfigurationsCache = async () => {
  const response = await api.post<{ message: string }>('/configurations/clear-cache');
  return response.data;
};
