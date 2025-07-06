import React from 'react'
import { Outlet } from 'react-router'
function SignIn() {
  return (
    <div className=''>
        <Outlet/>
        Login
    </div>
  )
}

export default SignIn