import type { Workspace } from "@/type";
import React from "react";
import { Button } from "../ui/button";
import { Bell, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/provider/auth-context";
import { Link } from "react-router";
import { WorkspaceAvatar } from "../workspace/workspace-avatar";

interface HeaderProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
  onCreateWorkspace: () => void;
}

export const Header = ({
  onWorkspaceSelected,
  selectedWorkspace,
  onCreateWorkspace,
}: HeaderProps) => {
  const { user, logout } = useAuth();
  const workspaces = [];

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              {selectedWorkspace ? (
                <>
                  {selectedWorkspace?.color && (
                    <WorkspaceAvatar
                      color={selectedWorkspace.color}
                      name={selectedWorkspace.name}
                    />
                  )}
                  <span className="font-medium">{selectedWorkspace?.name}</span>
                </>
              ) : (
                <span className="font-medium">Select Workspace</span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56 bg-white shadow-lg rounded-md border p-2">
            <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-700">
              Workspace
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-100 my-1" />
            
            <DropdownMenuGroup className="space-y-1">
              {workspaces.map((ws) => (
                <DropdownMenuItem 
                  key={ws._id} 
                  onClick={() => onWorkspaceSelected(ws)}
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {ws.color && (
                    <WorkspaceAvatar color={ws.color} name={ws.name} />
                  )}
                  <span className="ml-2">{ws.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-gray-100 my-1" />
            
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={onCreateWorkspace}
                className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Workspace
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="ml-auto">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full border p-1 w-8 h-8">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 bg-white shadow-lg rounded-md">
              <DropdownMenuLabel className="px-4 py-2 font-medium">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-100" />
              
              <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <Link to="/user/profile" className="w-full">Profile</Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem 
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-red-600"
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};