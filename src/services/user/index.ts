import instance from "@/lib/axios";
import { User } from "@/types";

export const userServices = {
  whoAmI: async () => {
    return instance
      .get("/api/user/who")
      .then((res) => res.data)
      .catch((err) => err);
  },
  editNama: async (nama: string) => {
    return instance
      .put("/api/user", JSON.stringify({ action: "nama", data: nama }))
      .then((res) => {
        return { data: res.data, status: res.status };
      })
      .catch((err) => err);
  },
  editEmail: async (data: string) => {
    return instance
      .put("/api/user", JSON.stringify({ action: "email", data }))
      .then((res) => {
        return { data: res.data, status: res.status };
      })
      .catch((err) => err);
  },
  editPassword: async (oldPass: string, newPass: string) => {
    return instance
      .put(
        "/api/user",
        JSON.stringify({
          action: "password",
          data: { old: oldPass, new: newPass },
        })
      )
      .then((res) => {
        return { data: res.data, status: res.status };
      })
      .catch((err) => err);
  },
  editPhone: async (data: string) => {
    return instance
      .put("/api/user", JSON.stringify({ action: "phone", data }))
      .then((res) => {
        return { data: res.data, status: res.status };
      })
      .catch((err) => err);
  },
  // Semua fungsi di bawah ini only admin
  getUserById: async (userid: string) => {
    return instance
      .get(`/api/user/id/${userid}`)
      .then((res) => res.data)
      .catch((err) => err);
  },
  getAll: async (offset: number) => {
    return instance
      .get(`/api/user/all?offset=${offset}`)
      .then((res) => res.data)
      .catch((err) => err);
  },
  searchUser: async (propmt: string, offset: number) => {
    return instance
      .get(`/api/user/search?s=${propmt}&offset=${offset}`)
      .then((res) => res.data)
      .catch((err) => err);
  },
  createUser: async ({ userid, nama, role, password }: User) => {
    return instance
      .post(
        "/api/user/create",
        JSON.stringify({ userid, nama, role, password })
      )
      .then((res) => res)
      .catch((err) => err);
  },
  updateUser: async (data: User) => {
    return instance
      .put("/api/user/edit", JSON.stringify(data))
      .then((res) => res)
      .catch((err) => err);
  },
  deleteUser: async (userid: string) => {
    return instance
      .delete(`/api/user/delete?id=${userid}`)
      .then((res) => res)
      .catch((err) => err);
  },
};
