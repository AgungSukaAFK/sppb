"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import { authServices } from "@/services/auth";
import { useLoading } from "@/hooks/useLoading";

interface DashbaordLayoutProps {
  children: ReactNode;
}

export default function DashbaordLayout({ children }: DashbaordLayoutProps) {
  const sidebarOptions = {
    member: [
      { title: "Dashboard", url: "/dashboard", icon: "bx bx-home" },
      {
        title: "Pengajuan",
        url: "#",
        icon: "bx bxs-shopping-bags",
        subOption: [
          {
            title: "Buat",
            url: "/dashboard/buat-pengajuan",
            icon: "bx bx-add-to-queue",
          },
          {
            title: "Riwayat",
            url: "/dashboard/riwayat-pengajuan",
            icon: "bx bx-history",
          },
        ],
      },
      {
        title: "Akun",
        url: "#",
        icon: "bx bxs-user-account",
        subOption: [
          {
            title: "Profil",
            url: "/dashboard/profil-akun",
            icon: "bx bx-edit",
          },
          {
            title: "Logout",
            url: "/auth/logout",
            icon: "bx bx-log-out",
          },
        ],
      },
    ],
  };
  //   Sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const sideRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      setSidebarOpen(false);
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
      }
    }

    function hideSidebar(e: MouseEvent) {
      if (
        sidebarOpen &&
        isMobile &&
        sideRef.current &&
        !sideRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("resize", handleResize); // Listen for window resize
    document.addEventListener("click", hideSidebar); // Listen for document clicks

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", hideSidebar);
    };
  }, [sidebarOpen, isMobile]);

  // Navbar
  const { setLoading } = useLoading();
  async function logout() {
    try {
      setLoading(true);
      const res = await authServices.logoutUser();
      if (res) {
        window.location.href = "/auth";
      } else {
        console.log("Error logout");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={s.c}>
      {/* Sidebar */}
      <div
        className={`${s.sidebar} ${!sidebarOpen && s.sidebar__hide}`}
        ref={sideRef}
      >
        <div className={s.sidebar__logo}>Logo</div>
        <div className={s.sidebar__content}>
          {/* Mapping option */}
          {sidebarOptions.member.map((item, index) => {
            if (item.subOption) {
              return (
                <div key={index} className={s.sidebar__content__item}>
                  <div className={s.sidebar__content__item__header}>
                    <i className={item.icon}></i>
                    {item.title}
                  </div>
                  <div className={s.sidebar__content__item__list}>
                    {item.subOption.map((item, index) => {
                      return (
                        <a href={item.url} key={index}>
                          <i className={item.icon}></i> {item.title}
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              return (
                <a
                  href={item.url}
                  key={index}
                  className={s.sidebar__content__item}
                >
                  <div className={s.sidebar__content__item__header}>
                    <i className={item.icon}></i>
                    {item.title}
                  </div>
                </a>
              );
            }
          })}
        </div>
      </div>

      {/* Main */}
      <main className={s.main}>
        <div className={s.navbar}>
          <div className={s.navbar__left}>
            <i
              className="bx bx-menu"
              onClick={() => setSidebarOpen((prev) => !prev)}
            ></i>
          </div>
          <div className={s.navbar__right}>
            <button onClick={logout}>Logout</button>
            <div>v1.0</div>
          </div>
        </div>
        <div className={s.content}>
          <div className={s.content__header}>
            <div className={s.content__header__title}>Dashboard</div>
          </div>
          <div className={s.content__body}>
            {/* Sections */}
            {children}
          </div>
        </div>
        <div className={s.footer}>Footer</div>
      </main>
    </div>
  );
}