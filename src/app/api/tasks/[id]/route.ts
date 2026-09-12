import { getSession } from "@/lib/auth";
import { validateTaskInput } from "@/lib/task-validation";
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

  const taskInput = validateTaskInput({
    title: body.title,
    status: body.status,
    priority: body.priority,
    dueDate: body.dueDate,
    projectId: body.projectId,
  });

  if (!taskInput) {
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
      id: taskInput.projectId,
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
      title: taskInput.title,
      status: taskInput.status,
      priority: taskInput.priority,
      dueDate: taskInput.dueDate,
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