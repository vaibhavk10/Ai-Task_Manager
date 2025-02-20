import React from "react";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Sun,
  Moon,
  Menu,
  LogOut,
} from "lucide-react";
import { cn } from "../lib/utils";
import { Separator } from "./ui/separator";

interface SidebarProps {
  className?: string;
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  activeItem?: string;
  onMenuItemClick?: (item: string) => void;
  isCollapsed?: boolean;
  onCollapse?: () => void;
  onSignOut?: () => void;
}

const Sidebar = ({
  className = "",
  isDarkMode = false,
  onThemeToggle = () => {},
  activeItem = "dashboard",
  onMenuItemClick = (item: string) => console.log("Menu item clicked:", item),
  isCollapsed = false,
  onCollapse = () => {},
  onSignOut = () => console.log("Sign out clicked"),
}: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "team", label: "Team", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleMenuClick = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Menu item clicked:", itemId);
    onMenuItemClick(itemId);
  };

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Theme toggle clicked, current mode:", isDarkMode ? "dark" : "light");
    onThemeToggle();
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Collapse clicked");
    onCollapse();
  };

  const handleSignOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Sign out clicked");
    onSignOut();
  };

  return (
    <div
      className={cn(
        "h-screen flex flex-col flex-shrink-0 border-r",
        "bg-background text-foreground transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[280px]",
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h2 className="text-xl font-bold truncate">Task Manager</h2>}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "ml-auto hover:bg-accent hover:text-accent-foreground",
            "transition-colors duration-200"
          )}
          onClick={handleThemeToggle}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>

      <Separator className="mb-4" />

      <nav className="flex-1 overflow-y-auto px-4 py-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              type="button"
              variant={activeItem === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start mb-2",
                "hover:bg-accent hover:text-accent-foreground",
                isCollapsed ? "px-2" : "px-4",
                activeItem === item.id && "bg-accent text-accent-foreground"
              )}
              onClick={(e) => handleMenuClick(e, item.id)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="ml-2 truncate">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      <Separator className="mt-4" />

      <div className="p-4 space-y-2">
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "w-full justify-start",
            "hover:bg-accent hover:text-accent-foreground",
            isCollapsed ? "px-2" : "px-4"
          )}
          onClick={handleCollapse}
        >
          <Menu className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="ml-2 truncate">Collapse</span>}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "w-full justify-start",
            "text-destructive hover:text-destructive hover:bg-destructive/10",
            isCollapsed ? "px-2" : "px-4"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!isCollapsed && <span className="ml-2 truncate">Sign Out</span>}
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
