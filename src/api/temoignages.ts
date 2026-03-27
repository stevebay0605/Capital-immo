import api from './client';
import type { ApiPaginated, ApiTemoignage } from './types';
import { toFormData, unwrapList } from './utils';

export interface TemoignageQueryParams {
  active_only?: boolean;
  per_page?: number;
}

export interface TemoignagePayload {
  nom: string;
  initiale?: string | null;
  role: string;
  message: string;
  avatar?: File | null;
  note?: number;
  is_active?: boolean;
  ordre?: number;
}

export const getTemoignages = async (params?: TemoignageQueryParams) => {
  const response = await api.get<ApiTemoignage[] | ApiPaginated<ApiTemoignage>>('/temoignages', { params });
  return unwrapList(response.data);
};

export const getTemoignage = async (id: string | number) => {
  const response = await api.get<ApiTemoignage>(`/temoignages/${id}`);
  return response.data;
};

export const createTemoignage = async (payload: TemoignagePayload) => {
  const formData = toFormData(payload as Record<string, unknown>);
  const response = await api.post<ApiTemoignage>('/temoignages', formData);
  return response.data;
};

export const updateTemoignage = async (id: string | number, payload: Partial<TemoignagePayload>) => {
  const formData = toFormData(payload as Record<string, unknown>);
  const response = await api.put<ApiTemoignage>(`/temoignages/${id}`, formData);
  return response.data;
};

export const deleteTemoignage = async (id: string | number) => {
  const response = await api.delete<{ message: string }>(`/temoignages/${id}`);
  return response.data;
};

export const toggleTemoignageActive = async (id: string | number) => {
  const response = await api.patch<{ message: string; is_active: boolean }>(`/temoignages/${id}/active`);
  return response.data;
};

export const reorderTemoignages = async (temoignages: Array<{ id: number; ordre: number }>) => {
  const response = await api.post<{ message: string }>('/temoignages/reorder', { temoignages });
  return response.data;
};
