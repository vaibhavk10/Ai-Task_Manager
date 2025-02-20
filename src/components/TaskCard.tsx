import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { CalendarDays, AlertCircle, Brain, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import TaskDetailsDialog from "./TaskDetailsDialog";

interface TaskCardProps {
  id: string;
  onDelete?: () => void;
  title?: string;
  description?: string;
  priority?: "low" | "medium" | "high";
  status?: "todo" | "in_progress" | "in_review" | "done";
  dueDate?: string;
  assignee?: {
    name: string;
    avatar: string;
  };
  aiInsights?: string;
  tags?: string[];
  subtasks?: { title: string; completed: boolean; }[];
  onStatusChange?: (status: string) => void;
  onSubtaskToggle?: (index: number) => void;
  onEdit?: (taskId: string, updatedTask: any) => void;
}

const TaskCard = ({
  id,
  title = "Sample Task",
  description = "This is a sample task description to demonstrate the layout and styling of the task card component.",
  priority = "medium",
  status = "todo",
  dueDate = "2024-04-15",
  assignee = {
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  aiInsights = "This task appears to be a medium priority item that requires attention within the next week.",
  tags = [],
  subtasks = [],
  onDelete = () => console.log("Delete task"),
  onStatusChange = () => console.log("Status changed"),
  onSubtaskToggle = () => console.log("Subtask toggled"),
  onEdit = () => console.log("Edit task"),
}: TaskCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

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

  return (
    <>
      <Card 
        className="w-[300px] bg-card shadow-lg hover:shadow-xl transition-shadow duration-200 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg truncate text-card-foreground">{title}</h3>
            <Badge className={priorityColors[priority]}>{priority}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={statusColors[status]} 
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(status);
              }}
            >
              {statusLabels[status]}
            </Badge>
            {tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
          {subtasks.length > 0 && (
            <div className="space-y-1 mb-3">
              {subtasks.map((subtask, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => onSubtaskToggle(index)}
                  />
                  <span className={`text-sm ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4 mr-1" />
            <span>{new Date(dueDate).toLocaleDateString()}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                    <AvatarFallback>{assignee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Assigned to {assignee.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1 text-primary">
                    <Brain className="w-4 h-4" />
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-[200px] text-sm">{aiInsights}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>

      <TaskDetailsDialog
        open={showDetails}
        onOpenChange={setShowDetails}
        task={{
          id,
          title,
          description,
          priority,
          status,
          dueDate,
          assignee,
          aiInsights,
          tags,
          subtasks,
        }}
        onEdit={onEdit}
        onSubtaskToggle={onSubtaskToggle}
      />
    </>
  );
};

export default TaskCard;
