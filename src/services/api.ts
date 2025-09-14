import axios from 'axios';
import { 
  AuthResponse, 
  PostsResponse, 
  PostResponse, 
  CategoriesResponse,
  CreatePostData,
  UpdatePostData,
  LoginData,
  RegisterData
} from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getAll: async (): Promise<PostsResponse> => {
    const response = await api.get<PostsResponse>('/posts');
    return response.data;
  },

  getById: async (id: number): Promise<PostResponse> => {
    const response = await api.get<PostResponse>(`/posts/${id}`);
    return response.data;
  },

  create: async (data: CreatePostData): Promise<PostResponse> => {
    const response = await api.post<PostResponse>('/posts', data);
    return response.data;
  },

  update: async (id: number, data: UpdatePostData): Promise<PostResponse> => {
    const response = await api.put<PostResponse>(`/posts/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<CategoriesResponse> => {
    const response = await api.get<CategoriesResponse>('/categories');
    return response.data;
  },
};

export default api;
