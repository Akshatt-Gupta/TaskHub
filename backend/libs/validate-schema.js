import {z} from "zod";



export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1, "Token is required"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm Password is required"),
});

export const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
});
 
export const workspaceSchema = z.object({
    name: z.string().min(1, "Workspace name is required"),
    description: z.string().optional(),
    color: z.string().min(1, "Color is required"),
});
 
const projectSchema=z.object({
    title:z.string().min(3,"Title is required"),
    description:z.string().optional(),
    status:z.enum([
        "Planning",
        "In Progress",
        "On Hold",
        "Completed",
        "Cancelled",
    ]),
    startDate:z.string(),
    dueDate:z.string(),
    tags:z.string().optional(),
    members:z.array(
        z.object({
            user:z.string(),
            role:z.enum(["manager","contributor","viewer"]),
        })
    ).optional()
});
const taskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  description: z.string().optional(),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.string().min(1, "Due date is required"),
  assignees: z.array(z.string()).min(1, "At least one assignee is required"),
});

export{
    projectSchema,taskSchema,
}



