import bcrypt from "bcryptjs";

import { createSession } from "@/lib/auth";
import { db } from "@/prisma/db";

export async function POST(request: Request) {
  const body = await request.json();

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  if (!email || !password) {
    return Response.json(
      {
        message:
          "Correo y contraseña son obligatorios.",
      },
      {
        status: 400,
      },
    );
  }

  const user =
    await db.orm.public.User.first({
      email,
    });

  if (!user) {
    return Response.json(
      {
        message:
          "Correo o contraseña incorrectos.",
      },
      {
        status: 401,
      },
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      password,
      user.passwordHash,
    );

  if (!passwordMatches) {
    return Response.json(
      {
        message:
          "Correo o contraseña incorrectos.",
      },
      {
        status: 401,
      },
    );
  }

  await createSession(user.id);

  return Response.json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
}