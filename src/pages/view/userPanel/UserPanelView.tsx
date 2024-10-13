"use client";

import { useLoading } from "@/hooks/useLoading";
import Section, { CtaType } from "@/pages/component/Section";
import DashbaordLayout from "@/pages/layout/dashboard/DashboardLayout";
import { userServices } from "@/services/user";
import { User } from "@/types";
import { useEffect, useState } from "react";
import s from "./index.module.scss";
import { useRouter } from "next/navigation";

export default function UserPanelView() {
  const [user, setUser] = useState<User | null>(null);
  const { showLoading, closeLoading } = useLoading();

  useEffect(() => {
    showLoading();
    async function getUser() {
      const user = await userServices.whoAmI();
      if (user && user.data) {
        const realUser: User = user.data;
        realUser["date created"] = new Date(
          realUser.date_created as string
        ).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        delete realUser.date_created;
        setUser(realUser);
      } else {
        window.location.href = "/home";
      }
      closeLoading();
    }

    getUser();
  }, [closeLoading, showLoading]);
  const { push } = useRouter();
  const cta: CtaType = [
    {
      type: "primary",
      text: "Edit Profile",
      onClick: () => {
        push("/dashboard/profil-akun");
      },
    },
  ];

  return (
    <DashbaordLayout pageTitle="Dashboard" role={user?.role}>
      {/* Section: greetings & user's data */}
      {user && (
        <Section
          header={`Selamat datang, ${user.nama}!`}
          className={s.dash}
          cta={cta}
        >
          <div className={s.dash__wrapper}>
            {Object.entries(user).map((item, index) => {
              return (
                <div key={index} className={s.dash__wrapper__item}>
                  <span>{item[0]}</span>
                  {item[1] ? <p>{item[1]}</p> : <em>unset</em>}
                </div>
              );
            })}
          </div>
        </Section>
      )}
    </DashbaordLayout>
  );
}
