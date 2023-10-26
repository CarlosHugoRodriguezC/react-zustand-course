import { useState } from "react";
import { useTaskStore } from "../stores";
import Swal from "sweetalert2";
import { TaskStatus } from "../interfaces";

interface Options {
  status: TaskStatus;
}

export const useJiraTasks = ({ status }: Options) => {
  const isDragging = useTaskStore((state) => Boolean(state.draggingTaskId));
  const onTaskDropped = useTaskStore((state) => state.onTaskDropped);
  const addTask = useTaskStore((state) => state.addTask);

  const [isDraggingOver, SetIsDraggingOver] = useState(false);

  const handleAddTask = async () => {
    const resp = await Swal.fire({
      title: "Nueva tarea",
      input: "text",
      inputLabel: "Nombre de la tarea",
      inputPlaceholder: "Nombre de la tarea",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Debes escribir algo!";
        }
      },
    });

    if (!resp.isConfirmed) return;

    addTask(resp.value, status);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    SetIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    SetIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(`dropping over ${status}`);
    onTaskDropped(status);
    SetIsDraggingOver(false);
  };

  return {
    isDragging,
    isDraggingOver,

    handleAddTask,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
};
