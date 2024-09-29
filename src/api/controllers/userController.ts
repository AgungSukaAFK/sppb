import jsonResponse from "@/utils/jsonResponse";
import { userServices } from "../services/userServices";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/jose";

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
};
