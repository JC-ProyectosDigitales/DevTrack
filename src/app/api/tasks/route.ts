import { db } from "@/prisma/db";

export async function GET() {
  const tasks = await db.orm.public.Task.include("project").all();

  return Response.json(tasks);
}

export async function POST(request: Request) {
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

  const task = await db.orm.public.Task.create({
    title,
    status,
    priority,
    dueDate,
    project: (project) =>
      project.connect({
        id: projectId,
      }),
  });

  return Response.json(task, {
    status: 201,
  });
}