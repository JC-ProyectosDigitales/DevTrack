import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const {
  getSessionMock,
  projectWhereMock,
  projectFirstMock,
  projectUpdateMock,
  projectDeleteMock,
  taskWhereMock,
  taskAllMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  projectWhereMock: vi.fn(),
  projectFirstMock: vi.fn(),
  projectUpdateMock: vi.fn(),
  projectDeleteMock: vi.fn(),
  taskWhereMock: vi.fn(),
  taskAllMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getSession: getSessionMock,
}));

vi.mock("@/prisma/db", () => ({
  db: {
    orm: {
      public: {
        Project: {
          where: projectWhereMock,
        },
        Task: {
          where: taskWhereMock,
        },
      },
    },
  },
}));

import {
  DELETE,
  PATCH,
} from "./route";

function createContext(id: string) {
  return {
    params: Promise.resolve({
      id,
    }),
  };
}

function createPatchRequest(
  body: Record<string, unknown>,
) {
  return new Request(
    "http://localhost/api/projects/1",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
}

function createDeleteRequest() {
  return new Request(
    "http://localhost/api/projects/1",
    {
      method: "DELETE",
    },
  );
}

describe("PATCH /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    projectWhereMock.mockReturnValue({
      first: projectFirstMock,
      update: projectUpdateMock,
      delete: projectDeleteMock,
    });

    taskWhereMock.mockReturnValue({
      all: taskAllMock,
    });
  });

  it("returns 400 when PATCH receives invalid JSON", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectFirstMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      description: "Proyecto personal",
      ownerId: 7,
    });

    const request = new Request(
      "http://localhost/api/projects/10",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: "{invalid-json",
      },
    );

    const response = await PATCH(
      request,
      createContext("10"),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message: "Solicitud no válida.",
    });

    expect(projectWhereMock).toHaveBeenCalledWith({
      id: 10,
      ownerId: 7,
    });

    expect(projectUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 401 when there is no session", async () => {
    getSessionMock.mockResolvedValue(null);

    const response = await PATCH(
      createPatchRequest({
        name: "DevTrack",
        description: "Proyecto actualizado",
      }),
      createContext("1"),
    );

    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(projectWhereMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the project id is invalid", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    const response = await PATCH(
      createPatchRequest({
        name: "DevTrack",
        description: "Proyecto actualizado",
      }),
      createContext("invalid"),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message:
        "El identificador del proyecto no es válido.",
    });

    expect(projectWhereMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the project does not belong to the user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectFirstMock.mockResolvedValue(null);

    const response = await PATCH(
      createPatchRequest({
        name: "Proyecto ajeno",
        description: "No debe modificarse",
      }),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(projectWhereMock).toHaveBeenCalledWith({
      id: 20,
      ownerId: 7,
    });

    expect(body).toEqual({
      message: "Proyecto no encontrado.",
    });

    expect(projectUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the project data is incomplete", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectFirstMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      description: "Proyecto personal",
      ownerId: 7,
    });

    const response = await PATCH(
      createPatchRequest({
        name: "",
        description: "",
      }),
      createContext("10"),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message:
        "El nombre y la descripción son obligatorios.",
    });

    expect(projectUpdateMock).not.toHaveBeenCalled();
  });

  it("updates a project owned by the authenticated user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectFirstMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      description: "Proyecto personal",
      ownerId: 7,
    });

    projectUpdateMock.mockResolvedValue({
      id: 10,
      name: "DevTrack actualizado",
      description: "Nueva descripción",
      ownerId: 7,
    });

    const response = await PATCH(
      createPatchRequest({
        name: "  DevTrack actualizado  ",
        description: "  Nueva descripción  ",
      }),
      createContext("10"),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(projectUpdateMock).toHaveBeenCalledWith({
      name: "DevTrack actualizado",
      description: "Nueva descripción",
    });

    expect(body).toEqual({
      id: 10,
      name: "DevTrack actualizado",
      description: "Nueva descripción",
      ownerId: 7,
    });
  });
});

describe("DELETE /api/projects/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    projectWhereMock.mockReturnValue({
      first: projectFirstMock,
      update: projectUpdateMock,
      delete: projectDeleteMock,
    });

    taskWhereMock.mockReturnValue({
      all: taskAllMock,
    });
  });

  it("returns 401 when there is no session", async () => {
    getSessionMock.mockResolvedValue(null);

    const response = await DELETE(
      createDeleteRequest(),
      createContext("10"),
    );

    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(projectWhereMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the project id is invalid", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    const response = await DELETE(
      createDeleteRequest(),
      createContext("invalid"),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message:
        "El identificador del proyecto no es válido.",
    });

    expect(projectWhereMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the project does not belong to the user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectFirstMock.mockResolvedValue(null);

    const response = await DELETE(
      createDeleteRequest(),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(projectWhereMock).toHaveBeenCalledWith({
      id: 20,
      ownerId: 7,
    });

    expect(body).toEqual({
      message: "Proyecto no encontrado.",
    });

    expect(taskWhereMock).not.toHaveBeenCalled();
    expect(projectDeleteMock).not.toHaveBeenCalled();
  });

  it("returns 409 when the project still has tasks", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectFirstMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      description: "Proyecto personal",
      ownerId: 7,
    });

    taskAllMock.mockResolvedValue([
      {
        id: 1,
        title: "Tarea pendiente",
        projectId: 10,
      },
    ]);

    const response = await DELETE(
      createDeleteRequest(),
      createContext("10"),
    );

    const body = await response.json();

    expect(response.status).toBe(409);

    expect(taskWhereMock).toHaveBeenCalledWith({
      projectId: 10,
    });

    expect(body).toEqual({
      message:
        "No puedes eliminar un proyecto que todavía tiene tareas asociadas.",
    });

    expect(projectDeleteMock).not.toHaveBeenCalled();
  });

  it("deletes an empty project owned by the authenticated user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectFirstMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      description: "Proyecto personal",
      ownerId: 7,
    });

    taskAllMock.mockResolvedValue([]);
    projectDeleteMock.mockResolvedValue(undefined);

    const response = await DELETE(
      createDeleteRequest(),
      createContext("10"),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(taskWhereMock).toHaveBeenCalledWith({
      projectId: 10,
    });

    expect(projectWhereMock).toHaveBeenLastCalledWith({
      id: 10,
      ownerId: 7,
    });

    expect(projectDeleteMock).toHaveBeenCalledTimes(1);

    expect(body).toEqual({
      message: "Proyecto eliminado correctamente.",
    });
  });
});