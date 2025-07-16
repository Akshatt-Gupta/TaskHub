import { z } from 'zod';
import { ta } from 'zod/v4/locales';

const ProjectStatus = {
    PLANNING: "Planning",
    IN_PROGRESS: "In Progress", 
    COMPLETED: "Completed",
    ON_HOLD: "On Hold",
    CANCELLED: "Cancelled"
};

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8 characters' }),
  name: z.string().min(3, { message: 'Name must be at least 2 characters' }),
  confirmPassword: z.string().min(8, { message: 'Confirm Password must be 8 characters' })
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

export const resetPasswordSchema=z.object({
  
  newPassword: z.string().min(8, { message: 'Password must be 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Password must be 8 characters' }),

}).refine((data)=> data.newPassword===data.confirmPassword,{

  path:["confirmPassword"],
  message:"passwords do not match",

});

export const forgotPasswordSchema=z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

export const workspaceSchema = z.object({
  name: z.string().min(3, 'Workspace name is required' ),
  color: z.string().min(3, 'Color must be a valid hex code'),
  description: z.string().optional(),
});

export const projectSchema = z.object({
    title: z.string().min(3, "Project name is required"),
    description: z.string().optional(),
    status: z.enum([
        ProjectStatus.PLANNING,
        ProjectStatus.IN_PROGRESS,
        ProjectStatus.COMPLETED,
        ProjectStatus.ON_HOLD,
        ProjectStatus.CANCELLED
    ]),
    startDate: z.string().min(1, "Start date is required"), 
    dueDate: z.string().min(1, "Due date is required"),     
    members: z.array(z.object({
        user: z.string(),
        role: z.enum(["manager", "contributor", "viewer"]), 
    })).optional(),
    tags: z.string().optional(),
}).refine(data => new Date(data.startDate) < new Date(data.dueDate), {
    message: "Due date must be after start date",
    path: ["dueDate"]
});