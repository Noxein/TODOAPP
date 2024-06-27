'use client'
import React, { useState } from 'react'
import { Todo } from './todo'
import { addToDo } from '../actions'

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
export const ToDoList = () => {
    const[todos,setTodos] = useState<{message:string,isCompleted:boolean,id:number}[]>(initTodos)
    const[newTodo,setNewTodo] = useState<string>('')

    const handleAddToDo = () => {
        const todo = {
            id:currentNumber,
            message:newTodo,
            isCompleted:false,
        }
        currentNumber ++
        setTodos(x=>[...x,todo])
        setNewTodo('')
    }
  return (
    <div className='w-1/2 flex flex-col gap-1'>
        {todos.map(todo=>(
            <Todo key={todo.id} isCompleted={todo.isCompleted} message={todo.message} id={todo.id} setTodos={setTodos} todos={todos}/>
        ))}
        <div className='flex'>
            <input type="text" className='flex-1 text-black' value={newTodo} onChange={e=>setNewTodo(e.target.value)}/>
            <button className='flex gap-2 text-black justify-center' onClick={()=>addToDo(newTodo)}>
                Add ToDo
            </button>
        </div>

    </div>
  )
}
