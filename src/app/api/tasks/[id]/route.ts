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
  const taskId = Number(id);

  if (!Number.isInteger(taskId)) {
    return Response.json(
      {
        message: "El identificador de la tarea no es válido.",
      },
      {
        status: 400,
      },
    );
  }

  const task = await db.orm.public.Task.first({
    id: taskId,
  });

  if (!task) {
    return Response.json(
      {
        message: "Tarea no encontrada.",
      },
      {
        status: 404,
      },
    );
  }

  const currentProject = await db.orm.public.Project
    .where({
      id: task.projectId,
      ownerId: session.userId,
    })
    .first();

  if (!currentProject) {
    return Response.json(
      {
        message: "Tarea no encontrada.",
      },
      {
        status: 404,
      },
    );
  }

  const body = await request.json();

  const title =
    typeof body.title === "string"
      ? body.title.trim()
      : "";

  const status =
    typeof body.status === "string"
      ? body.status
      : "";

  const priority =
    typeof body.priority === "string"
      ? body.priority
      : "";

  const dueDate =
    typeof body.dueDate === "string"
      ? body.dueDate
      : "";

  const projectId = Number(body.projectId);

  if (
    !title ||
    !status ||
    !priority ||
    !dueDate ||
    !Number.isInteger(projectId)
  ) {
    return Response.json(
      {
        message: "Los datos de la tarea no son válidos.",
      },
      {
        status: 400,
      },
    );
  }

  const targetProject = await db.orm.public.Project
    .where({
      id: projectId,
      ownerId: session.userId,
    })
    .first();

  if (!targetProject) {
    return Response.json(
      {
        message: "Proyecto no encontrado.",
      },
      {
        status: 404,
      },
    );
  }

  const updatedTask = await db.orm.public.Task
    .where({
      id: task.id,
    })
    .update({
      title,
      status,
      priority,
      dueDate,
      projectId: targetProject.id,
    });

  return Response.json(updatedTask);
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
  const taskId = Number(id);

  if (!Number.isInteger(taskId)) {
    return Response.json(
      {
        message: "El identificador de la tarea no es válido.",
      },
      {
        status: 400,
      },
    );
  }

  const task = await db.orm.public.Task.first({
    id: taskId,
  });

  if (!task) {
    return Response.json(
      {
        message: "Tarea no encontrada.",
      },
      {
        status: 404,
      },
    );
  }

  const project = await db.orm.public.Project
    .where({
      id: task.projectId,
      ownerId: session.userId,
    })
    .first();

  if (!project) {
    return Response.json(
      {
        message: "Tarea no encontrada.",
      },
      {
        status: 404,
      },
    );
  }

  await db.orm.public.Task
    .where({
      id: task.id,
    })
    .delete();

  return Response.json({
    message: "Tarea eliminada correctamente.",
  });
}