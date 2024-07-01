'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Todo } from './todo'
import { addToDo, getTodos } from '../actions'
import { useFormState, useFormStatus } from 'react-dom'

const initTodos = [
{
    id:1,
    message:'Uprać buty',
    isCompleted:true,
},
{
    id:2,
    message:'Odebrać samochód od mechanika',
    isCompleted:false,
},
]

let currentNumber = 3
export const ToDoList = ({todos}:{todos:{id:string,note:string,userid:string,status:boolean}[]|undefined}) => {
    const initState = {errors: { todo:'' },
    message:  '',
  }
  const formRef = useRef<HTMLFormElement|null>(null)
    const[state,dispatch] = useFormState(addToDo,initState)
    
    formRef.current?.reset()

  return (
    <div className='w-1/2 flex flex-col gap-1'>
        {todos && todos.map(todo=>(
            <Todo key={todo.id} isCompleted={todo.status} message={todo.note} id={todo.id}/>
        ))}

        <form  action={dispatch} ref={formRef}>
            <div className='flex'>
                <input type="text" name='todo' className='flex-1 text-black'/>
                <AddToDoButton/>
            </div>

            <div className='text-red-500'>
                {state.errors && state.errors?.todo}
            </div>
            
        </form>

    </div>
  )
}

const AddToDoButton = ({...rest}:React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
    const { pending } = useFormStatus()
    return (
        <button className='flex gap-2 text-black justify-center' type='submit' disabled={pending} {...rest}>
        Add ToDo
    </button>
    )
}