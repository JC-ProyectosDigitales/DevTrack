import bcrypt from "bcryptjs";

import { db } from "@/prisma/db";

export async function POST(request: Request) {
  const body = await request.json();

  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : "";

  const password =
    typeof body.password === "string"
      ? body.password
      : "";

  if (!name || !email || !password) {
    return Response.json(
      {
        message: "Todos los campos son obligatorios.",
      },
      {
        status: 400,
      },
    );
  }

  if (password.length < 8) {
    return Response.json(
      {
        message: "La contraseña debe tener al menos 8 caracteres.",
      },
      {
        status: 400,
      },
    );
  }

  const existingUser = await db.orm.public.User.first({
    email,
  });

  if (existingUser) {
    return Response.json(
      {
        message: "Ya existe una cuenta con ese correo.",
      },
      {
        status: 409,
      },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.orm.public.User.create({
    name,
    email,
    passwordHash,
  });

  return Response.json(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    {
      status: 201,
    },
  );
}