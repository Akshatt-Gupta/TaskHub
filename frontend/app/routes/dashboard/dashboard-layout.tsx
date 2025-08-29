import { useAuth } from '@/provider/auth-context';
import React, { useState, useEffect } from 'react';
import { Loader } from "@/components/loader";
import { Navigate, useLocation, useLoaderData, useNavigate, useSearchParams } from 'react-router';
import { Outlet } from 'react-router';
import { Header } from '@/components/layout/header';
import type { Workspace } from '@/type/index';
import { SidebarComponent } from '@/components/layout/sidebar-component';
import { CreateWorkspace } from '@/components/workspace/create-workspace';
import { fetchData } from '@/lib/fetch-util';

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchData('/workspaces')]);
    return { workspaces };
  } catch (error) {
    console.error("Error loading workspaces:", error);
    return { workspaces: [] }; // Return empty array 
  }
}

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const workspaceIdFromUrl = searchParams.get("workspaceId");

  // Effect to handle initial workspace selection and URL update
  useEffect(() => {
    if (!isLoading && isAuthenticated && workspaces && workspaces.length > 0) {
      // If no workspaceId in URL, or the one in URL is invalid, default to the first workspace
      const foundWorkspace = workspaces.find(ws => ws._id === workspaceIdFromUrl);

      if (!workspaceIdFromUrl || !foundWorkspace) {
        const firstWorkspace = workspaces[0];
        setCurrentWorkspace(firstWorkspace);
        // Navigate to update the URL with the selected workspaceId, preserving the base path
        const basePath = location.pathname.split('?')[0];
        navigate(`${basePath}?workspaceId=${firstWorkspace._id}`, { replace: true });
      } else if (foundWorkspace) {
        // If workspaceId is in URL and valid, set the current workspace
        setCurrentWorkspace(foundWorkspace);
      }
    } else if (!isLoading && isAuthenticated && (!workspaces || workspaces.length === 0)) {
      // If no workspaces exist and user is authenticated, clear currentWorkspace
      setCurrentWorkspace(null);
      // Optionally, navigate to a page prompting workspace creation or showing an empty state
      // For now, we'll just ensure no workspaceId is in the URL if no workspaces exist
      if (workspaceIdFromUrl) {
          const basePath = location.pathname.split('?')[0];
          navigate(basePath, { replace: true });
      }
    }
  }, [isLoading, isAuthenticated, workspaces, workspaceIdFromUrl, navigate, location.pathname]);


  if (isLoading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    // Ensure navigation updates the URL correctly for any page
    const basePath = location.pathname.split('?')[0]; // Get path without existing query params
    navigate(`${basePath}?workspaceId=${workspace._id}`);
  };

  return (
    <div className="flex h-screen w-full">
      <SidebarComponent
        currentWorkspace={currentWorkspace} 
      />

      <div className="flex flex-1 flex-col h-full">
        <Header
          onWorkspaceSelected={handleWorkspaceSelected}
          selectedWorkspace={currentWorkspace}
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
        />

        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;
