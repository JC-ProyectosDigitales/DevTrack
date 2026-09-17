import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const {
  getSessionMock,
  taskFirstMock,
  taskWhereMock,
  taskUpdateMock,
  taskDeleteMock,
  projectWhereMock,
  projectFirstMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  taskFirstMock: vi.fn(),
  taskWhereMock: vi.fn(),
  taskUpdateMock: vi.fn(),
  taskDeleteMock: vi.fn(),
  projectWhereMock: vi.fn(),
  projectFirstMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getSession: getSessionMock,
}));

vi.mock("@/prisma/db", () => ({
  db: {
    orm: {
      public: {
        Task: {
          first: taskFirstMock,
          where: taskWhereMock,
        },
        Project: {
          where: projectWhereMock,
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
    "http://localhost/api/tasks/1",
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
    "http://localhost/api/tasks/1",
    {
      method: "DELETE",
    },
  );
}

describe("PATCH /api/tasks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    taskWhereMock.mockReturnValue({
      update: taskUpdateMock,
      delete: taskDeleteMock,
    });

    projectWhereMock.mockReturnValue({
      first: projectFirstMock,
    });
  });

  it("returns 400 when PATCH receives invalid JSON", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    taskFirstMock.mockResolvedValue({
      id: 20,
      title: "Tarea original",
      projectId: 10,
    });

    projectFirstMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      ownerId: 7,
    });

    const request = new Request(
      "http://localhost/api/tasks/20",
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
      createContext("20"),
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

    expect(taskUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 401 when there is no session", async () => {
    getSessionMock.mockResolvedValue(null);

    const response = await PATCH(
      createPatchRequest({
        title: "Nueva tarea",
        status: "Pendiente",
        priority: "Alta",
        dueDate: "2026-09-20T00:00:00.000Z",
        projectId: 10,
      }),
      createContext("1"),
    );

    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(taskFirstMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the task id is invalid", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    const response = await PATCH(
      createPatchRequest({
        title: "Nueva tarea",
        status: "Pendiente",
        priority: "Alta",
        dueDate: "2026-09-20T00:00:00.000Z",
        projectId: 10,
      }),
      createContext("invalid"),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message:
        "El identificador de la tarea no es válido.",
    });

    expect(taskFirstMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the task does not exist", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    taskFirstMock.mockResolvedValue(null);

    const response = await PATCH(
      createPatchRequest({
        title: "Nueva tarea",
        status: "Pendiente",
        priority: "Alta",
        dueDate: "2026-09-20T00:00:00.000Z",
        projectId: 10,
      }),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(taskFirstMock).toHaveBeenCalledWith({
      id: 20,
    });

    expect(body).toEqual({
      message: "Tarea no encontrada.",
    });

    expect(projectWhereMock).not.toHaveBeenCalled();
    expect(taskUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the task belongs to another user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    taskFirstMock.mockResolvedValue({
      id: 20,
      title: "Tarea ajena",
      projectId: 99,
    });

    projectFirstMock.mockResolvedValue(null);

    const response = await PATCH(
      createPatchRequest({
        title: "Intento de cambio",
        status: "Pendiente",
        priority: "Alta",
        dueDate: "2026-09-20T00:00:00.000Z",
        projectId: 10,
      }),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(projectWhereMock).toHaveBeenCalledWith({
      id: 99,
      ownerId: 7,
    });

    expect(body).toEqual({
      message: "Tarea no encontrada.",
    });

    expect(taskUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 400 when task data is invalid", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    taskFirstMock.mockResolvedValue({
      id: 20,
      title: "Tarea original",
      projectId: 10,
    });

    projectFirstMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      ownerId: 7,
    });

    const response = await PATCH(
      createPatchRequest({
        title: "",
        status: "",
        priority: "",
        dueDate: "",
        projectId: "invalid",
      }),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message: "Los datos de la tarea no son válidos.",
    });

    expect(taskUpdateMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the target project belongs to another user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    taskFirstMock.mockResolvedValue({
      id: 20,
      title: "Tarea original",
      projectId: 10,
    });

    projectFirstMock
      .mockResolvedValueOnce({
        id: 10,
        name: "DevTrack",
        ownerId: 7,
      })
      .mockResolvedValueOnce(null);

    const response = await PATCH(
      createPatchRequest({
        title: "Tarea movida",
        status: "En progreso",
        priority: "Media",
        dueDate: "2026-09-25T00:00:00.000Z",
        projectId: 99,
      }),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(projectWhereMock).toHaveBeenLastCalledWith({
      id: 99,
      ownerId: 7,
    });

    expect(body).toEqual({
      message: "Proyecto no encontrado.",
    });

    expect(taskUpdateMock).not.toHaveBeenCalled();
  });

  it("updates a task owned by the authenticated user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    taskFirstMock.mockResolvedValue({
      id: 20,
      title: "Tarea original",
      status: "Pendiente",
      priority: "Baja",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 10,
    });

    projectFirstMock
      .mockResolvedValueOnce({
        id: 10,
        name: "DevTrack",
        ownerId: 7,
      })
      .mockResolvedValueOnce({
        id: 11,
        name: "Segundo proyecto",
        ownerId: 7,
      });

    taskUpdateMock.mockResolvedValue({
      id: 20,
      title: "Tarea actualizada",
      status: "En progreso",
      priority: "Alta",
      dueDate: "2026-09-25T00:00:00.000Z",
      projectId: 11,
    });

    const response = await PATCH(
      createPatchRequest({
        title: "  Tarea actualizada  ",
        status: "En progreso",
        priority: "Alta",
        dueDate: "2026-09-25T00:00:00.000Z",
        projectId: 11,
      }),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(projectWhereMock).toHaveBeenNthCalledWith(
      1,
      {
        id: 10,
        ownerId: 7,
      },
    );

    expect(projectWhereMock).toHaveBeenNthCalledWith(
      2,
      {
        id: 11,
        ownerId: 7,
      },
    );

    expect(taskWhereMock).toHaveBeenCalledWith({
      id: 20,
    });

    expect(taskUpdateMock).toHaveBeenCalledWith({
      title: "Tarea actualizada",
      status: "En progreso",
      priority: "Alta",
      dueDate: "2026-09-25T00:00:00.000Z",
      projectId: 11,
    });

    expect(body).toEqual({
      id: 20,
      title: "Tarea actualizada",
      status: "En progreso",
      priority: "Alta",
      dueDate: "2026-09-25T00:00:00.000Z",
      projectId: 11,
    });
  });
});

