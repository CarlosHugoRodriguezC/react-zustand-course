import { StateCreator, create } from "zustand";
import type { Task, TaskStatus } from "../../interfaces";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
// import { produce } from "immer";

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

const storeApi: StateCreator<
  TasksState,
  [["zustand/devtools", never], ["zustand/immer", never[]]]
> = (set, get) => ({
  tasks: initialTasks,
  draggingTaskId: undefined,
  getTasksByStatus: (status: TaskStatus) => {
    const tasks = get().tasks;
    return Object.values(tasks).filter((task) => task.status === status);
  },
  addTask: (title: string, status: TaskStatus) => {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      status,
    };

    set((state) => {
      state.tasks[newTask.id] = newTask;
    });

    // NOTE:this requires immer intallation
    // set(
    //   produce((state: TasksState) => {
    //     state.tasks[newTask.id] = newTask;
    //   })
    // );

    // NOTE: this is the normal way
    // set((state) => ({ tasks: { ...state.tasks, [newTask.id]: newTask } }));
  },

  setDraggingTaskId: (id: string) => set({ draggingTaskId: id }),
  removeDraggingTaskId: () => set({ draggingTaskId: undefined }),
  changeProgress: (taskId: string, status: TaskStatus) => {
    // set((state) => {
    //   state.tasks[taskId] = { ...state.tasks[taskId], status };
    // });
    set((state) => {
      state.tasks[taskId].status = status;
    });
    // const tasks = get().tasks;
    // const task = tasks[taskId];
    // task.status = status;
    // set({ tasks });
  },
  onTaskDropped: (status: TaskStatus) => {
    const taskId = get().draggingTaskId;
    if (!taskId) return;
    get().changeProgress(taskId, status);
    get().removeDraggingTaskId();
  },
});

export const useTaskStore = create<TasksState>()(
  devtools(persist(immer(storeApi), { name: "tasks-store" }))
);
