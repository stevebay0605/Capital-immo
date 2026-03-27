import api from './client';
import type { ApiDashboardActivity, ApiDashboardCharts, ApiDashboardStats } from './types';

export const getDashboardStats = async () => {
  const response = await api.get<ApiDashboardStats>('/dashboard/stats');
  return response.data;
};

export const getDashboardActivity = async () => {
  const response = await api.get<ApiDashboardActivity>('/dashboard/activity');
  return response.data;
};

export const getDashboardCharts = async () => {
  const response = await api.get<ApiDashboardCharts>('/dashboard/charts');
  return response.data;
};
