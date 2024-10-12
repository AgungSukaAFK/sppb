import { userController } from "@/api/controllers/userController";
import { userSettingController } from "@/api/controllers/userSettingController";
import { decrypt } from "@/lib/jose";
import DashbaordLayout from "@/pages/layout/dashboard/DasboardLayout";
import UserSettingView from "@/pages/view/userSetting/UserSettingView";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function SettingAkunPage() {
  const cookie = cookies().get("session");
  const decoded = await decrypt(cookie?.value);

  if (decoded) {
    // User role
    const res = await userController.getUserByUserid();
    const data = await res.json();
    const user = data.data;
    const userid = user.userid;
    const role = user.role;

    // User setting
    const userSettingData = await userSettingController.getByUserid(userid);
    const userSetting = userSettingData.preference;

    return (
      <DashbaordLayout pageTitle="Setting Akun" role={role}>
        <UserSettingView userSetting={userSetting} user={user} />
      </DashbaordLayout>
    );
  } else {
    return NextResponse.redirect("/auth");
  }
}
