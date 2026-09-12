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
  bcryptCompareMock,
  bcryptHashMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  userFirstMock: vi.fn(),
  userWhereMock: vi.fn(),
  userUpdateMock: vi.fn(),
  bcryptCompareMock: vi.fn(),
  bcryptHashMock: vi.fn(),
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

vi.mock("bcryptjs", () => ({
  default: {
    compare: bcryptCompareMock,
    hash: bcryptHashMock,
  },
}));

import { PATCH } from "./route";

function createRequest(
  body: Record<string, unknown>,
) {
  return new Request(
    "http://localhost/api/profile/password",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}

describe("PATCH /api/profile/password", () => {
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
        currentPassword: "actual123",
        newPassword: "nueva1234",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(bcryptCompareMock).not.toHaveBeenCalled();
    expect(bcryptHashMock).not.toHaveBeenCalled();
  });

  it("returns 400 when password fields are incomplete", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    const response = await PATCH(
      createRequest({
        currentPassword: "",
        newPassword: "",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message: "Completa ambos campos de contraseña.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(bcryptCompareMock).not.toHaveBeenCalled();
    expect(bcryptHashMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the new password has fewer than 8 characters", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    const response = await PATCH(
      createRequest({
        currentPassword: "actual123",
        newPassword: "1234567",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message:
        "La nueva contraseña debe tener al menos 8 caracteres.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(bcryptCompareMock).not.toHaveBeenCalled();
    expect(bcryptHashMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the session user no longer exists", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue(null);

    const response = await PATCH(
      createRequest({
        currentPassword: "actual123",
        newPassword: "nueva1234",
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

    expect(bcryptCompareMock).not.toHaveBeenCalled();
    expect(bcryptHashMock).not.toHaveBeenCalled();
  });

  it("returns 401 when the current password is incorrect", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
      passwordHash: "stored-hash",
    });

    bcryptCompareMock.mockResolvedValue(false);

    const response = await PATCH(
      createRequest({
        currentPassword: "incorrecta",
        newPassword: "nueva1234",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(401);

    expect(bcryptCompareMock).toHaveBeenCalledWith(
      "incorrecta",
      "stored-hash",
    );

    expect(body).toEqual({
      message: "La contraseña actual es incorrecta.",
    });

    expect(bcryptHashMock).not.toHaveBeenCalled();
    expect(userUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 500 when the password cannot be updated", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
      passwordHash: "stored-hash",
    });

    bcryptCompareMock.mockResolvedValue(true);
    bcryptHashMock.mockResolvedValue("new-hash");
    userUpdateMock.mockResolvedValue(null);

    const response = await PATCH(
      createRequest({
        currentPassword: "actual123",
        newPassword: "nueva1234",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(500);

    expect(bcryptCompareMock).toHaveBeenCalledWith(
      "actual123",
      "stored-hash",
    );

    expect(bcryptHashMock).toHaveBeenCalledWith(
      "nueva1234",
      12,
    );

    expect(userWhereMock).toHaveBeenCalledWith({
      id: 7,
    });

    expect(userUpdateMock).toHaveBeenCalledWith({
      passwordHash: "new-hash",
    });

    expect(body).toEqual({
      message: "No se pudo actualizar la contraseña.",
    });
  });

  it("updates the password when the current password is correct", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
      passwordHash: "stored-hash",
    });

    bcryptCompareMock.mockResolvedValue(true);
    bcryptHashMock.mockResolvedValue("new-hash");

    userUpdateMock.mockResolvedValue({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
      passwordHash: "new-hash",
    });

    const response = await PATCH(
      createRequest({
        currentPassword: "actual123",
        newPassword: "nueva1234",
      }),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(bcryptCompareMock).toHaveBeenCalledWith(
      "actual123",
      "stored-hash",
    );

    expect(bcryptHashMock).toHaveBeenCalledWith(
      "nueva1234",
      12,
    );

    expect(userWhereMock).toHaveBeenCalledWith({
      id: 7,
    });

    expect(userUpdateMock).toHaveBeenCalledWith({
      passwordHash: "new-hash",
    });

    expect(body).toEqual({
      message: "Contraseña actualizada correctamente.",
    });
  });
});