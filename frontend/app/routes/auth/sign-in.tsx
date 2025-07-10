import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { signInSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button' // Don't forget to import Button
import { Link, useNavigate } from 'react-router' // Assuming you're using react-router for navigation
import { useLoginMutation } from '@/hooks/use-auth'
import {toast} from "sonner"
import { Loader, Loader2 } from 'lucide-react'


type SigninFormData = z.infer<typeof signInSchema>

function SignIn() {
  const navigate=useNavigate();
  const form = useForm<SigninFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  }); 
  const { mutate, isPending } = useLoginMutation();
  

  const handleSubmit = (data: SigninFormData) => {
    mutate(data, {
      onSuccess: (data) => {
        console.log(data);
        toast.success("Login Successful");
        navigate("/dashboard");
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || "An error Occurred";
        console.log(error);
        toast.error(errorMessage);
      }
    });
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4'>
      <Card className='max-w-md w-full shadow-xl'>
        <CardHeader className='text-center mb-5 '>
          <CardTitle className='text-2xl font-bold '>Welcome Back</CardTitle>
          <CardDescription className='text-sm text-muted-foreground '>Sign in to your Account</CardDescription>
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
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <Link to="/forgot-password" className='text-sm text-blue-600'>Forgot Password</Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Loader2 className='w-4 h-4 mr-2'/> : "Sign-in" }
                
              </Button>
            </form>
          </Form>
          <CardFooter className='flex items-center justify-center mt-5'>
                <div className='flex items-center justify-center'>
                 <p className='text-sm text-muted-foreground'>
                  Don&apos;t have an account?
                  <Link to="/sign-up">Sign up</Link>
                  </p>      
                </div>
          </CardFooter>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignIn