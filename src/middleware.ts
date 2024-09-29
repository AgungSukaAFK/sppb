import { NextRequest, NextResponse } from "next/server";
import apiProtector from "./api/middlewares/apiProtection";
import pagesProtector from "./api/middlewares/pagesProtection";
import authProtector from "./api/middlewares/authProtection";

export default function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  if (url.startsWith("/api/user")) {
    const apiProtection = apiProtector(req);
    if (apiProtection) {
      return apiProtection;
    }
  }

  const protectedPages = ["dashboard"];
  if (url.split("/")[1] && protectedPages.includes(url.split("/")[1])) {
    const pagesProtection = pagesProtector(req);
    if (pagesProtection) {
      return pagesProtection;
    }
  }

  if (url.startsWith("/auth")) {
    const authProtection = authProtector(req);
    if (authProtection) {
      return authProtection;
    }
  }

  return NextResponse.next();
}
