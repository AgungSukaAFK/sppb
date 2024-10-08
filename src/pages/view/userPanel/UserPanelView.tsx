"use client";

import { useLoading } from "@/hooks/useLoading";
import Section from "@/pages/component/Section";
import DashbaordLayout from "@/pages/layout/dashboard/DasboardLayout";
import { userServices } from "@/services/user";
import { User } from "@/types";
import { useEffect, useState } from "react";
import s from "./index.module.scss";

export default function UserPanelView() {
  const [user, setUser] = useState<User | null>(null);
  const { showLoading, closeLoading } = useLoading();

  useEffect(() => {
    showLoading();
    async function getUser() {
      const user = await userServices.whoAmI();
      if (user && user.data) {
        const realUser: User = user.data;
        realUser.date_created = new Date(
          realUser.date_created as string
        ).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        setUser(realUser);
      } else {
        window.location.href = "/home";
      }
      closeLoading();
    }

    getUser();
  }, [closeLoading, showLoading]);

  return (
    <DashbaordLayout pageTitle="Dashboard" role={user?.role}>
      {/* Section: greetings & user's data */}
      {user && (
        <Section header={`Selamat datang, ${user.nama}!`} className={s.dash}>
          <div className={s.dash__wrapper}>
            {Object.entries(user).map((item, index) => {
              return (
                <div key={index} className={s.dash__wrapper__item}>
                  <span>{item[0]}</span>
                  <p>{item[1]}</p>
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </DashbaordLayout>
  );
}
