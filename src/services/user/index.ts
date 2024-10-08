import instance from "@/lib/axios";
import { User } from "@/types";

export const userServices = {
  whoAmI: async () => {
    return instance
      .get("/api/user/who")
      .then((res) => res.data)
      .catch((err) => err);
  },
  getUserById: async (userid: string) => {
    // Admin only
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
