import Workspace from "../models/workspace.js"
import Project from "../models/project.js"


export const createProject= async (req,res)=>{
    try {
        const {workspaceId} = req.params;
        const {title,description,status,startDate,dueDate,tags,members}=req.body
        const workspace=await Workspace.findById(workspaceId);

        if(!workspace){
            return res.status(404).json({message:"Workspace not found"});
        }

        // Changed: Access member.user._id for comparison
        const isMemeber = workspace.members.some((member) => member.user.toString() === req.user._id.toString());

        if(!isMemeber){
            // Changed: Added return here to prevent further execution
            return res.status(403).json({message:"You are not a member of this workspace"});
        }

        const tagArray= tags ? tags.split(","):[];

        const newProject=await Project.create({
            title,
            description,
            status,
            startDate,
            dueDate,
            tags:tagArray,
            workspace:workspaceId,
            members,
            createdBy:req.user._id,
        });
        
        workspace.projects.push(newProject._id);
        await workspace.save();

        return res.status(201).json(newProject);


    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"});
    }
}