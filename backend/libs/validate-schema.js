import {z} from "zod";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
const loginSchema = z.object({
    
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});
const verifyEmailSchema=z.object({
    token:z.string().min(1,"Token is requires"),
})

export {registerSchema, loginSchema,verifyEmailSchema};