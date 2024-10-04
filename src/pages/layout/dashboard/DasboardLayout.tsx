"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import s from "./index.module.scss";
import { authServices } from "@/services/auth";
import { useLoading } from "@/hooks/useLoading";
import Button from "@/pages/component/Button";

interface DashbaordLayoutProps {
  children: ReactNode;
  pageTitle?: string;
  role?: "user" | "admin";
}

export default function DashbaordLayout({
  children,
  pageTitle = "Loading...",
  role = "user",
}: DashbaordLayoutProps) {
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  useEffect(() => {
    setPageUrl(window.location.pathname);
  }, []);

  const sidebarOptions = {
    user: [
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
            title: "Setting",
            url: "/dashboard/setting-akun",
            icon: "bx bx-cog",
          },
        ],
      },
    ],
    admin: [
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
            title: "User Management",
            url: "/dashboard/user-management",
            icon: "bx bxs-user-detail",
          },
          {
            title: "Setting",
            url: "/dashboard/setting-akun",
            icon: "bx bx-cog",
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
          {sidebarOptions[role] &&
            sidebarOptions[role].map((item, index) => {
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
                          <a
                            href={item.url}
                            key={index}
                            className={
                              pageUrl === item.url
                                ? s.sidebar__content__item__list__active
                                : ""
                            }
                          >
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
            <Button type="primary" onClick={logout}>
              Logout
            </Button>
            <div>v1.0</div>
          </div>
        </div>
        <div className={s.content}>
          <div className={s.content__header}>
            <div className={s.content__header__title}>{pageTitle}</div>
            <div className="gap-2 text-xs hidden sm:flex">
              {/* Breadcrumbs */}
              {pageUrl?.split("/").map((item, index, arr) => {
                if (item == "") {
                  return;
                } else if (index === arr.length - 1) {
                  return <div key={index}>{item}</div>;
                } else {
                  return (
                    <a
                      href={`/${item}`}
                      key={index}
                      className="text-blue-600 flex gap-2"
                    >
                      {item} <span>/</span>
                    </a>
                  );
                }
              })}
            </div>
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
