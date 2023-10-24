export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

export type TaskStatus = "pending" | "in-progress" | "done";
