import { redirectIfAuthenticated } from "@/lib/auth";

type LoginLayoutProps = {
  children: React.ReactNode;
};

export default async function LoginLayout({
  children,
}: LoginLayoutProps) {
  await redirectIfAuthenticated();

  return children;
}