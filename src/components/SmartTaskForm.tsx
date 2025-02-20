import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { CalendarIcon, Clock, Users, X, Plus, Tag } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import DatePickerWithRange from "./ui/date-picker-with-range";

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(50, "Title must be less than 50 characters"),
  description: z.string().min(2, "Description must be at least 2 characters").max(500, "Description must be less than 500 characters"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["todo", "in_progress", "in_review", "done"]).default("todo"),
  dueDate: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional()
    .transform((date) => {
      if (!date) return undefined;
      return {
        from: date.from,
        to: date.to || date.from,
      };
    }),
  estimatedTime: z.string().optional(),
  assignees: z.string().optional(),
  tags: z.array(z.string()).default([]),
  subtasks: z.array(z.object({
    title: z.string(),
    completed: z.boolean()
  })).default([])
});

interface SmartTaskFormProps {
  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  aiSuggestions?: {
    description?: string;
    estimatedTime?: string;
    assignees?: string;
    tags?: string[];
  };
}

const SmartTaskForm = ({
  onSubmit = (values) => console.log(values),
  aiSuggestions = {
    description: "This task involves implementing the new feature as discussed in the planning meeting.",
    estimatedTime: "4 hours",
    assignees: "John Doe, Jane Smith",
    tags: ["feature", "frontend"]
  },
}: SmartTaskFormProps) => {
  const [newTag, setNewTag] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: {
        from: new Date(),
        to: new Date(),
      },
      estimatedTime: "",
      assignees: "",
      tags: [],
      subtasks: []
    },
  });

  const handleAddTag = () => {
    if (newTag.trim() && !form.getValues("tags").includes(newTag.trim())) {
      form.setValue("tags", [...form.getValues("tags"), newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      form.getValues("tags").filter(tag => tag !== tagToRemove)
    );
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      form.setValue("subtasks", [
        ...form.getValues("subtasks"),
        { title: newSubtask.trim(), completed: false }
      ]);
      setNewSubtask("");
    }
  };

  const handleToggleSubtask = (index: number) => {
    const subtasks = form.getValues("subtasks");
    subtasks[index].completed = !subtasks[index].completed;
    form.setValue("subtasks", subtasks);
  };

  const handleRemoveSubtask = (index: number) => {
    form.setValue(
      "subtasks",
      form.getValues("subtasks").filter((_, i) => i !== index)
    );
  };

  return (
    <div className="w-full bg-background">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            if (!data.title || !data.description) {
              return;
            }
            console.log("Submitting form data:", data);
            onSubmit(data);
          })}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter task title" {...field} required />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="required">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter task description"
                    className="min-h-[100px] resize-none"
                    {...field}
                    required
                  />
                </FormControl>
                {aiSuggestions.description && (
                  <Card className="p-3 mt-2 bg-muted">
                    <p className="text-sm">AI Suggestion:</p>
                    <p className="text-sm text-muted-foreground">
                      {aiSuggestions.description}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      type="button"
                      onClick={() =>
                        form.setValue(
                          "description",
                          aiSuggestions.description || "",
                          { shouldValidate: true }
                        )
                      }
                    >
                      Use Suggestion
                    </Button>
                  </Card>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Low
                        </Badge>
                      </SelectItem>
                      <SelectItem value="medium">
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          Medium
                        </Badge>
                      </SelectItem>
                      <SelectItem value="high">
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          High
                        </Badge>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date Range</FormLabel>
                  <FormControl>
                    <DatePickerWithRange
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Time</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input {...field} placeholder="e.g. 4 hours" />
                      <Clock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </FormControl>
                  {aiSuggestions.estimatedTime && (
                    <FormDescription>
                      AI suggests: {aiSuggestions.estimatedTime}
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={() => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.getValues("tags").map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                {aiSuggestions.tags && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground">Suggested tags:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {aiSuggestions.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => {
                            if (!form.getValues("tags").includes(tag)) {
                              form.setValue("tags", [...form.getValues("tags"), tag]);
                            }
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtasks"
            render={() => (
              <FormItem>
                <FormLabel>Subtasks</FormLabel>
                <div className="space-y-2">
                  {form.getValues("subtasks").map((subtask, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => handleToggleSubtask(index)}
                      />
                      <span className={`flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {subtask.title}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleRemoveSubtask(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add a subtask"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSubtask())}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddSubtask}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignees"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assignees</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input {...field} placeholder="Enter assignees" />
                    <Users className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </FormControl>
                {aiSuggestions.assignees && (
                  <FormDescription>
                    AI suggests: {aiSuggestions.assignees}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full mt-4"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SmartTaskForm;
