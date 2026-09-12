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
  projectAllMock,
  projectFirstMock,
  taskAllMock,
  taskCreateMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  projectWhereMock: vi.fn(),
  projectAllMock: vi.fn(),
  projectFirstMock: vi.fn(),
  taskAllMock: vi.fn(),
  taskCreateMock: vi.fn(),
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
          all: taskAllMock,
          create: taskCreateMock,
        },
      },
    },
  },
}));

import {
  GET,
  POST,
} from "./route";

describe("/api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    projectWhereMock.mockReturnValue({
      all: projectAllMock,
      first: projectFirstMock,
    });
  });

  it("returns 401 when GET is requested without a session", async () => {
    getSessionMock.mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(projectWhereMock).not.toHaveBeenCalled();
    expect(taskAllMock).not.toHaveBeenCalled();
  });

  it("returns only tasks from projects owned by the authenticated user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectAllMock.mockResolvedValue([
      {
        id: 10,
        name: "DevTrack",
        ownerId: 7,
      },
      {
        id: 11,
        name: "Otro proyecto",
        ownerId: 7,
      },
    ]);

    taskAllMock.mockResolvedValue([
      {
        id: 1,
        title: "Tarea propia",
        projectId: 10,
      },
      {
        id: 2,
        title: "Otra tarea propia",
        projectId: 11,
      },
      {
        id: 3,
        title: "Tarea de otro usuario",
        projectId: 99,
      },
    ]);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(projectWhereMock).toHaveBeenCalledWith({
      ownerId: 7,
    });

    expect(body).toEqual([
      {
        id: 1,
        title: "Tarea propia",
        projectId: 10,
      },
      {
        id: 2,
        title: "Otra tarea propia",
        projectId: 11,
      },
    ]);
  });

  it("returns 401 when POST is requested without a session", async () => {
    getSessionMock.mockResolvedValue(null);

    const request = new Request(
      "http://localhost/api/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Nueva tarea",
          status: "Pendiente",
          priority: "Alta",
          dueDate: "2026-09-20T00:00:00.000Z",
          projectId: 10,
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(projectWhereMock).not.toHaveBeenCalled();
    expect(taskCreateMock).not.toHaveBeenCalled();
  });

  it("returns 400 when task data is invalid", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    const request = new Request(
      "http://localhost/api/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "",
          status: "",
          priority: "",
          dueDate: "",
          projectId: "invalid",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message: "Los datos de la tarea no son válidos.",
    });

    expect(projectWhereMock).not.toHaveBeenCalled();
    expect(taskCreateMock).not.toHaveBeenCalled();
  });

  it("returns 404 when the target project does not belong to the user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectFirstMock.mockResolvedValue(null);

    const request = new Request(
      "http://localhost/api/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Tarea ajena",
          status: "Pendiente",
          priority: "Alta",
          dueDate: "2026-09-20T00:00:00.000Z",
          projectId: 99,
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(404);

    expect(projectWhereMock).toHaveBeenCalledWith({
      id: 99,
      ownerId: 7,
    });

    expect(body).toEqual({
      message: "Proyecto no encontrado.",
    });

    expect(taskCreateMock).not.toHaveBeenCalled();
  });

  it("creates a task inside a project owned by the authenticated user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectFirstMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      ownerId: 7,
    });

    taskCreateMock.mockResolvedValue({
      id: 25,
      title: "Preparar README",
      status: "Pendiente",
      priority: "Alta",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 10,
    });

    const request = new Request(
      "http://localhost/api/tasks",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "  Preparar README  ",
          status: "Pendiente",
          priority: "Alta",
          dueDate: "2026-09-20T00:00:00.000Z",
          projectId: 10,
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);

    expect(projectWhereMock).toHaveBeenCalledWith({
      id: 10,
      ownerId: 7,
    });

    expect(taskCreateMock).toHaveBeenCalledWith({
      title: "Preparar README",
      status: "Pendiente",
      priority: "Alta",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 10,
    });

    expect(body).toEqual({
      id: 25,
      title: "Preparar README",
      status: "Pendiente",
      priority: "Alta",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 10,
    });
  });
});