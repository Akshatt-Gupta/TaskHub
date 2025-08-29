import { useAuth } from "@/provider/auth-context";
import type { Workspace } from "@/type";
import { CheckCircle2, ChevronLeft, Wrench, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "./sidebar-nav";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";
import { LayoutDashboard, Users, ListCheck, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export const SidebarComponent = ({
  currentWorkspace,
}: {
  currentWorkspace: Workspace | null;
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamically construct the href for the Dashboard link
  // If a currentWorkspace is selected, append its ID as a query parameter
  const dashboardHref = currentWorkspace ? `/dashboard?workspaceId=${currentWorkspace._id}` : "/dashboard";

  const navItems = [
    {
      title: "Dashboard",
      href: dashboardHref, // Use the dynamically created href
      icon: LayoutDashboard,
    },
    {
      title: "Workspaces",
      href: "/workspaces",
      icon: Users,
    },
    {
      title: "My Tasks",
      href: "/my-tasks",
      icon: ListCheck,
    },
    {
      title: "Members",
      href: "/members",
      icon: Users,
    },
    {
      title: "Archieved",
      href: "/archieved",
      icon: CheckCircle2,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        isCollapsed ? "w-16 md:w-20" : "w-16 md:w-64"
      )}
    >
      <div className="flex h-14 items-center border-b px-4 mb-4">
        {/* The main logo/title link should also respect the workspaceId */}
        <Link to={dashboardHref} className="flex items-center">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <Wrench className="size-6 text-blue-600" />
              <span className="font-semibold text-lg hidden md:block">
                TaskHub
              </span>
            </div>
          ) : (
            <Wrench className="size-6 text-blue-600" />
          )}
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto hidden md:block"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>


      <ScrollArea className="flex-1 px-3 py-2">
        <SidebarNav
          items={navItems}
          isCollapsed={isCollapsed}
          className={cn(isCollapsed && "items-center space-y-2")}
          currentWorkspace={currentWorkspace} // Ensure this is still passed if SidebarNav uses it
        />
      </ScrollArea>

      <div>
        <Button variant={"ghost"} size={isCollapsed ? "icon" : "default"} onClick={logout}>
          <LogOut className={cn("size-4", isCollapsed && "mr-2")} />
          <span className="hidden md:block">Logout</span>
        </Button>
      </div>

    </div>
  );
};
