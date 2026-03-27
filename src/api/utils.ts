import type { ApiPaginated } from './types';

export const unwrapList = <T,>(payload: T[] | ApiPaginated<T>) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  return payload.data ?? [];
};

const isFileLike = (value: unknown): value is File | Blob =>
  value instanceof File || value instanceof Blob;

export const toFormData = (data: Record<string, unknown>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
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

    if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};
