import { useState } from "react";
import { useParams } from "react-router";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";
import type { Workspace, Project } from "@/type";
import { Loader } from "lucide-react";
import { WorkspaceHeader } from "@/components/workspace/workspace-header";
import { ProjectList } from "@/components/workspace/project-lists";
import { CreateProjectDialog } from "@/components/project/create-project";

const WorkspaceDetails = () => {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const [isCreateProject, setIsCreateProject] = useState(false);
    const [isInviteMember, setIsInviteMember] = useState(false);

    if (!workspaceId) {
        return <div className="text-red-500">No Workspace found.</div>;
    }

    const { data, isLoading, error } = useGetWorkspaceQuery(workspaceId) as {
        data: { workspace: Workspace; projects: Project[]; members: any[] };
        isLoading: boolean;
        error: any;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">Error loading workspace.</div>;
    }

    if (!data?.workspace) {
        return <div className="text-red-500">Workspace not found.</div>;
    }

    return (
        <div className="space-y-8">
            <WorkspaceHeader
                workspace={data.workspace}
                members={data.workspace.members as any}
                onCreateProject={() => setIsCreateProject(true)}
                onInviteMember={() => setIsInviteMember(true)}
            />
            <ProjectList
                workspaceId={workspaceId}
                projects={data.projects}
                onCreateProject={() => setIsCreateProject(true)}
            />

            <CreateProjectDialog
                isOpen={isCreateProject}
                onOpenChange={setIsCreateProject} // Changed: now accepts boolean directly
                workspaceId={workspaceId}
                workspaceMembers={data.workspace.members as any}
            />
        </div>
    );
};

export default WorkspaceDetails;