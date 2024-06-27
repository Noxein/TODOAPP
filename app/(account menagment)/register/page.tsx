'use client'
import Link from "next/link"
import { useFormState, useFormStatus } from "react-dom"
import { RegisterUser } from "@/app/actions"

export default function Register(){
    const initState = {errors: { },
      message:  '',
    }
    const[state,dispatch] = useFormState(RegisterUser,initState)
    return(
        <main className="grid justify-center content-center h-screen bg-blue-100">
            <form action={dispatch} className="bg-blue-500 w-96 p-4 flex flex-col gap-1 mb-2 rounded">
                <label htmlFor="Login">Login</label>
                <input type="text" id="Login" name="login" className="text-black pl-1"/>
                <div className="text-red-800 ">
                    {state?.errors?.login?.map(err=>(
                        <div>{err}</div>
                    ))}
                </div>

                <label htmlFor="Password">Password</label>
                <input type="password" id="Password" name="password" className="text-black pl-1"/>
                <div className="text-red-800">
                    {state?.errors?.password?.map(err=>(
                        <div>! {err}</div>
                    ))}
                </div>

                <label htmlFor="ConfrimPassword">Confirm Password</label>
                <input type="password" id="ConfirmPassword" name="confirmpassword" className="text-black pl-1"/>
                <div className="text-red-800">
                    {state?.errors?.confirmpassword?.map(err=>(
                        <div>! {err}</div>
                    ))}
                </div>

                <label htmlFor="Email">Email</label>
                <input type="email" id="Email" name="email" className="text-black pl-1"/>
                <div className="text-red-800">
                    {state?.errors?.email?.map(err=>(
                        <div>! {err}</div>
                    ))}
                </div>

                <ButtonStatus />
            </form>
            <div className="bg-blue-600 p-4 rounded text-center">
                HEY! Already have account? <Link href="login"  className="text-blue-200 hover:text-white">Login</Link> here
            </div>
        </main>
    )
}

const ButtonStatus = () => {
    const { pending } = useFormStatus()
    return (
        <button className="bg-blue-800 mt-2 p-1 rounded" type="submit">{!pending?'Sign up':'...'}</button>
    )
}