import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be 8 characters' }),
  name: z.string().min(3, { message: 'Name must be at least 2 characters' }),
  confirmPassword: z.string().min(8, { message: 'Confirm Password must be 8 characters' })
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});