import { ToDoList } from "../ui/ToDoList";


export default async function Home() {
    return (
      <main className="flex flex-col items-center justify-between p-24">
          <ToDoList />
      </main>
    );
  }