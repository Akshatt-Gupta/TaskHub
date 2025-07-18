import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signUpSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' // Don't forget to import Button
import { Link, useNavigate } from 'react-router' // Assuming you're using react-router for navigation
import { useSignUpMutation } from '@/hooks/use-auth'
import {toast} from "sonner" 


export type SignupFormData = z.infer<typeof signUpSchema>
const SignUp = ()=> {
  const navigate=useNavigate();
  const form = useForm<SignupFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      confirmPassword: ''

    },
    
  });
  
  const { mutate , isPending }=useSignUpMutation();
  

  const handleSubmit = (values:  SignupFormData) => {
    mutate(values,{
      onSuccess:()=>{
        toast.success("Account created succcessfully",{
          description:
          "Please check your Email for a verification link.If you dont't see it,please check your spam folder.",
        });
        form.reset();
        navigate("/sign-in")

      },
      onError : (error:any)=>{
        const errorMessage = error.response?.data?.message || "An error occurred";
        console.log(error);
        toast.error(errorMessage);

      },
    });
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
      <Card className='max-w-md w-full shadow-xl'>
        <CardHeader className='text-center mb-5 '>
          <CardTitle className='text-2xl font-bold '>Create an Account</CardTitle>
          <CardDescription className='text-sm text-muted-foreground '>Create an Account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Signing up..." : "Sign up"}
              </Button>
            </form>
          </Form>
          <CardFooter className='flex items-center justify-center mt-5'>
                <div className='flex items-center justify-center'>
                 <p className='text-sm text-muted-foreground'>
                  Already have an account?
                  <Link to="/sign-in">Sign In</Link>
                  </p>      
                </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUp