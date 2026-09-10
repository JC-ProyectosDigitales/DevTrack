import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/prisma/db";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET no está configurado.");
}

const encodedSecret = new TextEncoder().encode(secret);

type SessionPayload = {
  userId: number;
};

export async function createSession(userId: number) {
  const token = await new SignJWT({
    userId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedSecret);

  const cookieStore = await cookies();

  cookieStore.set("devtrack_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("devtrack_session")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      encodedSecret,
    );

    if (typeof payload.userId !== "number") {
      return null;
    }

    return {
      userId: payload.userId,
    };
  } catch {
    return null;
  }
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