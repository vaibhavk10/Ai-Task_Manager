import React from "react";
import { Button } from "./ui/button";
import { Mic, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface FloatingActionButtonProps {
  onVoiceClick?: () => void;
  onCreateClick?: () => void;
  isListening?: boolean;
}

const FloatingActionButton = ({
  onVoiceClick = () => console.log("Voice input clicked"),
  onCreateClick = () => console.log("Create clicked"),
  isListening = false,
}: FloatingActionButtonProps) => {
  return (
    <div className="fixed bottom-6 right-6 flex gap-4 bg-transparent">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`rounded-full w-12 h-12 shadow-lg ${isListening ? "bg-red-100 hover:bg-red-200" : "bg-white hover:bg-gray-100"}`}
              onClick={onVoiceClick}
            >
              <Mic
                className={`h-5 w-5 ${isListening ? "text-red-500" : "text-gray-600"}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voice Input</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90"
              onClick={onCreateClick}
            >
              <Plus className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Create New Task</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default FloatingActionButton;
