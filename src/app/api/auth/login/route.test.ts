import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const {
  userFirstMock,
  compareMock,
  createSessionMock,
} = vi.hoisted(() => ({
  userFirstMock: vi.fn(),
  compareMock: vi.fn(),
  createSessionMock: vi.fn(),
}));

vi.mock("@/prisma/db", () => ({
  db: {
    orm: {
      public: {
        User: {
          first: userFirstMock,
        },
      },
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: compareMock,
  },
}));

vi.mock("@/lib/auth", () => ({
  createSession: createSessionMock,
}));

import { POST } from "./route";

describe("POST /api/auth/login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when the request body contains invalid JSON", async () => {
    const request = new Request(
      "http://localhost/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{invalid-json",
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message: "Solicitud no válida.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(compareMock).not.toHaveBeenCalled();
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it("returns 400 when email or password is missing", async () => {
    const request = new Request(
      "http://localhost/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "",
          password: "",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message:
        "Correo y contraseña son obligatorios.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(compareMock).not.toHaveBeenCalled();
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it("returns 401 when the user does not exist", async () => {
    userFirstMock.mockResolvedValue(null);

    const request = new Request(
      "http://localhost/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: " usuario@ejemplo.com ",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message:
        "Correo o contraseña incorrectos.",
    });

    expect(userFirstMock).toHaveBeenCalledWith({
      email: "usuario@ejemplo.com",
    });

    expect(compareMock).not.toHaveBeenCalled();
    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it("returns 401 when the password is incorrect", async () => {
    userFirstMock.mockResolvedValue({
      id: 1,
      name: "Usuario",
      email: "usuario@ejemplo.com",
      passwordHash: "hashed-password",
    });

    compareMock.mockResolvedValue(false);

    const request = new Request(
      "http://localhost/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "usuario@ejemplo.com",
          password: "wrong-password",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message:
        "Correo o contraseña incorrectos.",
    });

    expect(compareMock).toHaveBeenCalledWith(
      "wrong-password",
      "hashed-password",
    );

    expect(createSessionMock).not.toHaveBeenCalled();
  });

  it("creates a session and returns the user when credentials are valid", async () => {
    userFirstMock.mockResolvedValue({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
      passwordHash: "hashed-password",
    });

    compareMock.mockResolvedValue(true);
    createSessionMock.mockResolvedValue(undefined);

    const request = new Request(
      "http://localhost/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: " DIEGO@EJEMPLO.COM ",
          password: "password123",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(userFirstMock).toHaveBeenCalledWith({
      email: "diego@ejemplo.com",
    });

    expect(compareMock).toHaveBeenCalledWith(
      "password123",
      "hashed-password",
    );

    expect(createSessionMock).toHaveBeenCalledWith(7);

    expect(body).toEqual({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
    });
  });
});