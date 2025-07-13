import Workspace from "../models/workspace.js";


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
export default createWorkspace;