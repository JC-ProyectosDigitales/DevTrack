import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createSessionToken,
  verifySessionToken,
} from "@/lib/session";
import { db } from "@/prisma/db";

export async function createSession(userId: number) {
  const token = await createSessionToken(userId);

  const cookieStore = await cookies();

  cookieStore.set("devtrack_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("devtrack_session")?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function requireUser() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await db.orm.public.User.first({
    id: session.userId,
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function redirectIfAuthenticated() {
  const session = await getSession();

  if (!session) {
    return;
  }

  const user = await db.orm.public.User.first({
    id: session.userId,
  });

  if (user) {
    redirect("/");
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete("devtrack_session");
}