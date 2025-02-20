import React, { useState, useEffect } from "react";
import { getTasks, createTask, deleteTask } from "../lib/tasks";
import { useAuth } from "./auth/AuthContext";
import { toggleTheme, initializeTheme } from "../lib/theme";
import Sidebar from "./Sidebar";
import TaskBoard from "./TaskBoard";
import TaskCreationDialog from "./TaskCreationDialog";
import FloatingActionButton from "./FloatingActionButton";
import CollaboratorsBar from "./CollaboratorsBar";
import CalendarView from "./CalendarView";
import TeamView from "./TeamView";
import SettingsView from "./SettingsView";

interface HomeProps {
  initialDarkMode?: boolean;
}

const Home = ({ initialDarkMode = false }: HomeProps) => {
  // Initialize theme from localStorage and apply it
  const [isDarkMode, setIsDarkMode] = useState(() => initializeTheme());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState("dashboard");
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : '';
  }, [isDarkMode]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await getTasks();
        setTasks(tasks);
      } catch (error) {
        console.error("Error loading tasks:", error);
      }
    };
    loadTasks();
  }, []);

  const { signOut } = useAuth();

  const handleThemeToggle = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    toggleTheme(newDarkMode);
  };

  const handleTaskCreate = async (values: any) => {
    console.log("Creating task with values:", values);
    try {
      if (!values.title || !values.description) {
        alert("Title and description are required");
        return;
      }

      const dueDate = values.dueDate?.from 
        ? new Date(values.dueDate.from).toISOString()
        : new Date().toISOString();
      
      const assigneeName = values.assignees?.trim() || "Unassigned";
      const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(assigneeName)}`;
      
      const taskData = {
        title: values.title.trim(),
        description: values.description.trim(),
        priority: values.priority || "medium",
        due_date: dueDate,
        assignee_name: assigneeName,
        assignee_avatar: avatarUrl,
        ai_insights: "New task added to the system"
      };

      console.log("Sending task data to server:", taskData);
      const createdTask = await createTask(taskData);
      console.log("Response from server:", createdTask);
      
      if (createdTask) {
        console.log("Task created successfully, fetching updated tasks...");
        const updatedTasks = await getTasks();
        console.log("Updated tasks:", updatedTasks);
        setTasks(updatedTasks);
        setIsDialogOpen(false);
      }
    } catch (error: any) {
      console.error("Error creating task:", error);
      alert(error.message || "Failed to create task. Please try again.");
    }
  };

  const handleVoiceInput = () => {
    setIsVoiceListening(!isVoiceListening);
  };

  const handleMenuItemClick = (item: string) => {
    console.log("Menu item clicked:", item);
    setActiveMenuItem(item);
  };

  const handleSidebarCollapse = () => {
    console.log("Toggling sidebar collapse");
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Render the appropriate view based on activeMenuItem
  const renderMainContent = () => {
    switch (activeMenuItem) {
      case "dashboard":
        return <TaskBoard tasks={tasks} onDeleteTask={handleDeleteTask} />;
      case "calendar":
        return <CalendarView tasks={tasks} />;
      case "team":
        return <TeamView />;
      case "settings":
        return <SettingsView isDarkMode={isDarkMode} onThemeChange={handleThemeToggle} />;
      default:
        return <TaskBoard tasks={tasks} onDeleteTask={handleDeleteTask} />;
    }
  };

  return (
    <div className="min-h-screen h-screen flex flex-col bg-background text-foreground">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isDarkMode={isDarkMode}
          onThemeToggle={handleThemeToggle}
          activeItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
          isCollapsed={isSidebarCollapsed}
          onCollapse={handleSidebarCollapse}
          onSignOut={signOut}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <CollaboratorsBar />
          
          <main className="flex-1 overflow-auto">
            {renderMainContent()}
          </main>

          <TaskCreationDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleTaskCreate}
            aiSuggestions={{
              description:
                "Consider breaking this task into smaller subtasks for better management.",
              estimatedTime: "3 hours",
              assignees: "Team Alpha",
            }}
          />

          <FloatingActionButton
            onVoiceClick={handleVoiceInput}
            onCreateClick={() => setIsDialogOpen(true)}
            isListening={isVoiceListening}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
