import { userServices } from "@/api/services/userServices";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await userServices.getUserByUserid("agunsg");
  return NextResponse.json({ message: "api", user });
}
