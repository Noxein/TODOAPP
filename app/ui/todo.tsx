import React, { SetStateAction } from 'react'
type todo = {
  message:string,isCompleted:boolean,id:number
}[]

export const Todo = ({message,isCompleted,id,setTodos,todos}:{message:string,isCompleted:boolean,id:number,setTodos:React.Dispatch<SetStateAction<todo>>,todos:todo}) => {
const classes = ()=>{
  return isCompleted?'bg-blue-500':
  'bg-blue-950'
}
const updateIsCompleted = (id:number) => {
  let todosCopy = [...todos]
  todosCopy[id-1].isCompleted = !todosCopy[id-1].isCompleted
  setTodos(todosCopy)
  console.log(todosCopy)
}
const deleteToDo = (id:number) => {
  let todoCopy = [...todos]
  setTodos(todoCopy.filter(x=>x.id!==id))
}
return (
    <section className='flex gap-2' >
      <div className={`${classes()} flex justify-between p-2 flex-1`} onClick={()=>updateIsCompleted(id)}>
        {message}
        <div>
          {isCompleted?"Done":"In Progress"}
        </div>
      </div>

      <button className='justify-self-center self-center text-white bg-slate-800 p-2' onClick={()=>deleteToDo(id)}>
        Del
      </button>
    </section>

  )
}
