import { JiraTasks } from "../../components";
import { useTaskStore } from "../../stores";

export const JiraPage = () => {
  const pendingTasks = useTaskStore((state) =>
    state.getTasksByStatus("pending")
  );
  const inProgressTasks = useTaskStore((state) =>
    state.getTasksByStatus("in-progress")
  );
  const doneTasks = useTaskStore((state) => state.getTasksByStatus("done"));

  const draggingTaskId = useTaskStore((state) => state.draggingTaskId);

  return (
    <>
      <h1>Tareas</h1>
      <p>
        Manejo de estado con objectos de Zustand{" "}
        {draggingTaskId && `dragging ${draggingTaskId}`}
      </p>

      <hr />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <JiraTasks tasks={pendingTasks} title="Pendientes" value="pending" />

        <JiraTasks
          tasks={inProgressTasks}
          title="Avanzando"
          value="in-progress"
        />

        <JiraTasks tasks={doneTasks} title="Terminadas" value="done" />
      </div>
    </>
  );
};
