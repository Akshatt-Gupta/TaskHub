import Workspace from "../models/workspace.js";
import Project from "../models/project.js";

const createWorkspace = async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const owner = req.user._id;  // Get the owner from the authenticated user

        const workspace = await Workspace.create({
            name,
            description,
            color,
            owner:req.user._id,
            members: [{
                user: req.user._id,   
                role: "owner",
                joinedAt: new Date(),
            }]
        });
        

        res.status(201).json(workspace);
    } catch (error) {
        console.error("Error creating workspace:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await Workspace.find({ "members.user": req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(workspaces); 
    } catch (error) {
        console.error("Error fetching workspaces:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getWorkspaceDetails = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user._id;

    
    const workspace = await Workspace.findById(workspaceId)
      .populate({
        path: "members.user",
        select: "name email profilePicture",
      })
      .populate({
        path: "owner",
        select: "name email profilePicture",
      });

    if (!workspace) {
      return res.status(404).json({ 
        message: "Workspace not found" 
      });
    }

    // Check if user is a member or owner
    const isMember = workspace.members.some(
      (member) => member.user._id.toString() === userId.toString()
    );
    const isOwner = workspace.owner._id.toString() === userId.toString();

    if (!isMember && !isOwner) {
      return res.status(404).json({ 
        message: "Workspace not found or you are not a member" 
      });
    }

    res.status(200).json({
      success: true,
      workspace,
    });
  } catch (error) {
    console.error("Error fetching workspace details:", error);
    res.status(500).json({ 
      message: "Internal server error" 
    });
  }
};

const getWorkspaceProjects = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        const workspace = await Workspace.findOne({
            _id: workspaceId,
            "members.user": req.user._id,  
        }).populate("members.user", "name email profilePicture");
        
        
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found or you are not a member" });
        }

        const projects = await Project.find({
            workspace: workspaceId,
            isArchived: false,
            members: { $in: [req.user._id] },
        })
        .populate("tasks","status")
        .sort({ createdAt: -1 });

        res.status(200).json({projects, workspace});

    } catch (error) {
        console.log("Error fetching workspace projects:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export {createWorkspace, getWorkspaces,getWorkspaceDetails,getWorkspaceProjects};