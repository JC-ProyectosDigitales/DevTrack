import bcrypt from "bcryptjs";

import { getSession } from "@/lib/auth";
import { db } from "@/prisma/db";

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      {
        message: "No autorizado.",
      },
      {
        status: 401,
      },
    );
  }

  const body = await request.json();

  const currentPassword =
    typeof body.currentPassword === "string"
      ? body.currentPassword
      : "";

  const newPassword =
    typeof body.newPassword === "string"
      ? body.newPassword
      : "";

  if (!currentPassword || !newPassword) {
    return Response.json(
      {
        message: "Completa ambos campos de contraseña.",
      },
      {
        status: 400,
      },
    );
  }

  if (newPassword.length < 8) {
    return Response.json(
      {
        message: "La nueva contraseña debe tener al menos 8 caracteres.",
      },
      {
        status: 400,
      },
    );
  }

  const user = await db.orm.public.User.first({
    id: session.userId,
  });

  if (!user) {
    return Response.json(
      {
        message: "Usuario no encontrado.",
      },
      {
        status: 404,
      },
    );
  }

  const passwordMatches = await bcrypt.compare(
    currentPassword,
    user.passwordHash,
  );

  if (!passwordMatches) {
    return Response.json(
      {
        message: "La contraseña actual es incorrecta.",
      },
      {
        status: 401,
      },
    );
  }

  const passwordHash = await bcrypt.hash(
    newPassword,
    12,
  );

  const updatedUser = await db.orm.public.User
    .where({
      id: user.id,
    })
    .update({
      passwordHash,
    });

  if (!updatedUser) {
    return Response.json(
      {
        message: "No se pudo actualizar la contraseña.",
      },
      {
        status: 500,
      },
    );
  }

  return Response.json({
    message: "Contraseña actualizada correctamente.",
  });
}