import { getSession } from "@/lib/auth";
import { db } from "@/prisma/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
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

  const { id } = await context.params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    return Response.json(
      {
        message: "El identificador del proyecto no es válido.",
      },
      {
        status: 400,
      },
    );
  }

  const project = await db.orm.public.Project
    .where({
      id: projectId,
      ownerId: session.userId,
    })
    .first();

  if (!project) {
    return Response.json(
      {
        message: "Proyecto no encontrado.",
      },
      {
        status: 404,
      },
    );
  }

  const body = await request.json();

  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : "";

  if (!name || !description) {
    return Response.json(
      {
        message:
          "El nombre y la descripción son obligatorios.",
      },
      {
        status: 400,
      },
    );
  }

  const updatedProject = await db.orm.public.Project
    .where({
      id: project.id,
      ownerId: session.userId,
    })
    .update({
      name,
      description,
    });

  return Response.json(updatedProject);
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
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

  const { id } = await context.params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    return Response.json(
      {
        message: "El identificador del proyecto no es válido.",
      },
      {
        status: 400,
      },
    );
  }

  const project = await db.orm.public.Project
    .where({
      id: projectId,
      ownerId: session.userId,
    })
    .first();

  if (!project) {
    return Response.json(
      {
        message: "Proyecto no encontrado.",
      },
      {
        status: 404,
      },
    );
  }

  const projectTasks = await db.orm.public.Task
    .where({
      projectId: project.id,
    })
    .all();

  if (projectTasks.length > 0) {
    return Response.json(
      {
        message:
          "No puedes eliminar un proyecto que todavía tiene tareas asociadas.",
      },
      {
        status: 409,
      },
    );
  }

  await db.orm.public.Project
    .where({
      id: project.id,
      ownerId: session.userId,
    })
    .delete();

  return Response.json({
    message: "Proyecto eliminado correctamente.",
  });
}