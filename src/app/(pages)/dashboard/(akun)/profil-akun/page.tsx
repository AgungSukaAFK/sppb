import { userController } from "@/api/controllers/userController";
import { decrypt } from "@/lib/jose";
import DashbaordLayout from "@/pages/layout/dashboard/DashboardLayout";
import ProfilAkunView from "@/pages/view/profilAkun/ProfilAkunView";
import { User } from "@/types";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function ProfilAkunPage() {
  const cookie = cookies().get("session");
  const decoded = await decrypt(cookie?.value);

  if (decoded) {
    // User role
    const res = await userController.getUserByUserid();
    const data = await res.json();
    const user = data.data;

    return (
      <DashbaordLayout pageTitle="Setting Akun" role={user.role}>
        <ProfilAkunView user={user as User} />
      </DashbaordLayout>
    );
  } else {
    return NextResponse.redirect("/auth");
  }
}
