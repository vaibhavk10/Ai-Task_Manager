import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { CalendarDays, Edit2, Brain } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import SmartTaskForm from "./SmartTaskForm";

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
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
    subtasks: { title: string; completed: boolean; }[];
  };
  onEdit: (taskId: string, updatedTask: any) => void;
  onSubtaskToggle: (index: number) => void;
}

const TaskDetailsDialog = ({
  open,
  onOpenChange,
  task,
  onEdit,
  onSubtaskToggle,
}: TaskDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const priorityColors = {
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  };

  const statusColors = {
    todo: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    in_review: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
    done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  };

  const statusLabels = {
    todo: "To Do",
    in_progress: "In Progress",
    in_review: "In Review",
    done: "Done",
  };

  const handleEdit = (values: any) => {
    onEdit(task.id, values);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <SmartTaskForm
            onSubmit={handleEdit}
            initialValues={{
              title: task.title,
              description: task.description,
              priority: task.priority,
              status: task.status,
              dueDate: { from: new Date(task.dueDate) },
              assignees: task.assignee.name,
              tags: task.tags,
              subtasks: task.subtasks,
            }}
          />
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{task.title}</DialogTitle>
            <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center gap-2">
            <Badge className={statusColors[task.status]}>
              {statusLabels[task.status]}
            </Badge>
            <Badge className={priorityColors[task.priority]}>
              {task.priority}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="text-muted-foreground">{task.description}</p>
          </div>

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Subtasks</h4>
              <div className="space-y-2">
                {task.subtasks.map((subtask, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => onSubtaskToggle(index)}
                    />
                    <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {task.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Due Date and Assignee */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Assigned to</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* AI Insights */}
          {task.aiInsights && (
            <div className="flex items-start gap-2 bg-muted/50 p-4 rounded-lg">
              <Brain className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">AI Insights</h4>
                <p className="text-sm text-muted-foreground">{task.aiInsights}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailsDialog; 