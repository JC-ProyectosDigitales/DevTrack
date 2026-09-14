"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "devtrack-theme";
const THEME_CHANGE_EVENT = "devtrack-theme-change";

function getThemeFromDocument(): Theme {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.dataset.theme === "light"
    ? "light"
    : "dark";
}

function getServerTheme(): Theme {
  return "dark";
}

function subscribeToTheme(callback: () => void) {
  function handleThemeChange() {
    callback();
  }

  function handleStorage(event: StorageEvent) {
    if (event.key !== THEME_STORAGE_KEY) {
      return;
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    const nextTheme: Theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

    document.documentElement.dataset.theme = nextTheme;
    callback();
  }

  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    window.removeEventListener("storage", handleStorage);
  };
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getThemeFromDocument,
    getServerTheme,
  );

  function toggleTheme() {
    const nextTheme: Theme =
      theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;

    window.localStorage.setItem(
      THEME_STORAGE_KEY,
      nextTheme,
    );

    window.dispatchEvent(
      new Event(THEME_CHANGE_EVENT),
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        group
        flex h-10 w-10 items-center justify-center
        rounded-xl
        border border-border-app
        bg-surface
        text-text-secondary
        shadow-sm
        hover:border-accent
        hover:text-accent
        hover:shadow-[0_0_20px_var(--accent-soft)]
      "
      aria-label={
        isDark
          ? "Cambiar a tema claro"
          : "Cambiar a tema oscuro"
      }
      title={
        isDark
          ? "Cambiar a tema claro"
          : "Cambiar a tema oscuro"
      }
    >
      {isDark ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="4"
          />

          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}