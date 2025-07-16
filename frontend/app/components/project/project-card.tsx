import type{ Project } from "@/type";

interface ProjectCardProps {
    project: Project;
    progress: number;
    workspaceId: string;
}

export const ProjectCard = ({
    project,
    progress,
    workspaceId,
}:ProjectCardProps) =>{

    return <div>Project Card</div>
};