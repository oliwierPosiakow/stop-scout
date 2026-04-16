// src/api/axiosAuth.ts
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useUserStore } from '../stores/userStore';

const apiClient = axios.create({
  baseURL: 'https://twoje-api.com/api',
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const userStore = useUserStore();

  if (userStore.token) {
    config.headers.set('Authorization', `Bearer ${userStore.token}`);
  }
  return config;
});

export default apiClient;
