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

  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  if (!name) {
    return Response.json(
      {
        message: "El nombre es obligatorio.",
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

  const updatedUser = await db.orm.public.User
    .where({
      id: user.id,
    })
    .update({
      name,
    });

  if (!updatedUser) {
    return Response.json(
      {
        message: "No se pudo actualizar el usuario.",
      },
      {
        status: 500,
      },
    );
  }

  return Response.json({
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
  });
}