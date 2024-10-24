import { decrypt } from "@/lib/jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export default async function pagesProtector(req: NextRequest) {
  const token = cookies().get("session")?.value;
  if (token) {
    const decoded = await decrypt(token);
    if (decoded) {
      return null;
    } else {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  } else {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}
