export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string | null;
  user_id: number;
  category_id: number;
  is_active: 'Yes' | 'No';
  created_at: string;
  updated_at: string;
  user: User;
  category: Category;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface PostsResponse {
  posts: Post[];
}

export interface PostResponse {
  post: Post;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface CreatePostData {
  title: string;
  content: string;
  category_id: number;
  is_active: 'Yes' | 'No';
}

export interface UpdatePostData extends CreatePostData {}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
