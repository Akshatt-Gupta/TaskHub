export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: Date;
    isEmailVerified:boolean;
    updatedAt:Date;
    profilePicture?:string;
}
export interface Workspace{
    _id:string;
    name:string;
    description?:string;
    owner:User|string;
    color:string,
    members:{
        user:User;
        role:"admin"|"member"|"owner"|"viewer";
        joinedAt:Date;
    }[];
    createdAt:Date;
    updatedAt:Date; 
};

export enum ProjectStatus {
    PLANNING = "Planning",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
    ON_HOLD = "On Hold",
    CANCELLED = "Cancelled"
}

export interface Project {
    _id: string;
    name: string;
    description?: string;
    status: ProjectStatus;
    workspace: Workspace;
    startDate: Date;
    dueDate: Date;
    progress: number;
    tasks: string[]; 
    members: {
        user: User;
        role: "admin" | "member" | "viewer";
    }[];
    createdAt: Date;
    updatedAt: Date;
    isArchived: boolean;
};

export type TaskStatus = "to Do" | "In Progress" | "Done";
export type TaskPriority = "High" | "Medium" | "Low";

export interface Subtask {
    id: string;
    title: string;
    Completed: boolean;
    createdAt: Date;
}

export interface Attachment {
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: User | string;
    uploadedAt: Date;
    id: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  project: Project;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  dueDate: Date;
  priority: TaskPriority;
  assignee: User | string;
  createdBy: User | string;
  assignees: User[];
  subtasks?: Subtask[];
  watchers?: User[];
  attachments?: Attachment[];
}

export interface MemberProps {
    _id: string;
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
}