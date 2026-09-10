import { getSession } from "@/lib/auth";
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

  const task = await db.orm.public.Task.create({
    title,
    status,
    priority,
    dueDate,
    projectId: project.id,
  });

  return Response.json(task, {
    status: 201,
  });
}