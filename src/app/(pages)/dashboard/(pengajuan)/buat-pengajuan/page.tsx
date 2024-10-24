import { userController } from "@/api/controllers/userController";
import { decrypt } from "@/lib/jose";
import DashboardLayout from "@/pages/layout/dashboard/DashboardLayout";
import BpView from "@/pages/view/buatPengajuan/BpView";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export default async function BuatPengajuanPage() {
  const cookie = cookies().get("session");
  const decoded = await decrypt(cookie?.value);

  if (decoded) {
    // User role
    const res = await userController.getUserByUserid();
    const data = await res.json();
    const user = data.data;
    // const userid = user.userid;
    const role = user.role;

    return (
      <DashboardLayout pageTitle="Halaman Membuat Pengajuan" role={role}>
        <BpView />
      </DashboardLayout>
    );
  } else {
    return NextResponse.redirect("/auth");
  }
}