describe("DELETE /api/tasks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    taskWhereMock.mockReturnValue({
      update: taskUpdateMock,
      delete: taskDeleteMock,
    });

    projectWhereMock.mockReturnValue({
      first: projectFirstMock,
    });
  });

  it("returns 401 when there is no session", async () => {
    getSessionMock.mockResolvedValue(null);

    const response = await DELETE(
      createDeleteRequest(),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(taskFirstMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the task id is invalid", async () => {
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
        "El identificador de la tarea no es válido.",
    });

    expect(taskFirstMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the task does not exist", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    taskFirstMock.mockResolvedValue(null);

    const response = await DELETE(
      createDeleteRequest(),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      message: "Tarea no encontrada.",
    });

    expect(projectWhereMock).not.toHaveBeenCalled();
    expect(taskDeleteMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the task belongs to another user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    taskFirstMock.mockResolvedValue({
      id: 20,
      title: "Tarea ajena",
      projectId: 99,
    });

    projectFirstMock.mockResolvedValue(null);

    const response = await DELETE(
      createDeleteRequest(),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(projectWhereMock).toHaveBeenCalledWith({
      id: 99,
      ownerId: 7,
    });

    expect(body).toEqual({
      message: "Tarea no encontrada.",
    });

    expect(taskDeleteMock).not.toHaveBeenCalled();
  });

  it("deletes a task owned by the authenticated user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    taskFirstMock.mockResolvedValue({
      id: 20,
      title: "Tarea propia",
      projectId: 10,
    });

    projectFirstMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      ownerId: 7,
    });

    taskDeleteMock.mockResolvedValue(undefined);

    const response = await DELETE(
      createDeleteRequest(),
      createContext("20"),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(taskWhereMock).toHaveBeenCalledWith({
      id: 20,
    });

    expect(taskDeleteMock).toHaveBeenCalledTimes(1);

    expect(body).toEqual({
      message: "Tarea eliminada correctamente.",
    });
  });
});