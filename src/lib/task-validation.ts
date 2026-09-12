export const TASK_STATUSES = [
  "Pendiente",
  "En progreso",
  "Completada",
] as const;

export const TASK_PRIORITIES = [
  "Alta",
  "Media",
  "Baja",
] as const;

export type TaskStatus =
  (typeof TASK_STATUSES)[number];

export type TaskPriority =
  (typeof TASK_PRIORITIES)[number];

type TaskInput = {
  title: unknown;
  status: unknown;
  priority: unknown;
  dueDate: unknown;
  projectId: unknown;
};

export type ValidTaskInput = {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: number;
};

export function validateTaskInput(
  input: TaskInput,
): ValidTaskInput | null {
  const title =
    typeof input.title === "string"
      ? input.title.trim()
      : "";

  const status =
    typeof input.status === "string"
      ? input.status
      : "";

  const priority =
    typeof input.priority === "string"
      ? input.priority
      : "";

  const dueDate =
    typeof input.dueDate === "string"
      ? input.dueDate
      : "";

  const projectId = Number(input.projectId);

  const validStatus = TASK_STATUSES.includes(
    status as TaskStatus,
  );

  const validPriority = TASK_PRIORITIES.includes(
    priority as TaskPriority,
  );

  const validDueDate =
    dueDate.length > 0 &&
    !Number.isNaN(Date.parse(dueDate));

  const validProjectId =
    Number.isInteger(projectId) &&
    projectId > 0;

  if (
    !title ||
    !validStatus ||
    !validPriority ||
    !validDueDate ||
    !validProjectId
  ) {
    return null;
  }

  return {
    title,
    status: status as TaskStatus,
    priority: priority as TaskPriority,
    dueDate,
    projectId,
  };
}