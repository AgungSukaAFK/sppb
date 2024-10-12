import { userSettingController } from "@/api/controllers/userSettingController";
import jsonResponse from "@/utils/jsonResponse";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await userSettingController.getByUserid();
    if (res) {
      return jsonResponse({ data: res.preference });
    } else {
      return NextResponse.redirect("/auth");
    }
  } catch (err) {
    console.log(err);
    return jsonResponse({ message: "Something error" }, 500);
  }
}
