import { getSession } from "@/lib/auth";
import { validateTaskInput } from "@/lib/task-validation";
import { db } from "@/prisma/db";

export async function GET() {
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

  const projects = await db.orm.public.Project
    .where({
      ownerId: session.userId,
    })
    .all();

  const projectIds = projects.map(
    (project) => project.id,
  );

  const allTasks = await db.orm.public.Task.all();

  const tasks = allTasks.filter((task) =>
    projectIds.includes(task.projectId),
  );

  return Response.json(tasks);
}

export async function POST(request: Request) {
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

  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return Response.json(
      {
        message: "Solicitud no válida.",
      },
      {
        status: 400,
      },
    );
  }

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

  const project = await db.orm.public.Project
    .where({
      id: taskInput.projectId,
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

  const task = await db.orm.public.Task.create({
    title: taskInput.title,
    status: taskInput.status,
    priority: taskInput.priority,
    dueDate: taskInput.dueDate,
    projectId: project.id,
  });

  return Response.json(task, {
    status: 201,
  });
}