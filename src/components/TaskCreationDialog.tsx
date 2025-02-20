import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Mic, Plus } from "lucide-react";
import SmartTaskForm from "./SmartTaskForm";

interface TaskCreationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (values: any) => void;
  aiSuggestions?: {
    description?: string;
    estimatedTime?: string;
    assignees?: string;
  };
}

const TaskCreationDialog = ({
  open = false,
  onOpenChange = () => {},
  onSubmit = (values) => {
    console.log("Task created:", values);
    onOpenChange(false);
  },
  aiSuggestions = {
    description:
      "This task involves implementing the new feature as discussed in the planning meeting.",
    estimatedTime: "4 hours",
    assignees: "John Doe, Jane Smith",
  },
}: TaskCreationDialogProps) => {
  const [isVoiceInputActive, setIsVoiceInputActive] = React.useState(false);

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Fill in the task details below. Use voice input or type manually.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end mb-4">
          <Button
            variant={isVoiceInputActive ? "destructive" : "secondary"}
            size="sm"
            className="gap-2"
            onClick={() => setIsVoiceInputActive(!isVoiceInputActive)}
          >
            <Mic
              className={`h-4 w-4 ${isVoiceInputActive ? "animate-pulse" : ""}`}
            />
            {isVoiceInputActive ? "Stop Recording" : "Start Voice Input"}
          </Button>
        </div>

        <div className="pb-6">
          <SmartTaskForm onSubmit={handleSubmit} aiSuggestions={aiSuggestions} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskCreationDialog;
