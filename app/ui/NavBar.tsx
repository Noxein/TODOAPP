import React from 'react'
import { getAuth, logCookie } from '../actions'
import { signOut } from '../page/api/auth/[...nextauth]'

export const NavBar = async () => {
    const data = await getAuth()
    console.log(data)
  return (
    <div className='bg-blue-800 flex px-64 py-2 selection:bg-blue-950'>
        <div className='p-1 pr-4' >Hello <b>{data?.user?.name}</b></div>

        <form className='ml-auto' action={async ()=>{
          'use server';
          await signOut()
        }}>
          <button className='ml-auto p-2 bg-blue-500 hover:bg-blue-600 text-center rounded' type='submit'>Sign Out</button>
        </form>
    </div>
  )
}
