import { StateCreator, create } from "zustand";
import type { Task, TaskStatus } from "../../interfaces";
import { devtools } from "zustand/middleware";

interface TasksState {
  tasks: Record<string, Task>;
  draggingTaskId?: string;
  getTasksByStatus: (status: TaskStatus) => Task[];
  addTask: (title: string, status: TaskStatus) => void;

  setDraggingTaskId: (id: string) => void;
  removeDraggingTaskId: () => void;
  changeProgress: (taskId: string, status: TaskStatus) => void;
  onTaskDropped: (status: TaskStatus) => void;
}

const initialTasks: Record<string, Task> = {
  "ABC-1": {
    id: "ABC-1",
    title: "Task 1",
    status: "pending",
  },
  "ABC-2": {
    id: "ABC-2",
    title: "Task 2",
    status: "in-progress",
  },
  "ABC-3": {
    id: "ABC-3",
    title: "Task 3",
    status: "pending",
  },
  "ABC-4": {
    id: "ABC-4",
    title: "Task 4",
    status: "done",
  },
};

const storeApi: StateCreator<TasksState> = (set, get) => ({
  tasks: initialTasks,
  draggingTaskId: undefined,
  getTasksByStatus: (status: TaskStatus) => {
    const tasks = get().tasks;
    return Object.values(tasks).filter((task) => task.status === status);
  },
  addTask: (title: string, status: TaskStatus) => {
    const tasks = get().tasks;
    const id = crypto.randomUUID();
    const newTask = {
      id,
      title,
      status,
    };
    tasks[id] = newTask;
    set({ tasks });
  },

  setDraggingTaskId: (id: string) => set({ draggingTaskId: id }),
  removeDraggingTaskId: () => set({ draggingTaskId: undefined }),
  changeProgress: (taskId: string, status: TaskStatus) => {
    const tasks = get().tasks;
    const task = tasks[taskId];
    task.status = status;
    set({ tasks });
  },
  onTaskDropped: (status: TaskStatus) => {
    const taskId = get().draggingTaskId;
    if (!taskId) return;
    get().changeProgress(taskId, status);
    get().removeDraggingTaskId();
  },
});

export const useTaskStore = create<TasksState>()(devtools(storeApi));
