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
    console.log("Arcjet decision details:", {
  isDenied: decision.isDenied(),
  reason: decision.reason, 
  email: email 
});
    if (decision.isDenied()) {
  return res.status(403).json({ 
    message: "Email validation failed",
    reason: decision.reason 
  });
}
    

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
    //---------------------------------------------------email verification link---------
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
    const emailSubject = "Verify your email";
  //---------------------------------------------------send email---------------------------
    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    if (!isEmailSent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    return res.status(201).json({
      message: "Verification email sent successfully. Please check your inbox.",
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const {email,password}=req.body;
      const user = await User.findOne({ email })
        .select("+password")
      
    if(!user){
      return res.status(400).json({message:"Invalid Email or password"});
    }
    if(!user.isEmailVerified){
      const existingVerification=await Verification.findOne({
        userId:user._id,
      });
    

    if(existingVerification && existingVerification.expiresAt>new Date()){
      return res.status(400).json({
        message:"Email not verified.Please check your inbox for verification link"
      });
    }
    else{
      await Verification.findByIdAndDelete({_id:existingVerification._id});
      const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
      await Verification.create({
        userId:user._id,
        token:verificationToken,
        expiresAt: new Date(Date.now()+ 60*60*1000),
      });

      const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;
    const emailSubject = "Verify your email";

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    if (!isEmailSent) {
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    return res.status(201).json({
      message: "Verification email sent successfully. Please check your inbox.",
    });
  }
    }

    const isPasswordValid= await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
      return res.status(400).json({
        message:"Invalid Email or Password",
      });
    }
    const token=jwt.sign(
      {userId:user._id,purpose:"login"},
      process.env.JWT_SECRET,
      {expiresIn:"7d"},
    );
    user.lastLogin=new Date();
    await user.save();

    const userData=user.toObject();
    delete userData.password;
    
    res.status(200).json({
      message:"Login Successful",
      token,
      user,
    })

  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { userId, purpose } = payload;
    if (purpose !== "email verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiresAt < new Date();
    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email Already Verified" });
    }
    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);
    
    return res.status(200).json({ message: "Email Verification Successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

};

const resetPasswordRequest= async(req,res)=>{
  try {
    const {email}=req.body;
    const user = await User.findOne({ email })
      .select("+password")
      //.maxTimeMS(30000); // Increase timeout to 30 seconds

    if(!user){
      return res.status(400).json({message:"User not found"});
    }

    if(!user.isEmailVerified){
      return res.status(400).json({message:"Please Verify Your Email First"});
    }

    const existingVerification=await Verification.findOne({userId:user._id,});
    if(existingVerification && existingVerification.expiresAt>new Date()){
      return res.status(400).json({
        message:"Reset password request already sent",
      });
    }
    if(existingVerification && existingVerification<new Date()){
      await Verification.findByIdAndDelete(existingVerification._id);
    }

    const resetPasswordToken=jwt.sign(
      {userId:user._id,purpose:"reset-password"},
      process.env.JWT_SECRET,
      {expiresIn:"15m"}
    );

    await Verification.create({
      userId:user._id,
      token:resetPasswordToken,
      expiresAt:new Date(Date.now()+ 15*60*1000),
    });

    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
    const emailBody = `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password</p>`;
    const emailSubject = "Reset Password";

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);
    if (!isEmailSent) {
      return res.status(500).json({ message: "Failed to send reset-password email" });
    }

    return res.status(200).json({
      message: "Reset password email sent successfully. Please check your inbox.",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal server Error"})
  }
}
const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    console.log('=== RESET PASSWORD DEBUG START ===');
    console.log('1. Request body:', req.body);
    console.log('2. Request body keys:', Object.keys(req.body));
    
    const { token, newPassword, confirmPassword } = req.body;
    
    console.log('3. Extracted values:');
    console.log('   - token exists:', !!token);
    console.log('   - token length:', token?.length);
    console.log('   - newPassword exists:', !!newPassword);
    console.log('   - confirmPassword exists:', !!confirmPassword);

    if (!token) {
      console.log('4. ERROR: No token provided');
      return res.status(401).json({ message: "Token is required" });
    }

    console.log('5. Attempting to verify JWT token...');
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log('6. JWT verification successful:', payload);
    } catch (jwtError) {
      console.log('6. JWT verification failed:', jwtError.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { userId, purpose } = payload;
    console.log('7. Token payload - userId:', userId, 'purpose:', purpose);

    if (purpose !== "reset-password") {
      console.log('8. ERROR: Purpose mismatch. Expected: "reset password", Got:', purpose);
      return res.status(401).json({ message: "Invalid token purpose" });
    }

    console.log('9. Looking for verification record...');
    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      console.log('10. ERROR: Verification record not found');
      console.log('    - userId:', userId);
      console.log('    - token (first 50 chars):', token?.substring(0, 50));
      
      // Let's also check what verification records exist for this user
      const allUserVerifications = await Verification.find({ userId });
      console.log('    - All verification records for user:', allUserVerifications.length);
      allUserVerifications.forEach((v, index) => {
        console.log(`    - Record ${index}: token matches:`, v.token === token, 'expires:', v.expiresAt);
      });
      
      return res.status(401).json({ message: "Verification record not found" });
    }

    console.log('11. Verification record found');
    console.log('    - expiresAt:', verification.expiresAt);
    console.log('    - current time:', new Date());

    const isTokenExpired = verification.expiresAt < new Date();
    if (isTokenExpired) {
      console.log('12. ERROR: Token expired');
      return res.status(401).json({ message: "Token expired" });
    }

    console.log('13. Looking for user...');
    const user = await User.findById(userId);

    if (!user) {
      console.log('14. ERROR: User not found');
      return res.status(401).json({ message: "User not found" });
    }

    console.log('15. User found, checking password match...');
    if (newPassword !== confirmPassword) {
      console.log('16. ERROR: Passwords do not match');
      return res.status(400).json({ message: "Passwords do not match" });
    }

    console.log('17. Hashing new password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log('18. Updating user password...');
    user.password = hashedPassword;
    await user.save();

    console.log('19. Deleting verification record...');
    await Verification.findByIdAndDelete(verification._id);
    
    console.log('20. SUCCESS: Password reset completed');
    console.log('=== RESET PASSWORD DEBUG END ===');
    
    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    console.error('=== RESET PASSWORD ERROR ===');
    console.error('Error details:', error);
    console.error('Error stack:', error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export { registerUser, loginUser, verifyEmail, resetPasswordRequest, verifyResetPasswordTokenAndResetPassword };
