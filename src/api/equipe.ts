import api from './client';
import type { ApiMembreEquipe, ApiPaginated } from './types';
import { toFormData, unwrapList } from './utils';

export interface EquipeQueryParams {
  active_only?: boolean;
  per_page?: number;
}

export interface MembreEquipePayload {
  prenom: string;
  nom: string;
  poste: string;
  email?: string | null;
  telephone?: string | null;
  photo?: File | null;
  description?: string | null;
  ordre?: number;
  is_active?: boolean;
}

export const getEquipe = async (params?: EquipeQueryParams): Promise<ApiMembreEquipe[]> => {
  const response = await api.get<ApiMembreEquipe[] | ApiPaginated<ApiMembreEquipe>>('/equipe', { params });
  return unwrapList(response.data);
};

export const getMembreEquipe = async (id: string | number) => {
  const response = await api.get<ApiMembreEquipe>(`/equipe/${id}`);
  return response.data;
};

export const createMembreEquipe = async (payload: MembreEquipePayload) => {
  const formData = toFormData(payload);
  const response = await api.post<ApiMembreEquipe>('/equipe', formData);
  return response.data;
};

export const updateMembreEquipe = async (id: string | number, payload: Partial<MembreEquipePayload>) => {
  const formData = toFormData(payload);
  const response = await api.put<ApiMembreEquipe>(`/equipe/${id}`, formData);
  return response.data;
};

export const deleteMembreEquipe = async (id: string | number) => {
  const response = await api.delete<{ message: string }>(`/equipe/${id}`);
  return response.data;
};

export const toggleMembreEquipeActive = async (id: string | number) => {
  const response = await api.patch<{ message: string; is_active: boolean }>(`/equipe/${id}/active`);
  return response.data;
};

export const reorderMembresEquipe = async (membres: Array<{ id: number; ordre: number }>) => {
  const response = await api.post<{ message: string }>('/equipe/reorder', { membres });
  return response.data;
};
