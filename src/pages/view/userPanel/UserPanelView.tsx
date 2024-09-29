"use client";

import { useLoading } from "@/hooks/useLoading";
import Section, { CtaType } from "@/pages/component/Section";
import DashbaordLayout from "@/pages/layout/dashboard/DasboardLayout";
import { userServices } from "@/services/user";
import { User } from "@/types";
import { useEffect, useState } from "react";

export default function UserPanelView() {
  const [user, setUser] = useState<User | null>(null);
  const { setLoading } = useLoading();

  useEffect(() => {
    setLoading(true);
    async function getUser() {
      const user: any = await userServices.whoAmI();
      if (user) {
        setUser(user.data);
        console.log(user.data);
      } else {
        window.location.href = "/home";
      }
      setLoading(false);
    }

    getUser();
  }, []);

  const cta: CtaType = [
    {
      text: "Anjay",
      onClick: () => {},
      type: "primary",
    },
  ];
  return (
    <DashbaordLayout>
      {user && (
        <Section header={`Selamat datang, ${user.nama}!`}>Hello world</Section>
      )}
    </DashbaordLayout>
  );
}
