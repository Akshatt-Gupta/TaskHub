import type { Workspace } from "@/type";
import { Link, useLoaderData } from "react-router";  
import { useState } from "react";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace"; 
import { Loader, Users } from "lucide-react";
import CreateWorkspace from "@/components/workspace/create-workspace";
import { Button } from "@/components/ui/button";
import { PlusCircle,User } from "lucide-react";
import  {NoDataFound}  from "@/components/workspace/no-data-found";
import {Card, CardContent, CardHeader, CardTitle,CardDescription} from "@/components/ui/card";
import { WorkspaceAvatar } from "@/components/workspace/workspace-avatar";
import { format } from "date-fns";


const Workspaces=()=>{
    const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
    const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
        data:Workspace[];
        isLoading: boolean;
    }

    if(isLoading){
        return <Loader/>
    }


    return <>
        <div className="space-y-8">
            <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>

            <Button onClick={() => setIsCreatingWorkspace(true)} >
                <PlusCircle className="size-4 mr-2"/>
                New Workspace
            </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3">
                {workspaces.map((ws)=>(
                        <WorkspaceCard key={ws._id} workspace={ws}/>
                        ))}
                        {
                            workspaces.length===0  && <NoDataFound
                            title="No Workspaces Found"
                            description="You haven't created any workspaces yet. Click the button below to create your first workspace."
                            buttonText="Create Workspace"
                            buttonAction={() => setIsCreatingWorkspace(true)}
                            />
                        }
            </div>
        </div>

        <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
        />
        </>
};
const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
    return (
        <Link to={`/workspaces/${workspace._id}`}>
            <Card className="transition-all hover:shadow-md hover:-translate-y-1">
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <WorkspaceAvatar name={workspace.name} color={workspace.color}></WorkspaceAvatar>
                            <div>
                                <CardTitle>{workspace.name}</CardTitle>
                                <span className="text-sm text-muted-foreground">
                                    Created at {format(workspace.createdAt, "MM/d/yyyy h:mm a")}
                                </span>
                            </div>
                        </div>

                    <div>
                        <Users className="size-4 mr-1" />
                            <span className="text-xs">{workspace.members.length}</span> 
                    </div>
                    </div>
                    <CardDescription>
                        {workspace.description || "No description."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        View workspace details and projects
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
export default Workspaces