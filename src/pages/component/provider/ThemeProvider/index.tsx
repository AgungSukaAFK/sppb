"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export default function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // cek apakah di local storage ada theme
  // jika ada, ambil dari local storage
  // jika tidak, ambil dari database user theme preference
  // jika tidak ada juga, ambil default light
  // Setiap user mengganti tema, simpan ke local storage juga
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
}
