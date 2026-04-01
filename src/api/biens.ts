import api from './client';
import type {
  ApiBien,
  ApiBienImage,
  ApiBiensFilters,
  ApiBiensStats,
  ApiPaginated,
  BienStatut,
  BienTransaction,
  BienType,
} from './types';
import { toFormData, unwrapList } from './utils';

export interface BienQueryParams {
  type?: BienType | 'all';
  transaction?: BienTransaction | 'all';
  zone?: string;
  prix_min?: number | string;
  prix_max?: number | string;
  surface_min?: number | string;
  search?: string;
  en_vedette?: boolean;
  statut?: BienStatut;
  sort_by?: 'prix' | 'surface' | 'created_at';
  sort_order?: 'asc' | 'desc';
  per_page?: number;
}

export interface BienPayload {
  titre: string;
  description: string;
  prix: number;
  surface: number;
  pieces?: number;
  chambres?: number;
  salle_de_bain?: number;
  etage?: number | null;
  type: BienType;
  transaction: BienTransaction;
  location_period?: 'mensuel' | 'journalier' | null;
  zone: string;
  quartier: string;
  reference?: string;
  statut?: BienStatut;
  en_vedette?: boolean;
  caracteristiques?: string[];
  images?: File[];
  replace_images?: boolean;
}

export const getBiens = async (params?: BienQueryParams) => {
  const response = await api.get<ApiBien[] | ApiPaginated<ApiBien>>('/biens', { params });
  return unwrapList(response.data);
};

export const getBien = async (idOrSlug: string | number) => {
  const response = await api.get<ApiBien>(`/biens/${idOrSlug}`);
  return response.data;
};

export const getBiensSimilaires = async (bienId: string | number) => {
  const response = await api.get<ApiBien[]>(`/biens/${bienId}/similaires`);
  return response.data;
};

export const getBiensFilters = async () => {
  const response = await api.get<ApiBiensFilters>('/biens/filters');
  return response.data;
};

export const getBiensStats = async () => {
  const response = await api.get<ApiBiensStats>('/biens/stats');
  return response.data;
};

export const createBien = async (payload: BienPayload) => {
  const formData = toFormData(payload);
  const response = await api.post<ApiBien>('/biens', formData);
  return response.data;
};

export const updateBien = async (bienId: string | number, payload: Partial<BienPayload>) => {
  const formData = toFormData(payload);
  const response = await api.put<ApiBien>(`/biens/${bienId}`, formData);
  return response.data;
};

export const deleteBien = async (bienId: string | number) => {
  const response = await api.delete<{ message: string }>(`/biens/${bienId}`);
  return response.data;
};

export const toggleBienVedette = async (bienId: string | number) => {
  const response = await api.patch<{ message: string; en_vedette: boolean }>(`/biens/${bienId}/vedette`);
  return response.data;
};

export const updateBienStatut = async (bienId: string | number, statut: BienStatut) => {
  const response = await api.patch<{ message: string; statut: BienStatut }>(`/biens/${bienId}/statut`, {
    statut,
  });
  return response.data;
};

export const reorderBienImages = async (
  bienId: string | number,
  images: Array<{ id: number; ordre: number }>
) => {
  const response = await api.post<ApiBienImage[]>(`/biens/${bienId}/images/reorder`, {
    images,
  });
  return response.data;
};

export const deleteBienImage = async (bienId: string | number, imageId: string | number) => {
  const response = await api.delete<{ message: string }>(`/biens/${bienId}/images/${imageId}`);
  return response.data;
};
