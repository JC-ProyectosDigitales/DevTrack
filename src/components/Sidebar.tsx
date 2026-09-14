"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
} from "next/navigation";
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

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
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border-app bg-surface/90 p-6 backdrop-blur-xl md:flex">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <div className="brand-gradient-bg flex h-10 w-10 items-center justify-center rounded-xl shadow-[0_0_24px_var(--accent-soft)]">
              <span className="text-lg font-bold text-white">
                D
              </span>
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-text-primary">
                Dev
                <span className="brand-gradient">
                  Track
                </span>
              </h1>

              <p className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-text-muted">
                Workspace
              </p>
            </div>
          </Link>

          <nav className="mt-10 space-y-2">
            {navigationItems.map((item) => {
              const isActive =
                isItemActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative block overflow-hidden rounded-xl px-4 py-3 text-sm transition ${
                    isActive
                      ? "border border-accent/25 bg-[var(--accent-soft)] font-medium text-accent shadow-[0_0_24px_var(--accent-soft)]"
                      : "border border-transparent text-text-secondary hover:border-border-app hover:bg-surface-elevated hover:text-text-primary"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" />
                  )}

                  <span className="relative">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto">
          <div className="mb-4 rounded-2xl border border-border-app bg-surface-secondary p-4">
            <div className="flex items-center gap-3">
              <div className="brand-gradient-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white">
                {getInitials(userName)}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
                  {userName}
                </p>

                <p className="mt-0.5 truncate text-xs text-text-muted">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full rounded-xl border border-border-app bg-surface-secondary px-4 py-2.5 text-sm text-text-secondary hover:border-danger/30 hover:bg-[var(--danger-soft)] hover:text-danger disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingOut
              ? "Cerrando sesión..."
              : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border-app bg-surface/90 px-2 py-2 backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {navigationItems.map((item) => {
            const isActive =
              isItemActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-xl px-2 py-3 text-center text-xs transition ${
                  isActive
                    ? "bg-[var(--accent-soft)] font-medium text-accent"
                    : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-accent" />
                )}

                {item.mobileLabel}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}