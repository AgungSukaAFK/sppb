import jsonResponse from "@/utils/jsonResponse";
import { userServices } from "../services/userServices";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/jose";
import { User } from "@/types";

async function checkToken(tokenName: string) {
  const token = cookies().get(tokenName)?.value;
  const decoded = await decrypt(token);
  if (decoded) {
    return decoded;
  } else {
    return false;
  }
}

export const userController = {
  getUserByUserid: async () => {
    const token = cookies().get("session")?.value;
    const decoded = await decrypt(token);
    if (decoded) {
      const userid = decoded.userid as string;
      const user = await userServices.getUserByUserid(userid);
      if (user.length) {
        delete user[0].password;
        return jsonResponse({
          message: "User found",
          data: user[0],
        });
      } else {
        return jsonResponse(
          {
            message: "User not found",
            data: null,
          },
          404
        );
      }
    } else {
      return jsonResponse({
        message: "Unauthorized token",
      });
    }
  },
  getAllUser: async (offset: number) => {
    try {
      const decoded = await checkToken("session");
      if (decoded) {
        const users = await userServices.getUserByUserid(
          decoded.userid as string
        );
        const user: User = users[0];
        if (user.role !== "admin") {
          return jsonResponse(
            {
              messaeg: "Illegal access",
            },
            400
          );
        } else {
          const allUser = await userServices.getAllUser(offset);
          return jsonResponse({
            message: "User found",
            data: allUser,
          });
        }
      } else {
        return jsonResponse({
          message: "Unauthorized token",
        });
      }
    } catch (err) {
      console.log(err);
      return jsonResponse(
        {
          message: "Something error",
          err,
        },
        500
      );
    }
  },
  searchUser: async (searchQuery: string, offset: number) => {
    try {
      if (!searchQuery) {
        return jsonResponse(
          {
            message: "No query provided",
            data: null,
          },
          400
        );
      }
      const decoded = await checkToken("session");
      if (decoded) {
        const users = await userServices.getUserByUserid(
          decoded.userid as string
        );
        const user: User = users[0];
        if (user.role !== "admin") {
          return jsonResponse(
            {
              messaeg: "Illegal access",
            },
            400
          );
        } else {
          const allUser = await userServices.searchUser(searchQuery, offset);

          return jsonResponse({
            message: "User found",
            data: allUser,
          });
        }
      } else {
        return jsonResponse({
          message: "Unauthorized token",
        });
      }
    } catch (error) {
      console.log(error);
      return jsonResponse(
        {
          message: "Something error",
          err: error,
        },
        500
      );
    }
  },
};
