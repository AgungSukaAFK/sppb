import { NextRequest, NextResponse } from "next/server";
import apiProtector from "./api/middlewares/apiProtection";
import pagesProtector from "./api/middlewares/pagesProtection";
import authProtector from "./api/middlewares/authProtection";
import jsonResponse from "./utils/jsonResponse";

export default async function middleware(req: NextRequest) {
  // Deklarasi variabel
  const url = req.nextUrl.pathname;
  // const arrayUrl = req.nextUrl.pathname.split("/");

  // Middleware validasi akses token ke api
  const protectedApiRoute = ["user", "pengajuan"];
  if (url.startsWith("/api/")) {
    if (protectedApiRoute.includes(url.split("/")[2])) {
      const apiProtection = await apiProtector(req);
      if (apiProtection) {
        return apiProtection;
      }
    }
  }

  // Middleware untuk melindungi halaman dari akses yang tidak diizinkan
  const authProtectedPages = ["dashboard"];
  if (url.split("/")[1] && authProtectedPages.includes(url.split("/")[1])) {
    const pagesProtection = await pagesProtector(req);
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
    const authProtection = await authProtector(req);
    if (authProtection) {
      return authProtection;
    }
  }

  // Middleware penangan json tidak sesuai, untuk method POST, PUT
  const methods: string[] = ["POST", "PUT"];
  if (methods.includes(req.method)) {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      let errorMessage = "Invalid JSON body";
      if (error instanceof Error || error instanceof SyntaxError) {
        errorMessage = error.message;
      }
      return jsonResponse(
        { message: "Invalid JSON body", error: errorMessage },
        400
      );
    }

    if (body) {
      return NextResponse.next();
    } else {
      return jsonResponse(
        { message: "Request body is empty", body: null },
        400
      );
    }
  }

  return NextResponse.next();
}
