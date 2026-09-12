import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const {
  deleteSessionMock,
} = vi.hoisted(() => ({
  deleteSessionMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  deleteSession: deleteSessionMock,
}));

import { POST } from "./route";

describe("POST /api/auth/logout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deletes the session and returns a success message", async () => {
    deleteSessionMock.mockResolvedValue(undefined);

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(deleteSessionMock).toHaveBeenCalledTimes(1);

    expect(body).toEqual({
      message: "Sesión cerrada correctamente.",
    });
  });
});