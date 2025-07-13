import type { Workspace } from "@/type";
import { Icon, type LucideIcon } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
    
    items:{
        title:string;
        href:string;
        icon:LucideIcon;
    }[];
    isCollapsed:boolean;
    className?:string;
    currentWorkspace:Workspace|null;


}

export const SidebarNav = ({
  items,
  isCollapsed,
  className,
  currentWorkspace,
  ...props
}: SidebarNavProps) => {
    const navigate = useNavigate();
    return (
        <nav className={cn("flex flex-col gap-y-2", className)} {...props}>
        {items.map((el) => {
            const Icon = el.icon;
            const isActive = window.location.pathname === el.href;

            const handleClick = () => {
                if (el.href === "/workspaces") {
                    navigate(el.href);
                }
                else if (currentWorkspace && currentWorkspace._id) {
                    navigate(`${el.href}/${currentWorkspace._id}`);
                }
                else {
                    navigate(el.href);
                }
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