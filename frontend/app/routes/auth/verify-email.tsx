import {useState,useEffect} from 'react'
import { Link,useSearchParams } from 'react-router'
import {Card,CardContent,CardHeader} from "@/components/ui/card"
import {ArrowLeft, CheckCircle, XCircle,Loader} from "lucide-react"
import { Button } from '@/components/ui/button'


function VerifyEmail() {
  const [searchParams]=useSearchParams()
  const [isSuccess,setIsSuccess]=useState(false);
  const isVerifying=false;

  useEffect(() => {
    const token=searchParams.get("token");

    if(!token){
      setIsSuccess(false);
    }
    else{
      setIsSuccess(false);
    }

  
    
  }, [searchParams])
  

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>Verify Email</h1>
      <p className='text-sm text-gray-500 '>verifying your email...</p>
      
      <Card className='w-full max-w-md'>
        {/* <CardHeader>
          <Link to="/sign-in" className='flex items-center gap-2 text-sm'>
          <ArrowLeft className='w-4 h-4 mr-2'/>
          Back to Sign In
          </Link>
        </CardHeader> */}
        <CardContent>
          <div className='flex flex-col items-center justify-center py-6'>
            {isVerifying?(
              <>
              <Loader className='w-10 h-10 text-gray-500 animate-spin'/>
              <h3 className='text-lg font-semibold'>Verifying Email....</h3>
              <p className='text-sm text-gray-500'>
                Please Wait while we verify your email.
              </p>

              </>
            ) : isSuccess ? (
              <>
              <CheckCircle className='w-10 h-10 text-green-500'/>
              <h3 className='text-lg font-semibold'>Email Verified</h3>
              <p className='text-sm text-gray-500'>
                Your Email have been verified succcessfully.
              </p>
              <Link to="/sign-in" className='text-sm text-blue-500 mt-6'>
              <Button variant="outline"> Back to Sign in</Button>
              </Link>
              </>
            ):(
              <>
              <XCircle className='w-10 h-10 text-red-500'/>
              <h3 className='text-lg font-semibold'>Email Verification Failed</h3>
              <p className='text-sm text-gray-500'>
                Your Email verification is failed. Please try again later.
              </p>
              <Link to="/sign-in" className='text-sm text-blue-500 mt-6'>
              <Button variant="outline"> Back to Sign in</Button>
              </Link>
              </>
              
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyEmail