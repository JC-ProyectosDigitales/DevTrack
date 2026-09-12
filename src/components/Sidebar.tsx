"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

type SidebarProps = {
  userName: string;
  userEmail: string;
};

const navigationItems = [
  {
    label: "Dashboard",
    mobileLabel: "Inicio",
    href: "/",
  },
  {
    label: "Proyectos",
    mobileLabel: "Proyectos",
    href: "/projects",
  },
  {
    label: "Tareas",
    mobileLabel: "Tareas",
    href: "/tasks",
  },
  {
    label: "Mi perfil",
    mobileLabel: "Perfil",
    href: "/profile",
  },
];

export default function Sidebar({
  userName,
  userEmail,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] =
    useState(false);

  function isItemActive(href: string) {
    return (
      pathname === href ||
      (href !== "/" &&
        pathname.startsWith(`${href}/`))
    );
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      const response = await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        return;
      }

      router.push("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 p-6 md:flex">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            DevTrack
          </h1>

          <nav className="mt-10 space-y-2">
            {navigationItems.map((item) => {
              const isActive =
                isItemActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-3 text-sm transition ${
                    isActive
                      ? "bg-slate-800 font-medium text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-800 pt-5">
          <p className="truncate text-sm font-medium text-white">
            {userName}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {userEmail}
          </p>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-4 w-full rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingOut
              ? "Cerrando sesión..."
              : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-900/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 gap-1">
          {navigationItems.map((item) => {
            const isActive =
              isItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-2 py-3 text-center text-xs transition ${
                  isActive
                    ? "bg-slate-800 font-medium text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {item.mobileLabel}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}