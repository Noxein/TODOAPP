import Image from "next/image";
import { ToDoList } from "./ui/ToDoList";
import { addToDo } from './actions'

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <ToDoList />
    </main>
  );
}
