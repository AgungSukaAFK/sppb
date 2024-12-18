import type { Metadata } from "next";
import "./globals.css";
import "./root.scss";
import ThemeProvider from "@/pages/component/provider/ThemeProvider";
import { Inter } from "next/font/google";
import LoadingProvider from "@/context/LoadingContext";
// import { LoadingProvider } from "@/context/LoadingContext";

const font = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Sistem Pengajuan Pembelian Barang",
  description: "website untuk keperluan pengajuan pembelian barang (SPPB)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Sistem Pengajuan Pembelian Barang</title>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={font.className}>
        <LoadingProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
