import React, { SetStateAction } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { deleteToDo, updateToDo } from '../actions'
type todo = {
  message:string,isCompleted:boolean,id:string
}[]

export const Todo = ({message,isCompleted,id}:{message:string,isCompleted:boolean,id:string}) => {
const classes = ()=>{
  return isCompleted?'bg-blue-500':
  'bg-blue-950'
}
  const initialState = {
    message: '',
    errors: { }
  }
  const deleteWithId = deleteToDo.bind(null,id)
  const updateWithId = updateToDo.bind(null,id,isCompleted)
  const [DeleteStatus,deleteDispatch] = useFormState(deleteWithId,initialState)
  const [UpdateStatus,updateDispatch] = useFormState(updateWithId,initialState)
  
return (
    <section className='flex gap-2' >
      <form className={`${classes()} flex justify-between p-2 flex-1`} action={updateDispatch}>
        <div >
            {message}
          </div>
        <DeleteButton classes={false}>{isCompleted?"Done":"In Progress"}</DeleteButton>
      </form>

      <form action={deleteDispatch}>
        <DeleteButton>Del</DeleteButton>
      </form>
    </section>

  )
}

const DeleteButton = ({children,classes=true,...rest}:{children: React.ReactNode,classes?:boolean}&React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) =>{
  const { pending } = useFormStatus()
  return (
    <button className={`${classes?'justify-self-center self-center text-white bg-slate-800 p-2 disabled:text-gray-500':''}`} type='submit' disabled={pending} {...rest}> 
      {children}
  </button>
  )
}