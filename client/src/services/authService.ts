import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  login: (email: string, password: string) =>
    api
      .post<{
        success: boolean;
        message: string;
        data: AuthResponse;
      }>("/auth/login", { email, password })
      .then((r) => {
        const data = r.data.data;

        localStorage.setItem("avh_token", data.token);
        localStorage.setItem("avh_user", JSON.stringify(data.user));

        return data;
      }),

  register: (name: string, email: string, password: string) =>
    api
      .post<{
        success: boolean;
        message: string;
        data: AuthResponse;
      }>("/auth/register", { name, email, password })
      .then((r) => {
        const data = r.data.data;

        localStorage.setItem("avh_token", data.token);
        localStorage.setItem("avh_user", JSON.stringify(data.user));

        return data;
      }),

  me: () => api.get<User>("/auth/me").then((r) => r.data),

  logout: () => {
    localStorage.removeItem("avh_token");
    localStorage.removeItem("avh_user");

    return api.post("/auth/logout").catch(() => null);
  },
};