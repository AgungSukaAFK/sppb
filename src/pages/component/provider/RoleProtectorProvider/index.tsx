"use client";

// import { useLoading } from "@/hooks/useLoading";
import { userServices } from "@/services/user";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";

interface RoleProtectorProviderProps {
  children: ReactNode;
  toProtect: string;
}

export default function RoleProtectorProvider({
  children,
  toProtect,
}: RoleProtectorProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { push } = useRouter();
  // const { setLoading } = useLoading();

  useEffect(() => {
    async function getUser() {
      // setLoading(true);
      // Set loading sebelum memulai request
      try {
        const res = await userServices.whoAmI();
        if (res && res.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        // setLoading(false);
        setIsLoading(false);
        // Set isLoading setelah request selesai
      }
    }
    getUser();
  }, [setIsLoading]);

  useEffect(() => {
    if (user) {
      setRole(user.role);
    }
  }, [user]);

  useEffect(() => {
    // Pindahkan logika pengalihan ke useEffect ini
    if (!isLoading) {
      if (role !== toProtect && role !== null) {
        push("/dashboard");
      }
    }
  }, [isLoading, role, push, toProtect]); // Pastikan semua dependensi disertakan

  if (role === toProtect) {
    return <>{children}</>; // Jika role sesuai, kembalikan children
  }

  if (isLoading) {
    return <div>Loading</div>;
  }

  return <></>; // Jika tidak ada kondisi yang terpenuhi, tidak mengembalikan apa pun
}
