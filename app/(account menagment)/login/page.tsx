'use client'
import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { LoginUser, authenticate } from "@/app/actions"

export default function Login(){
    const[errorMessage,dispatch] = useFormState(authenticate,undefined)
    
    return(
        <main className="grid justify-center content-center h-screen bg-blue-100">
            <form action={dispatch} className="bg-blue-500 w-96 p-4 flex flex-col gap-1 mb-2 rounded">
                <label htmlFor="Login">Login</label>
                <input type="text" id="Login" name="name" className="text-black pl-1"/>

                <label htmlFor="Password">Password</label>
                <input type="password" id="Password" name="password" className="text-black pl-1"/>

                <div className="text-red-800 ">
                    {errorMessage}
                </div>
                <ButtonStatus />
                
            </form>
            <div className="bg-blue-600 p-4 rounded text-center">
                HEY! Dont have account yet? <Link href="register"  className="text-blue-200 hover:text-white">Sign up</Link> here
            </div>
        </main>
    )
}

const ButtonStatus = () => {
    const { pending } = useFormStatus()
    return (
        <button className="bg-blue-800 mt-2 p-1 rounded" type="submit">{!pending?'Login':'...'}</button>
    )
}