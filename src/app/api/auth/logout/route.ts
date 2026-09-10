import { deleteSession } from "@/lib/auth";

export async function POST() {
  await deleteSession();

  return Response.json({
    message: "Sesión cerrada correctamente.",
  });
}