import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/send-email.js";
import aj from "../libs/arcjet.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //email verification with arcjet
    const decision = await aj.protect(req, { email });
    console.log("Arcjet decision", decision.isDenied());
    if (decision.isDenied()) {
      
        res.writeHead(403, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid Email Address" }));
      
    }
    //email verification done with arcjet
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Await user creation to get the user object
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create verification document
    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    // Create verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
    const emailSubject = "Verify your email";

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    return res.status(201).json({
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // ...login logic...
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const verifyEmail = async (req, res) => {
  try {
    const {token}=req.body;
    const payload=jwt.verify(token,process.env.JWT_SECRET);

    const {usedId,purpose}=payload;
    if(purpose!=="email verification"){
        return res.status(401).json({message:"Unauthorized"});
    }

    const verification=await Verification.findOne({
        userId,
        token,
    });

    if(!verification){
        return res.status(401).json({message:"Unauthorized"});
    }

    const isTokenExpired=verification.expiresAt<new Date();
    if(isTokenExpired){
        return res.status(401).json({message:"Token expired"});
    }
    
    const user=await User.findById(userId);
    if(!user){
        return res.status(401).json({message:"Unauthorized"});
    }
    if(user.isEmailVerified){
        return res.status(400).json({message:"Email Already Verified"});
    }
    user.isEmailVerified=true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);
    
    res.status(200).json({message:"Email Verification Successful"});

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export { registerUser, loginUser, verifyEmail };
