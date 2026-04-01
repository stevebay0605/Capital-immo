import api from './client';
import type { ApiContact, ApiContactsStats, ApiPaginated } from './types';
import { unwrapList } from './utils';

export interface ContactsQueryParams {
  is_read?: boolean;
  objet?: string;
  per_page?: number;
}

export interface ContactPayload {
  nom: string;
  telephone: string;
  email?: string | null;
  objet: string;
  message: string;
  bien_id?: number | null;
  reference_bien?: string | null;
}

export interface ContactUpdatePayload {
  notes?: string | null;
  is_read?: boolean;
}

export const createContact = async (
  payload: ContactPayload
): Promise<{ message: string; contact: ApiContact }> => {
  const response = await api.post<{ message: string; contact: ApiContact }>('/contacts', payload);
  return response.data;
};

export const getContacts = async (params?: ContactsQueryParams): Promise<ApiContact[]> => {
  const response = await api.get<ApiContact[] | ApiPaginated<ApiContact>>('/contacts', { params });
  return unwrapList(response.data);
};

export const getContact = async (id: string | number): Promise<ApiContact> => {
  const response = await api.get<ApiContact>(`/contacts/${id}`);
  return response.data;
};

export const updateContact = async (
  id: string | number,
  payload: ContactUpdatePayload
): Promise<ApiContact> => {
  const response = await api.put<ApiContact>(`/contacts/${id}`, payload);
  return response.data;
};

export const deleteContact = async (id: string | number) => {
  const response = await api.delete<{ message: string }>(`/contacts/${id}`);
  return response.data;
};

export const markContactRead = async (id: string | number) => {
  const response = await api.patch<{ message: string; is_read: boolean }>(`/contacts/${id}/read`);
  return response.data;
};

export const markContactUnread = async (id: string | number) => {
  const response = await api.patch<{ message: string; is_read: boolean }>(`/contacts/${id}/unread`);
  return response.data;
};

export const bulkDeleteContacts = async (ids: number[]) => {
  const response = await api.post<{ message: string }>('/contacts/bulk-delete', { ids });
  return response.data;
};

export const bulkMarkContactsRead = async (ids: number[]) => {
  const response = await api.post<{ message: string }>('/contacts/bulk-read', { ids });
  return response.data;
};

export const getContactsStats = async () => {
  const response = await api.get<ApiContactsStats>('/contacts/stats');
  return response.data;
};
