'use server'
import { sql } from "@vercel/postgres";
import { z } from "zod";
import bcrypt from 'bcrypt'
import { AuthError } from "next-auth";
import { signIn, auth } from "./page/api/auth/[...nextauth]";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { error } from "console";

export type State = {
  errors?: {
    login?: string[];
    password?: string[];
    confirmpassword?: string[],
    email?: string[],
    todo?: string,
    db?: string,
  };
  message?: string | null;
} | null

export async function addToDo(prevSate:State,formData:FormData){
    try{
      const todo = formData.get('todo') as string

      const user = await auth()
      const userID = user?.user?.id
      const parsedValue = z.string().max(255,'Todo can be maximum 255 characters long').safeParse(todo)
      if(!parsedValue.success){
        return {
          errors: {todo:'Todo can be maximum 255 characters long'},
          message: 'Missing Fields'
        }
      }
      await sql`INSERT INTO todos (note,userid,status)
       VALUES (${todo}, ${userID}, false);`

       revalidatePath('/home')

      return {
        message: 'Todo added succesfully',
        errors:{todo:''}
      }
      
      }catch(e){
        console.log('err',e)
        return {
          message: 'Database Error: Failed to Update Invoice',
          errors: {todo:''}
        }
      }
}

export async function deleteToDo(todoID: string,prevState: State,formData: FormData){
  try{
    await sql`
      DELETE FROM todos WHERE id = ${todoID}
    `
    revalidatePath('/home')
    return {
      message: 'Succesfully deleted todo',
      errors: {}
    }
  }catch(e){
    console.log(e)
    return {
      message: "database error",
      errors: {db: 'Couldnt delete todo'}
    }
  }
}
export async function getTodos(){
  try{
    const user = await auth()
    const userID = user?.user?.id
    const todos = await sql`
      SELECT * FROM todos WHERE userid = ${userID}
    `
    
    todos.rows.sort((a,b)=>{ if(a.id>b.id){return 1}else{return -1}})
    return todos.rows as {id:string,note:string,userid:string,status:boolean}[]
  }catch(e){

  }
}

export async function updateToDo(todoID: string,todoStatus: boolean,prevState: State,formData: FormData){
  try{
    await sql`
      UPDATE todos SET status = ${!todoStatus} WHERE id = ${todoID}
    `
    revalidatePath('/home')
    return{
      message: 'Succesfully updated todo',
      errors: {}
    }
  }catch(e){
    console.log(e)
    return{
      message: '',
      errors: { db: 'Couldnt update todo'}
    }
  }
}



const UserRegisterSchema = z.object({
  login : z.string().min(5,'Login should be 5 characters or longer'),
  password: z.string().min(8,'Password should be 8 characters or longer'),
  confirmpassword: z.string().min(8,'Password should be 8 characters or longer'),
  email: z.string().email(),
}).refine((data)=>data.password === data.confirmpassword,{
  message: "Passwords don't match",
  path: ["confirmpassword"]
})

export async function LoginUser(prevState: State,formData: FormData){
  const login = formData.get('login') as string
  const password = formData.get('password') as string

  const userExists = await sql`
    SELECT password FROM users WHERE username = ${login}
  `
  const HashedPassword = userExists.rows[0].password
  const PasswordMatch = await bcrypt.compare(password,HashedPassword)

  if(userExists.rows.length===0||!PasswordMatch){
    return {
      errors: {login:['Wrong username or password']}
    }
  }
  return{
    errors: {},
    message: ''
  }
}

export async function RegisterUser(prevState: State,formData: FormData){
  const bcrypt = require('bcrypt')
  const validateFields = UserRegisterSchema.safeParse({
    login: formData.get('login'),
    password: formData.get('password'),
    confirmpassword: formData.get('confirmpassword'),
    email: formData.get('email'),
  })
  if(!validateFields.success){
    return{
      errors:validateFields.error.flatten().fieldErrors,
      message: 'Missing Fields'
    }
  }
  const {login, password, email} = validateFields.data
  const usernameExists = await sql`
    SELECT 1 FROM users WHERE username = ${login};
  `
  if(usernameExists.rows.length>=1){
    return{
      errors:{login:['Username already taken']},
      message: 'Missing Fields'
    }
  }
  const emailTaken = await sql`
  SELECT 1 FROM users WHERE email = ${email};
  `
  if(emailTaken.rows.length>=1){
    return{
      errors:{email:['Email already taken']},
      message: 'Missing Fields'
    }
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password,salt)
  //
  try{
    await sql`
      INSERT INTO users (username, password, email) VALUES (${login},${hashedPassword},${email});
    `
    return{
      message: "User added to databse succesfully"
    }
  }catch(e){
    console.log(e)
    return{
      message: "Error! Could'nt add user to database"
    }
  }


}

export const authenticate =  async (prevState: string | undefined, formData: FormData) => {
  try{
    await signIn('credentials',formData)
  }catch(e){
    if(e instanceof AuthError){
      switch(e.type){
        case 'CredentialsSignin':
          return "Invalid credencials";
        default:
          return "Something went wrong";
      }
    }
    throw e
  }
}

export async function logCookie(){
  const cookie = cookies().get('authjs.session-token')
  console.log(cookie)
}

export async function getAuth(){
  const data = await auth()
  return data
}