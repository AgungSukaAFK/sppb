import { decrypt } from "@/lib/jose";
import jsonResponse from "@/utils/jsonResponse";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.JWT_SECRET;
export default async function apiProtector(req: NextRequest) {
  try {
    if (!secret) {
      return jsonResponse(
        {
          message: "Server error: no secret provided",
        },
        500
      );
    }

    if (req.cookies) {
      const token = (cookies()).get("session")?.value;
      if (token) {
        const decoded = await decrypt(token).catch(() => {
          return NextResponse.redirect(new URL("/auth", req.url));
        });
        if (!decoded) {
          return NextResponse.redirect(new URL("/auth", req.url));
        } else {
          return NextResponse.next();
        }
      } else {
        return NextResponse.redirect(new URL("/auth", req.url));
      }
    } else {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/auth", req.url));
  }
}
