import { supabase } from "./supabase";

export interface Task {
  id?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "in_review" | "done";
  due_date: string;
  estimated_time?: string;
  assignee_name: string;
  assignee_avatar: string;
  ai_insights: string;
  tags: string[];
  subtasks: {
    title: string;
    completed: boolean;
  }[];
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export async function getTasks() {
  console.log("Fetching tasks...");
  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }

    if (!tasks) {
      console.log("No tasks found");
      return [];
    }

    console.log("Fetched tasks:", tasks);
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status || "todo",
      dueDate: task.due_date,
      estimatedTime: task.estimated_time,
      assignee: {
        name: task.assignee_name,
        avatar: task.assignee_avatar,
      },
      aiInsights: task.ai_insights,
      tags: task.tags || [],
      subtasks: task.subtasks || [],
    }));
  } catch (error) {
    console.error("Error in getTasks:", error);
    throw error;
  }
}

export async function createTask(task: Omit<Task, "id" | "user_id">) {
  console.log("Creating task with data:", task);
  
  try {
    // Validate the task data before sending to database
    if (!task.title || !task.description) {
      throw new Error("Title and description are required");
    }
    
    if (!task.priority || !["low", "medium", "high"].includes(task.priority)) {
      throw new Error("Priority must be low, medium, or high");
    }

    if (!task.status || !["todo", "in_progress", "in_review", "done"].includes(task.status)) {
      task.status = "todo";
    }

    if (!task.due_date) {
      throw new Error("Due date is required");
    }

    if (!task.assignee_name || !task.assignee_avatar) {
      throw new Error("Assignee name and avatar are required");
    }

    // Create the task with required fields
    const taskToCreate = {
      title: task.title.trim(),
      description: task.description.trim(),
      priority: task.priority,
      status: task.status,
      due_date: task.due_date,
      estimated_time: task.estimated_time,
      assignee_name: task.assignee_name,
      assignee_avatar: task.assignee_avatar,
      ai_insights: task.ai_insights || "Task created",
      tags: task.tags || [],
      subtasks: task.subtasks || [],
      user_id: "anonymous",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("Attempting to create task with:", taskToCreate);

    // First verify we can connect to the database
    const { error: healthCheckError } = await supabase
      .from('tasks')
      .select('count')
      .limit(1)
      .single();

    if (healthCheckError) {
      console.error("Database health check failed:", healthCheckError);
      throw new Error(`Database connection error: ${healthCheckError.message}`);
    }

    // Now try to insert the task
    const { data, error: insertError } = await supabase
      .from("tasks")
      .insert([taskToCreate])
      .select();

    if (insertError) {
      console.error("Failed to insert task:", {
        error: insertError,
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint
      });
      
      if (insertError.code === "42P01") {
        throw new Error("Tasks table not found. Please run the database setup SQL.");
      } else if (insertError.code === "23502") {
        throw new Error(`Missing required fields: ${insertError.details}`);
      } else if (insertError.code === "23503") {
        throw new Error(`Invalid reference: ${insertError.details}`);
      } else if (insertError.code === "23514") {
        throw new Error(`Invalid data: ${insertError.details}`);
      } else if (insertError.code === "PGRST116") {
        throw new Error("Database connection failed. Check your internet and Supabase URL.");
      } else {
        throw new Error(`Database error: ${insertError.message || "Unknown error creating task"}`);
      }
    }

    if (!data || data.length === 0) {
      console.error("No data returned after task creation");
      throw new Error("Failed to create task - no data returned from database");
    }

    const createdTask = data[0];
    console.log("Task created successfully:", createdTask);
    return createdTask;
  } catch (error: any) {
    console.error("Task creation failed:", {
      name: error.name,
      message: error.message,
      code: error?.code,
      details: error?.details,
      stack: error.stack
    });
    throw error;
  }
}

export async function updateTaskStatus(taskId: string, status: Task["status"]) {
  try {
    const { error } = await supabase
      .from("tasks")
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateTaskStatus:", error);
    throw error;
  }
}

export async function updateTaskSubtasks(taskId: string, subtasks: Task["subtasks"]) {
  try {
    const { error } = await supabase
      .from("tasks")
      .update({ 
        subtasks,
        updated_at: new Date().toISOString()
      })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task subtasks:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateTaskSubtasks:", error);
    throw error;
  }
}

export async function deleteTask(taskId: string) {
  console.log("Deleting task:", taskId);
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
  console.log("Task deleted successfully");
}

interface UpdateTaskData extends Partial<Task> {
  dueDate?: { from: Date };
  assignees?: string;
}

export async function updateTask(taskId: string, task: UpdateTaskData) {
  try {
    const { error } = await supabase
      .from("tasks")
      .update({
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date || task.dueDate?.from?.toISOString(),
        estimated_time: task.estimated_time,
        assignee_name: task.assignee_name || task.assignees,
        assignee_avatar: task.assignee_avatar || 
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(task.assignees || '')}`,
        tags: task.tags || [],
        subtasks: task.subtasks || [],
        updated_at: new Date().toISOString()
      })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in updateTask:", error);
    throw error;
  }
}
