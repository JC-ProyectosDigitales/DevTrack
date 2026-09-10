import "dotenv/config";
import bcrypt from "bcryptjs";

import { db } from "../src/prisma/db";

const name = process.env["SEED_USER_NAME"];
const email = process.env["SEED_USER_EMAIL"];
const password = process.env["SEED_USER_PASSWORD"];

if (!name || !email || !password) {
  throw new Error(
    "Faltan SEED_USER_NAME, SEED_USER_EMAIL o SEED_USER_PASSWORD en .env",
  );
}

if (password.length < 8) {
  throw new Error(
    "SEED_USER_PASSWORD debe tener al menos 8 caracteres.",
  );
}

const normalizedEmail = email.trim().toLowerCase();

let user = await db.orm.public.User.first({
  email: normalizedEmail,
});

if (!user) {
  const passwordHash = await bcrypt.hash(password, 12);

  user = await db.orm.public.User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  console.log(`Usuario creado: ${user.email}`);
} else {
  console.log(`Usuario existente: ${user.email}`);
}

const projectsWithoutOwner = await db.orm.public.Project
  .where({
    ownerId: null,
  })
  .all();

for (const project of projectsWithoutOwner) {
  await db.orm.public.Project
    .where({
      id: project.id,
    })
    .update({
      ownerId: user.id,
    });
}

console.log(
  `Proyectos asignados al usuario: ${projectsWithoutOwner.length}`,
);