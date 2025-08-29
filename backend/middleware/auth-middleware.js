    import jwt from 'jsonwebtoken';
    import User from '../models/user.js'; 
    const authMiddleware = async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];  
            if(!token){
                return res.status(401).json({ message: "Authentication token is required" });
            }

            const decoded= jwt.verify(token, process.env.JWT_SECRET);
            if(!decoded){
                return res.status(401).json({ message: "Invalid authentication token" });
            }
            
            const user = await User.findById(decoded.userId);
            if(!user){
                return res.status(404).json({ message: "User not found" });
            }

            req.user = user;  
            
            next();  
        } catch (error) {
            console.error("Authentication error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    };
    export default authMiddleware;