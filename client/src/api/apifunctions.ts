import { CurrentUser } from "./../pages/index";
import { User } from "@/pages";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  withCredentials: true,
});

// Auth
export const checkAuth = async (): Promise<CurrentUser> =>
  api.get("/auth/isauthorized").then((res) => res.data);

export const login = (user: { username: string; password: string }) =>
  api.post("/auth/login", { ...user }).then((res) => console.log(res));

export const logOut = () => api.delete("/auth/logout").then((res) => res.data);

// Post

export const getPosts = async () =>
  await api.get("/post").then((res) => res.data);
