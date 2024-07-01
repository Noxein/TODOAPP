import React from 'react'
import { getTodos } from '../actions'
import { ToDoList } from './ToDoList'

export const ToDoFetcher = async () => {
    const fetchedTodos = await getTodos()
  return (
    <ToDoList todos={fetchedTodos}/>
  )
}
