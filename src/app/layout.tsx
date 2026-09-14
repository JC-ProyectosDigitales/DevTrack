import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dev-track-nine-delta.vercel.app"),
  title: {
    default: "DevTrack",
    template: "%s | DevTrack",
  },
  description:
    "Aplicación full-stack para la gestión de proyectos y tareas, con autenticación, control de acceso y seguimiento de actividades.",
  applicationName: "DevTrack",
  authors: [
    {
      name: "Diego de Jesús Castillo Andrade",
    },
  ],
  creator: "Diego de Jesús Castillo Andrade",
  keywords: [
    "DevTrack",
    "gestión de proyectos",
    "gestión de tareas",
    "Next.js",
    "React",
    "TypeScript",
    "Prisma",
    "PostgreSQL",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "DevTrack",
    description:
      "Aplicación full-stack para la gestión de proyectos y tareas.",
    url: "/",
    type: "website",
    locale: "es_MX",
    siteName: "DevTrack",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

const themeScript = `
(function () {
  try {
    var savedTheme = localStorage.getItem("devtrack-theme");
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : systemDark
          ? "dark"
          : "light";

    document.documentElement.dataset.theme = theme;
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript,
          }}
        />
      </head>

      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}