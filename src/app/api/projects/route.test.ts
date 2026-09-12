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
  projectWhereMock,
  projectAllMock,
  projectCreateMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  userFirstMock: vi.fn(),
  projectWhereMock: vi.fn(),
  projectAllMock: vi.fn(),
  projectCreateMock: vi.fn(),
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
        },
        Project: {
          where: projectWhereMock,
          create: projectCreateMock,
        },
      },
    },
  },
}));

import {
  GET,
  POST,
} from "./route";

describe("/api/projects", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    projectWhereMock.mockReturnValue({
      all: projectAllMock,
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
  });

  it("returns only the authenticated user's projects", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    projectAllMock.mockResolvedValue([
      {
        id: 1,
        name: "DevTrack",
        description: "Proyecto personal",
        ownerId: 7,
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
        name: "DevTrack",
        description: "Proyecto personal",
        ownerId: 7,
      },
    ]);
  });

  it("returns 401 when POST is requested without a session", async () => {
    getSessionMock.mockResolvedValue(null);

    const request = new Request(
      "http://localhost/api/projects",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "DevTrack",
          description: "Proyecto personal",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(userFirstMock).not.toHaveBeenCalled();
    expect(projectCreateMock).not.toHaveBeenCalled();
  });

  it("returns 401 when the session user no longer exists", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue(null);

    const request = new Request(
      "http://localhost/api/projects",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "DevTrack",
          description: "Proyecto personal",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(401);

    expect(body).toEqual({
      message: "No autorizado.",
    });

    expect(projectCreateMock).not.toHaveBeenCalled();
  });

  it("returns 400 when project data is incomplete", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
    });

    const request = new Request(
      "http://localhost/api/projects",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
          description: "",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      message:
        "El nombre y la descripción son obligatorios.",
    });

    expect(projectCreateMock).not.toHaveBeenCalled();
  });

  it("creates a project for the authenticated user", async () => {
    getSessionMock.mockResolvedValue({
      userId: 7,
    });

    userFirstMock.mockResolvedValue({
      id: 7,
      name: "Diego",
      email: "diego@ejemplo.com",
    });

    projectCreateMock.mockResolvedValue({
      id: 10,
      name: "DevTrack",
      description: "Proyecto personal",
      ownerId: 7,
    });

    const request = new Request(
      "http://localhost/api/projects",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "  DevTrack  ",
          description: "  Proyecto personal  ",
        }),
      },
    );

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(201);

    expect(projectCreateMock).toHaveBeenCalledWith({
      name: "DevTrack",
      description: "Proyecto personal",
      ownerId: 7,
    });

    expect(body).toEqual({
      id: 10,
      name: "DevTrack",
      description: "Proyecto personal",
      ownerId: 7,
    });
  });
});