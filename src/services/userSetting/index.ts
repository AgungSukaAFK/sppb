import instance from "@/lib/axios";

export const userSetting = {
  getSettings: async () => {
    return instance
      .get("/api/user/setting")
      .then((res) => res.data)
      .catch((err) => err);
  },
};
