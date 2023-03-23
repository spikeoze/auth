import { User } from "@/pages";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  withCredentials: true,
});

export const checkAuth = async ():Promise<User> => {
  const res = await api.get("/auth/isauthorized");
  if (res.status === 401) {
    throw new Error("Unauthorized");
  }

  return res.data
};

export const login = (user: { username: string; password: string }) =>
  api.post("/auth/login", { ...user }).then((res) => console.log(res));

export const logOut = () => api.delete("/auth/logout").then((res) => res.data);
