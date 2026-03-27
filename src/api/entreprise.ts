import api from './client';
import type { ApiEntrepriseInfo } from './types';

export interface UpdateEntreprisePayload {
  nom?: string;
  slogan?: string;
  adresse?: string;
  telephone?: string;
  whatsapp?: string;
  email?: string;
  facebook?: string;
  facebook_url?: string;
  description?: string;
  histoire?: string;
  mission?: string;
  date_creation?: number;
  clients_satisfaits?: number;
  hero_image_url?: string;
  about_image_url?: string;
  horaires?: Record<string, string>;
  coordonnees?: { lat: number; lng: number };
  valeurs?: Array<{ titre: string; description: string; icon: string }>;
}

export const getEntreprise = async () => {
  const response = await api.get<ApiEntrepriseInfo>('/entreprise');
  return response.data;
};

export const updateEntreprise = async (payload: UpdateEntreprisePayload) => {
  const response = await api.put<{ message: string; data: ApiEntrepriseInfo }>(
    '/entreprise',
    payload
  );
  return response.data;
};
