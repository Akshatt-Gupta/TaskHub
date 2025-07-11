import { useAuth } from '@/provider/auth-context';
import React from 'react'
import { Navigate,Outlet } from 'react-router';

function AuthLayout() {
  const {isAuthenticated,isLoading}=useAuth();

  if( isLoading) {
    return <div>Loading...</div>;
  }
  if(isAuthenticated) {
    return <Navigate to="/dashboard" />;
  } 
  
  return (
    <div>
        <Outlet/>

    </div>
  )
}

export default AuthLayout