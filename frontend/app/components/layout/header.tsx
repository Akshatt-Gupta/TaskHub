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
// Corrected import path for Avatar components to use your local UI library
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; 
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { useAuth } from "@/provider/auth-context";
import { Link, useLoaderData } from "react-router";
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
  
    // Safely destructure 'workspaces' from useLoaderData().
    // If useLoaderData() returns null or an object without 'workspaces',
    // 'workspaces' will default to an empty array, preventing the error.
  const { workspaces = [] } = useLoaderData() as { workspaces?: Workspace[] };

  return (
    <div className="bg-background sticky top-0 z-40 border-b">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              {selectedWorkspace ? (
                <>
                  <WorkspaceAvatar
                    color={selectedWorkspace.color}
                    name={selectedWorkspace.name}
                  />
                  <span className="font-medium">{selectedWorkspace.name}</span>
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

            <DropdownMenuSeparator />

            <DropdownMenuGroup className="space-y-1">
                {/* Ensure workspaces is an array before mapping */}
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws._id}
                  onClick={() => onWorkspaceSelected(ws)}
                  className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0"
                >
                  <WorkspaceAvatar color={ws.color} name={ws.name} />
                  <span className="ml-2">{ws.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={onCreateWorkspace}
                className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer transition-colors focus:outline-none focus:ring-0 focus:ring-offset-0"
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
  <button className="rounded-full p-0 w-8 h-8 bg-black overflow-hidden">
    <Avatar className="w-full h-full">
      <AvatarImage 
        src={user?.profilePicture} 
        alt={user?.name} 
        className="object-cover"
      />
      <AvatarFallback className="w-full h-full bg-black text-white flex items-center justify-center">
        {user?.name?.charAt(0)?.toUpperCase()}
      </AvatarFallback>
    </Avatar>
  </button>
</DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 bg-white shadow-lg rounded-md"
            >
              <DropdownMenuLabel className="px-4 py-2 font-medium">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-100" />

              <DropdownMenuItem className="px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <Link to="/user/profile" className="w-full">
                  Profile
                </Link>
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
