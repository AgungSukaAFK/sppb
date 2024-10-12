import { cookies } from "next/headers";
import { userSettingServices } from "../services/userSettingServices";
import { decrypt } from "@/lib/jose";

export const userSettingController = {
  getByUserid: async (userid?: string) => {
    if (!userid) {
      const jwt = cookies().get("session")?.value;
      const decoded = await decrypt(jwt);
      if (decoded) {
        userid = decoded.userid as string;
      } else {
        return false;
      }
    }
    const table = await userSettingServices.getByUserid(userid);
    return table[0];
  },
  updateTheme: async (userid: string, theme: string) => {
    const table = await userSettingServices.updateTheme(userid, theme);
    return table;
  },
};
