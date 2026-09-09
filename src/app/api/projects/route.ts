import { db } from "@/prisma/db";

export async function GET() {
  const projects = await db.orm.public.Project.all();

  return Response.json(projects);
}

export async function POST(request: Request) {
  const body = await request.json();

  const name =
    typeof body.name === "string" ? body.name.trim() : "";

  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : "";

  if (!name || !description) {
    return Response.json(
      {
        message: "El nombre y la descripción son obligatorios.",
      },
      {
        status: 400,
      },
    );
  }

  const project = await db.orm.public.Project.create({
    name,
    description,
  });

  return Response.json(project, {
    status: 201,
  });
}