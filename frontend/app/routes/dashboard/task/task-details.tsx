import { BackButton } from "@/components/back-button";
import { Loader } from "@/components/loader";
import { CommentSection } from "@/components/task/comment-section";
import { SubTasksDetails } from "@/components/task/sub-tasks";
import { TaskActivity } from "@/components/task/task-activity";
import { TaskAssigneesSelector } from "@/components/task/task-assignees-selector";
import { TaskDescription } from "@/components/task/task-description";
import { TaskPrioritySelector } from "@/components/task/task-priority-selector";
import { TaskStatusSelector } from "@/components/task/task-status-selector";
import { TaskTitle } from "@/components/task/task-title";
import { Watchers } from "@/components/task/watchers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useAchievedTaskMutation,
  useTaskByIdQuery,
  useWatchTaskMutation,
} from "@/hooks/use-task";
import { useAuth } from "@/provider/auth-context";
import type { Project, Task } from "@/type";
import { format, formatDistanceToNow } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const TaskDetails = () => {
  const { user } = useAuth();
  const { taskId, projectId, workspaceId } = useParams<{
    taskId: string;
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();

  const { data, isLoading } = useTaskByIdQuery(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };
  const { mutate: watchTask, isPending: isWatching } = useWatchTaskMutation();
  const { mutate: achievedTask, isPending: isAchieved } =
    useAchievedTaskMutation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl font-bold text-muted-foreground">Task not found</div>
        </div>
      </div>
    );
  }

  const { task, project } = data;
  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher._id.toString() === user?._id.toString()
  );

  const goBack = () => navigate(-1);

  const members = task?.assignees || [];

  const handleWatchTask = () => {
    watchTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task watched");
        },
        onError: () => {
          toast.error("Failed to watch task");
        },
      }
    );
  };

  const handleAchievedTask = () => {
    achievedTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Task archieved");
        },
        onError: () => {
          toast.error("Failed to achieve task");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <BackButton />
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{task.title}</h1>
                  {task.isArchived && (
                    <Badge variant="outline" className="text-xs">
                      Archived
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge
                  variant={
                    task.priority === "High"
                      ? "destructive"
                      : task.priority === "Medium"
                      ? "default"
                      : "outline"
                  }
                  className="capitalize"
                >
                  {task.priority} Priority
                </Badge>
                <span>•</span>
                <span>
                  Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleWatchTask}
                disabled={isWatching}
                className="min-w-fit"
              >
                {isUserWatching ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Unwatch
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Watch
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleAchievedTask}
                disabled={isAchieved}
                className="min-w-fit"
              >
                {task.isArchived ? "Unarchive" : "Archive"}
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => {}}
                className="min-w-fit"
              >
                Delete Task
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Task Details Card */}
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="space-y-6">
                  {/* Title and Status */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <TaskTitle title={task.title} taskId={task._id} />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <TaskStatusSelector status={task.status} taskId={task._id} />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">Description</h3>
                    <TaskDescription
                      description={task.description || ""}
                      taskId={task._id}
                    />
                  </div>

                  {/* Task Properties */}
                  <div className="space-y-4">
                    <TaskAssigneesSelector
                      task={task}
                      assignees={task.assignees}
                      projectMembers={project.members as any}
                    />

                    <TaskPrioritySelector priority={task.priority} taskId={task._id} />
                  </div>

                  {/* Sub Tasks */}
                  <SubTasksDetails subTasks={task.subtasks || []} taskId={task._id} />
                </div>
              </div>

              {/* Comments Section */}
              <div className="rounded-lg border bg-card shadow-sm">
                <CommentSection taskId={task._id} members={project.members as any} />
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Watchers */}
            <div className="rounded-lg border bg-card shadow-sm">
              <Watchers watchers={task.watchers || []} />
            </div>

            {/* Activity */}
            <div className="rounded-lg border bg-card shadow-sm">
              <TaskActivity resourceId={task._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
