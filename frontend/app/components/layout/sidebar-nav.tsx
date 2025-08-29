import type { Workspace } from "@/type";
import { Icon, type LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
  isCollapsed: boolean;
  className?: string;
  currentWorkspace: Workspace | null; // This prop is correctly passed but its usage needs refinement
}

export const SidebarNav = ({
  items,
  isCollapsed,
  className,
  currentWorkspace, // Keep this prop, as other components might use it
  ...props
}: SidebarNavProps) => {
  const navigate = useNavigate();

  return (
    <nav className={cn("flex flex-col gap-y-2", className)} {...props}>
      {items.map((el) => {
        const Icon = el.icon;
        // Compare the full path including search params for active state
        const isActive = window.location.pathname + window.location.search === el.href;

        const handleClick = () => {
          // Simply navigate to the href provided by the parent (SidebarComponent)
          // The SidebarComponent is responsible for constructing the correct href,
          // including any workspaceId query parameters for routes like Dashboard.
          // For global routes like My Tasks, it will just be '/my-tasks'.
          navigate(el.href);
        };

        return (
          <Button
            key={el.href}
            variant={isActive ? "outline" : "ghost"}
            className={cn("justify-start", isActive && "bg-blue-800/20 text-blue-600 font-medium")}
            onClick={handleClick}
          >
            <Icon className="mr-2 size-4" />
            {isCollapsed ? (
              <span className="sr-only">{el.title}</span>
            ) : (
              el.title
            )}
          </Button>
        );
      })}
    </nav>
  );
};
