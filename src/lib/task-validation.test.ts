import {
  describe,
  expect,
  it,
} from "vitest";

import {
  validateTaskInput,
} from "./task-validation";

describe("validateTaskInput", () => {
  it("accepts valid task data", () => {
    const result = validateTaskInput({
      title: "  Preparar README  ",
      status: "Pendiente",
      priority: "Alta",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 10,
    });

    expect(result).toEqual({
      title: "Preparar README",
      status: "Pendiente",
      priority: "Alta",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 10,
    });
  });

  it("rejects an invalid status", () => {
    const result = validateTaskInput({
      title: "Preparar README",
      status: "Terminando",
      priority: "Alta",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 10,
    });

    expect(result).toBeNull();
  });

  it("rejects an invalid priority", () => {
    const result = validateTaskInput({
      title: "Preparar README",
      status: "Pendiente",
      priority: "Urgente",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 10,
    });

    expect(result).toBeNull();
  });

  it("rejects an invalid due date", () => {
    const result = validateTaskInput({
      title: "Preparar README",
      status: "Pendiente",
      priority: "Alta",
      dueDate: "fecha-invalida",
      projectId: 10,
    });

    expect(result).toBeNull();
  });

  it("rejects a non-positive project id", () => {
    const result = validateTaskInput({
      title: "Preparar README",
      status: "Pendiente",
      priority: "Alta",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 0,
    });

    expect(result).toBeNull();
  });

  it("rejects an empty title", () => {
    const result = validateTaskInput({
      title: "   ",
      status: "Pendiente",
      priority: "Alta",
      dueDate: "2026-09-20T00:00:00.000Z",
      projectId: 10,
    });

    expect(result).toBeNull();
  });
});