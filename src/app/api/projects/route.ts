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

  return Response.json(projects);
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

  const user = await db.orm.public.User.first({
    id: session.userId,
  });

  if (!user) {
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

  const project = await db.orm.public.Project.create({
    name,
    description,
    ownerId: user.id,
  });

  return Response.json(project, {
    status: 201,
  });
}