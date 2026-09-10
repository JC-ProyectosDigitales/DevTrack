import { redirectIfAuthenticated } from "@/lib/auth";

type RegisterLayoutProps = {
  children: React.ReactNode;
};

export default async function RegisterLayout({
  children,
}: RegisterLayoutProps) {
  await redirectIfAuthenticated();

  return children;
}