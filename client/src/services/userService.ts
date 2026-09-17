import api from "./api";
import type { User } from "./authService";

export const userService = {
  update: (data: Partial<User>) => api.patch<User>("/users/me", data).then((r) => r.data),
  updateAvatar: (file: File) => {
    const form = new FormData();
    form.append("avatar", file);
    return api
      .patch<User>("/users/me/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },
  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/users/me/password", { currentPassword, newPassword }).then((r) => r.data),
  deleteHistory: () => api.delete("/users/me/history").then((r) => r.data),
};
