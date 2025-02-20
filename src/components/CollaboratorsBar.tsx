import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Users } from "lucide-react";

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  status?: "online" | "offline" | "away";
}

interface CollaboratorsBarProps {
  collaborators?: Collaborator[];
  onlineCount?: number;
}

const CollaboratorsBar = ({
  collaborators = [
    {
      id: "1",
      name: "John Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
      status: "online",
    },
    {
      id: "2",
      name: "Jane Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      status: "online",
    },
    {
      id: "3",
      name: "Mike Johnson",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      status: "away",
    },
  ],
  onlineCount = 2,
}: CollaboratorsBarProps) => {
  return (
    <div className="w-full h-12 bg-background border-b flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {onlineCount} online collaborators
        </span>
      </div>
      <div className="flex items-center -space-x-2">
        {collaborators.map((collaborator) => (
          <TooltipProvider key={collaborator.id}>
            <Tooltip>
              <TooltipTrigger>
                <div className="relative">
                  <Avatar className="w-8 h-8 border-2 border-background hover:z-10 transition-all">
                    <AvatarImage
                      src={collaborator.avatar}
                      alt={collaborator.name}
                    />
                    <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${
                      collaborator.status === "online"
                        ? "bg-green-500"
                        : collaborator.status === "away"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                    }`}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {collaborator.name} - {collaborator.status}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default CollaboratorsBar;
