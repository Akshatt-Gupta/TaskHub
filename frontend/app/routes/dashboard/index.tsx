import { RecentProjects } from "@/components/dashboard/recent-project";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/statistics-charts";
import { Loader } from "@/components/loader";
import { UpcomingTasks } from "@/components/upcoming-tasks"; 
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/type";
import { useSearchParams } from "react-router";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");

  const { data, isPending } = useGetWorkspaceStatsQuery(workspaceId) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    } | undefined; // Data undefined possiblity handled
    isPending: boolean;
  };

  // Show loader if data is still pending or not yet available
  if (isPending || !data) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  // Render the dashboard content once data is available
  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Conditionally render components only if their respective data is available */}
      {data.stats && <StatsCard data={data.stats} />}

      {data.taskTrendsData && data.projectStatusData && data.taskPriorityData && data.workspaceProductivityData && (
        <StatisticsCharts
          stats={data.stats}
          taskTrendsData={data.taskTrendsData}
          projectStatusData={data.projectStatusData}
          taskPriorityData={data.taskPriorityData}
          workspaceProductivityData={data.workspaceProductivityData}
        />
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {data.recentProjects && <RecentProjects data={data.recentProjects} />}
        {data.upcomingTasks && <UpcomingTasks data={data.upcomingTasks} />}
      </div>
    </div>
  );
};

export default Dashboard;
