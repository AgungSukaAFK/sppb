import { decrypt, encrypt } from "@/lib/jose";
import jsonResponse from "@/utils/jsonResponse";
import { cookies } from "next/headers";
import { userServices } from "../services/userServices";

const secret = process.env.JWT_SECRET;

export const authController = {
  login: async ({ userid, password }: { userid: string; password: string }) => {
    /*
    0. Cek jika sudah login langsung alihkan ke dashboard
    1. validasi user & password
    2. generate access-token dalam cookies
    3. return access-token
    */
    const token = cookies().get("session")?.value as string;
    const decoded = await decrypt(token);
    if (decoded) {
      return jsonResponse(
        { message: "Sudah ada sesi login, logout dulu" },
        400
      );
    }
    if (!secret) {
      return jsonResponse({ message: "Server error: no secret provided" }, 500);
    }
    if (!userid) {
      return jsonResponse({ message: "userid is required" }, 400);
    }
    if (!password) {
      return jsonResponse({ message: "Password is required" }, 400);
    }

    const data = await userServices.getPasswordByUserid(userid);
    if (data.length) {
      const user = data[0];
      if (user.password === password) {
        const session = await encrypt({ userid, exp: 60 * 60 * 2 });
        cookies().set("session", session, {
          maxAge: 60 * 60 * 2, // 2 jam
        });
        return jsonResponse({
          message: "Login berhasil",
          session,
        });
      } else {
        return jsonResponse({ message: "Invalid credentials" }, 400);
      }
    } else {
      return jsonResponse({ message: "User tidak ditemukan" }, 400);
    }
  },
  logout: async () => {
    try {
      const token = cookies().get("session")?.value;
      if (token) {
        cookies().delete("session");
        return jsonResponse({
          message: "Logout success",
        });
      } else {
        return jsonResponse(
          {
            message: "Tidak ada login",
          },
          400
        );
      }
    } catch (err) {
      return jsonResponse(
        {
          message: "Internal server error",
          error: err,
        },
        500
      );
    }
  },
};
