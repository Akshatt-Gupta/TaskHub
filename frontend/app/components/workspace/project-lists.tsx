import type { Project } from "@/type";
import { NoDataFound } from "./no-data-found";
import { ProjectCard } from "../project/project-card";

interface ProjectListProps {
    workspaceId: string;
    projects: Project[] | undefined; // Allow undefined
    onCreateProject: () => void;
} 

export const ProjectList = ({
    workspaceId,
    projects,
    onCreateProject,
}: ProjectListProps) => {
    // Handle undefined projects
    const projectList = projects || [];

    return (
        <div>
            <h3 className="text-xl font-medium mb-4">Projects</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projectList.length === 0 ? (
                    <NoDataFound
                        title="No Projects Found"
                        description="Create your first project to get started."
                        buttonText="Create Project"
                        buttonAction={onCreateProject}
                    />
                ) : (
                    projectList.map((project) => {
                        const projectProgress = 0; 
                        return (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                progress={projectProgress}
                                workspaceId={workspaceId}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};