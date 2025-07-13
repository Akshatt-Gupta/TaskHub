import { forgotPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Card,CardHeader,CardContent } from "@/components/ui/card";
import { ArrowLeft,CheckCircle,Loader2 } from "lucide-react";
import {Link} from "react-router"
import { useForgotPasswordMutation } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {toast} from "sonner";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const { mutate : forgotPassword , isPending}=useForgotPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data,{
      onSuccess: ()=>{
        setIsSuccess(true);

      },
      onError:(error:any)=>{
        const errorMessage=error.response?.data?.message || "An error has occurred";
        console.log(error);
        toast.error(errorMessage);
        
      }
    })
  };

   return (
  <div className="flex flex-col items-center justify-center h-screen">
    <div className="w-full max-w-md space-y-6">
      <div className="flex flex-col items-center justify-center space-y-2">
        <h1 className="text-2xl font bold ">Forget Password</h1>
        <p className="text-muted-foreground">Enter your Email to reset your password</p>
      </div>
      <Card>
        <CardHeader>
          <Link to="/sign-in" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign in</span>
          </Link>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
              <h1 className="text-2xl font-bold">
                Password reset email sent
              </h1>
              <p className="text-muted-foreground">
                Check your email for a link to reset your password
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter your email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
);
}

export default ForgotPassword;