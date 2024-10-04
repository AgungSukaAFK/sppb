import type { Metadata } from "next";
import "./globals.css";
import "./root.scss";
import ThemeProvider from "@/pages/component/(provider)/ThemeProvider";
import { Inter } from "next/font/google";
import { LoadingProvider } from "@/context/LoadingContext";

const font = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
          rel="stylesheet"
        />
      </head>
      <body className={font.className}>
        <ThemeProvider defaultTheme="light">
          <LoadingProvider>{children}</LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
