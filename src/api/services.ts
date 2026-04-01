import api from './client';
import type { ApiPaginated, ApiService } from './types';
import { toFormData, unwrapList } from './utils';

export interface ServiceQueryParams {
  active_only?: boolean;
  per_page?: number;
}

export interface ServicePayload {
  titre: string;
  description: string;
  description_longue: string;
  icon?: string;
  image?: File | null;
  avantages: string[];
  cta?: string;
  ordre?: number;
  is_active?: boolean;
}

export const getServices = async (params?: ServiceQueryParams) => {
  const response = await api.get<ApiService[] | ApiPaginated<ApiService>>('/services', { params });
  return unwrapList(response.data);
};

export const getService = async (idOrSlug: string | number) => {
  const response = await api.get<ApiService>(`/services/${idOrSlug}`);
  return response.data;
};

export const createService = async (payload: ServicePayload) => {
  const formData = toFormData(payload);
  const response = await api.post<ApiService>('/services', formData);
  return response.data;
};

export const updateService = async (serviceId: string | number, payload: Partial<ServicePayload>) => {
  const formData = toFormData(payload);
  const response = await api.put<ApiService>(`/services/${serviceId}`, formData);
  return response.data;
};

export const deleteService = async (serviceId: string | number) => {
  const response = await api.delete<{ message: string }>(`/services/${serviceId}`);
  return response.data;
};

export const toggleServiceActive = async (serviceId: string | number) => {
  const response = await api.patch<{ message: string; is_active: boolean }>(`/services/${serviceId}/active`);
  return response.data;
};

export const reorderServices = async (services: Array<{ id: number; ordre: number }>) => {
  const response = await api.post<{ message: string }>('/services/reorder', { services });
  return response.data;
};
