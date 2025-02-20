import React, { useEffect, useState } from "react";
import TaskCard from "./TaskCard";
import { ScrollArea } from "./ui/scroll-area";
import { motion } from "framer-motion";
import { updateTaskStatus, updateTaskSubtasks, updateTask } from "../lib/tasks";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "in_review" | "done";
  dueDate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  aiInsights: string;
  tags: string[];
  subtasks: {
    title: string;
    completed: boolean;
  }[];
}

interface TaskBoardProps {
  tasks?: Task[];
  onTaskDragEnd?: (taskId: string, x: number, y: number) => void;
  onDeleteTask?: (taskId: string) => void;
}

const TaskBoard = ({
  tasks = [],
  onTaskDragEnd = (taskId, x, y) => console.log("Task moved:", { taskId, x, y }),
  onDeleteTask = (taskId) => console.log("Delete task:", taskId),
}: TaskBoardProps) => {
  const [localTasks, setLocalTasks] = useState(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleStatusChange = async (taskId: string, currentStatus: Task["status"]) => {
    const statusOrder: Task["status"][] = ["todo", "in_progress", "in_review", "done"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      await updateTaskStatus(taskId, nextStatus);
      setLocalTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: nextStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleSubtaskToggle = async (taskId: string, subtaskIndex: number) => {
    const task = localTasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = [...task.subtasks];
    updatedSubtasks[subtaskIndex].completed = !updatedSubtasks[subtaskIndex].completed;

    try {
      await updateTaskSubtasks(taskId, updatedSubtasks);
      setLocalTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, subtasks: updatedSubtasks } : task
        )
      );
    } catch (error) {
      console.error("Error updating subtasks:", error);
    }
  };

  const handleEditTask = async (taskId: string, updatedTask: any) => {
    try {
      await updateTask(taskId, updatedTask);
      setLocalTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                ...updatedTask,
                dueDate: updatedTask.dueDate.from.toISOString(),
                assignee: {
                  name: updatedTask.assignees,
                  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(updatedTask.assignees)}`,
                },
              }
            : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const groupedTasks = {
    todo: localTasks.filter(task => task.status === "todo"),
    in_progress: localTasks.filter(task => task.status === "in_progress"),
    in_review: localTasks.filter(task => task.status === "in_review"),
    done: localTasks.filter(task => task.status === "done"),
  };

  return (
    <div className="w-full h-full bg-background p-6">
      <ScrollArea className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(groupedTasks).map(([status, statusTasks]) => (
            <div key={status} className="space-y-4">
              <h3 className="font-semibold text-lg capitalize">
                {status.replace('_', ' ')}
                <span className="ml-2 text-sm text-muted-foreground">
                  ({statusTasks.length})
                </span>
              </h3>
              <div className="space-y-4">
                {statusTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragEnd={(_, info) => {
                      onTaskDragEnd(task.id, info.point.x, info.point.y);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TaskCard
                      id={task.id}
                      title={task.title}
                      description={task.description}
                      priority={task.priority}
                      status={task.status}
                      dueDate={task.dueDate}
                      assignee={task.assignee}
                      aiInsights={task.aiInsights}
                      tags={task.tags}
                      subtasks={task.subtasks}
                      onDelete={() => onDeleteTask(task.id)}
                      onStatusChange={() => handleStatusChange(task.id, task.status)}
                      onSubtaskToggle={(index) => handleSubtaskToggle(task.id, index)}
                      onEdit={handleEditTask}
                    />
                  </motion.div>
                ))}
                {statusTasks.length === 0 && (
                  <div className="text-center text-muted-foreground py-8 border-2 border-dashed rounded-lg">
                    No tasks in {status.replace('_', ' ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskBoard;
