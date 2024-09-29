import { decrypt } from "@/lib/jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function authProtector(req: NextRequest) {
  const token = cookies().get("session")?.value;
  if (token) {
    const decoded = await decrypt(token);
    if (decoded) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.next();
    }
  } else {
    return NextResponse.next();
  }
}
