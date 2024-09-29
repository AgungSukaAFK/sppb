import instance from "@/lib/axios";

export const userServices = {
  whoAmI: async () => {
    return instance
      .get("/api/user/who")
      .then((res) => res.data)
      .catch((err) => err);
  },
};
