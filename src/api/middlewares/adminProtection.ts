import { decrypt } from "@/lib/jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { userServices } from "../services/userServices";
import { User } from "@/types";

export default async function adminProtector(req: NextRequest) {
  const token = cookies().get("session")?.value;
  if (!token) return NextResponse.redirect(new URL("/auth", req.url));
  const decoded = await decrypt(token);
  if (!decoded) return NextResponse.redirect(new URL("/auth", req.url));

  const { userid } = decoded;
  if (userid) {
    const [users] = await userServices.getUserByUserid(userid as string);
    const user: User = users[0];
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.next();
    }
  } else {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}
