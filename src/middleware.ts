import { NextRequest, NextResponse } from "next/server";
import apiProtector from "./api/middlewares/apiProtection";
import pagesProtector from "./api/middlewares/pagesProtection";
import authProtector from "./api/middlewares/authProtection";

export default function middleware(req: NextRequest) {
  // Deklarasi variabel
  const url = req.nextUrl.pathname;
  // const arrayUrl = req.nextUrl.pathname.split("/");

  // Middleware validasi akses token ke api
  if (url.startsWith("/api/user")) {
    const apiProtection = apiProtector(req);
    if (apiProtection) {
      return apiProtection;
    }
  }

  // Middleware untuk melindungi halaman dari akses yang tidak diizinkan
  const authProtectedPages = ["dashboard"];
  if (url.split("/")[1] && authProtectedPages.includes(url.split("/")[1])) {
    const pagesProtection = pagesProtector(req);
    if (pagesProtection) {
      return pagesProtection;
    }
  }

  // Middleware untuk melindungi halaman dari user selain admin (GAGAL: tidak bisa fetch data ke database karena runtime tidak mendukung di server)
  // const adminProtectedPages = ["user-management"];
  // const filteredUrl: Array<string> = [];
  // adminProtectedPages.forEach((toProtect) => {
  //   if (arrayUrl.includes(toProtect)) {
  //     filteredUrl.push(toProtect);
  //   }
  // });
  // console.log(filteredUrl);
  // if (filteredUrl.length) {
  //   const adminProtection = adminProtector(req);
  //   if (adminProtection) {
  //     return adminProtection;
  //   }
  // }

  // Middleware untuk melindungi halaman auth jika sesi login sudah ada, maka halangi untuk membuat login lagi yang bisa beresiko menimbulkan bug dan error
  if (url.startsWith("/auth")) {
    const authProtection = authProtector(req);
    if (authProtection) {
      return authProtection;
    }
  }

  return NextResponse.next();
}
