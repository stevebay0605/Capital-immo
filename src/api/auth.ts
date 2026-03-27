import api, { setAuthToken } from './client';
import type { ApiLoginResponse, ApiUser } from './types';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export const login = async (payload: LoginPayload) => {
  const response = await api.post<ApiLoginResponse>('/login', payload);
  setAuthToken(response.data.token);
  return response.data;
};

export const logout = async () => {
  const response = await api.post<{ message: string }>('/logout');
  setAuthToken(null);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get<{ user: ApiUser }>('/me');
  return response.data;
};

export const refreshToken = async () => {
  const response = await api.post<{ token: string }>('/refresh');
  setAuthToken(response.data.token);
  return response.data;
};

export const changePassword = async (payload: ChangePasswordPayload) => {
  const response = await api.post<{ message: string }>('/change-password', payload);
  return response.data;
};
