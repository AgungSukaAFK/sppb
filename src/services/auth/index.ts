import instance from "@/lib/axios";

export const authServices = {
  loginUser: async ({
    userid,
    password,
  }: {
    userid: string;
    password: string;
  }) => {
    return instance
      .post("/api/auth/login", JSON.stringify({ userid, password }))
      .then((res) => {
        return {
          success: true,
          status: res.status,
          data: res.data,
          error: null,
        };
      })
      .catch((err) => {
        return {
          success: false,
          status: 500,
          data: false,
          error: err,
        };
      });
  },
  logoutUser: async () => {
    return instance
      .get("/api/auth/logout")
      .then((res) => {
        return {
          success: true,
          status: res.status,
          data: res.data,
          error: null,
        };
      })
      .catch((err) => {
        return {
          success: false,
          data: false,
          error: err,
        };
      });
  },
};
