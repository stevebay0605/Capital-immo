import type { ApiPaginated } from './types';

export const unwrapList = <T,>(payload: T[] | ApiPaginated<T>): T[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.data ?? [];
};

const isFileLike = (value: unknown): value is File | Blob =>
  value instanceof File || value instanceof Blob;

export const toFormData = <T extends object>(data: T) => {
  const formData = new FormData();

  Object.entries(data as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null) {
          return;
        }
        if (isFileLike(item)) {
          formData.append(`${key}[]`, item);
          return;
        }
        if (typeof item === 'boolean') {
          formData.append(`${key}[]`, item ? '1' : '0');
          return;
        }
        if (typeof item === 'object') {
          formData.append(`${key}[]`, JSON.stringify(item));
          return;
        }
        formData.append(`${key}[]`, String(item));
      });
      return;
    }

    if (isFileLike(value)) {
      formData.append(key, value);
      return;
    }

    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
      return;
    }

    if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export const getAssetBaseUrl = () => API_BASE_URL.replace(/\/api\/?$/, '');

const isAbsoluteUrl = (value: string) =>
  /^https?:\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:');

export const resolveAssetUrl = (url?: string | null) => {
  if (!url) return '';
  if (isAbsoluteUrl(url)) return url;

  const base = getAssetBaseUrl();
  if (!base) return url;

  if (url.startsWith('/')) {
    return `${base}${url}`;
  }
  return `${base}/${url}`;
};
