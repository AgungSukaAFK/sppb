import instance from "@/lib/axios";

export const userServices = {
  whoAmI: async () => {
    return instance
      .get("/api/user/who")
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
};
