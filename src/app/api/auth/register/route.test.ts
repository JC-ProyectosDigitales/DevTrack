import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const {
  userFirstMock,
  userCreateMock,
  hashMock,
} = vi.hoisted(() => ({
  userFirstMock: vi.fn(),
  userCreateMock: vi.fn(),
  hashMock: vi.fn(),
}));

vi.mock("@/prisma/db", () => ({
  db: {
    orm: {
      public: {
        User: {
          first: userFirstMock,
          create: userCreateMock,
        },
      },
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: hashMock,
  },
}));

import { POST } from "./route";

describe("POST /api/auth/register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when required fields are missing", async () => {
    const request = new Request(
      "http://localhost/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
          email: "",
          password: "",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message: "Todos los campos son obligatorios.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(hashMock).not.toHaveBeenCalled();
    expect(userCreateMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the password has fewer than 8 characters", async () => {
    const request = new Request(
      "http://localhost/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Diego",
          email: "diego@ejemplo.com",
          password: "1234567",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message:
        "La contraseña debe tener al menos 8 caracteres.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(hashMock).not.toHaveBeenCalled();
    expect(userCreateMock).not.toHaveBeenCalled();
  });

  it("returns 409 when the email is already registered", async () => {
    userFirstMock.mockResolvedValue({
      id: 1,
      name: "Usuario existente",
      email: "usuario@ejemplo.com",
      passwordHash: "hashed-password",
    });

    const request = new Request(
      "http://localhost/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Nuevo usuario",
          email: " USUARIO@EJEMPLO.COM ",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(409);

    expect(body).toEqual({
      message: "Ya existe una cuenta con ese correo.",
    });

    expect(userFirstMock).toHaveBeenCalledWith({
      email: "usuario@ejemplo.com",
    });

    expect(hashMock).not.toHaveBeenCalled();
    expect(userCreateMock).not.toHaveBeenCalled();
  });

  it("creates a user and returns 201 when the data is valid", async () => {
    userFirstMock.mockResolvedValue(null);

    hashMock.mockResolvedValue("hashed-password");

    userCreateMock.mockResolvedValue({
      id: 7,
      name: "Diego Castillo",
      email: "diego@ejemplo.com",
      passwordHash: "hashed-password",
    });

    const request = new Request(
      "http://localhost/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "  Diego Castillo  ",
          email: " DIEGO@EJEMPLO.COM ",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);

    expect(userFirstMock).toHaveBeenCalledWith({
      email: "diego@ejemplo.com",
    });

    expect(hashMock).toHaveBeenCalledWith(
      "password123",
      12,
    );

    expect(userCreateMock).toHaveBeenCalledWith({
      name: "Diego Castillo",
      email: "diego@ejemplo.com",
      passwordHash: "hashed-password",
    });

    expect(body).toEqual({
      id: 7,
      name: "Diego Castillo",
      email: "diego@ejemplo.com",
    });
  });
});