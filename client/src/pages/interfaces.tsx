export interface User {
  username: string;
  password: string;
}

export interface CurrentUser {
  id: number;
  username: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
  createdAt?: string;
  author?: {
    username?: string;
  };
}

export interface newPost {
  title: string;
  content: string;
}
