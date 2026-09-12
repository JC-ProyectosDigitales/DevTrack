import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const {
  getSessionMock,
  userFirstMock,
  userWhereMock,
  userUpdateMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  userFirstMock: vi.fn(),
  userWhereMock: vi.fn(),
  userUpdateMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getSession: getSessionMock,
}));

vi.mock("@/prisma/db", () => ({
  db: {
    orm: {
      public: {
        User: {
          first: userFirstMock,
          where: userWhereMock,
        },
      },
    },
  },
}));

import { PATCH } from "./route";

function createRequest(
  body: Record<string, unknown>,
) {
  return new Request(
    "http://localhost/api/profile",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}

describe("PATCH /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    userWhereMock.mockReturnValue({
      update: userUpdateMock,
    });
  });

  it("returns 401 when there is no session", async () => {
    getSessionMock.mockResolvedValue(null);

    const response = await PATCH(
      createRequest({
        name: "Diego",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(userUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the name is empty", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    const response = await PATCH(
      createRequest({
        name: "   ",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message: "El nombre es obligatorio.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(userUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the session user no longer exists", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue(null);

    const response = await PATCH(
      createRequest({
        name: "Diego",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(userFirstMock).toHaveBeenCalledWith({
      id: 7,
    });

    expect(body).toEqual({
      message: "Usuario no encontrado.",
    });

    expect(userUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 500 when the user cannot be updated", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
      passwordHash: "hash",
    });

    userUpdateMock.mockResolvedValue(null);

    const response = await PATCH(
      createRequest({
        name: "Diego Castillo",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(500);

    expect(userWhereMock).toHaveBeenCalledWith({
      id: 7,
    });

    expect(userUpdateMock).toHaveBeenCalledWith({
      name: "Diego Castillo",
    });

    expect(body).toEqual({
      message: "No se pudo actualizar el usuario.",
    });
  });

  it("updates the authenticated user's name", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
      passwordHash: "hash",
    });

    userUpdateMock.mockResolvedValue({
      id: 7,
      name: "Diego Castillo",
      email: "diego@ejemplo.com",
      passwordHash: "hash",
    });

    const response = await PATCH(
      createRequest({
        name: "  Diego Castillo  ",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(userFirstMock).toHaveBeenCalledWith({
      id: 7,
    });

    expect(userWhereMock).toHaveBeenCalledWith({
      id: 7,
    });

    expect(userUpdateMock).toHaveBeenCalledWith({
      name: "Diego Castillo",
    });

    expect(body).toEqual({
      id: 7,
      name: "Diego Castillo",
      email: "diego@ejemplo.com",
    });

    expect(body).not.toHaveProperty(
      "passwordHash",
    );
  });
});