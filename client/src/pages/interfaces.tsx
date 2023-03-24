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
}
export interface PostList {
  posts: Post[];
}

export interface newPost {
  title: string;
  content: string;
}
