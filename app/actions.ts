'use server'
import { sql } from "@vercel/postgres";
import { z } from "zod";
import bcrypt from 'bcrypt'
import { AuthError } from "next-auth";
import { auth, signIn } from "@/auth";
import { cookies } from "next/headers";

export async function addToDo(note:string){
    try{
      const userEmail = await auth()

      const data = await sql`SELECT id FROM users WHERE email = ${userEmail?.user?.email};`;
      const userID = data.rows[0].id
      const todo = await sql`INSERT INTO todos (note,userid,status)
       VALUES (${note}, ${userID}, false);`

      return todo
      
      }catch(e){
        console.log('err',e)
        return {
          message: 'Database Error: Failed to Update Invoice',
          
        }
      }
}

export async function getTodos(){
  try{
    const user = await auth()
    const userEmail = user?.user?.id
    console.log('email',userEmail)
    // sql`
    //   SELECT * FROM todos
    // `
  }catch(e){

  }
}
getTodos()
export type State = {
  errors?: {
    login?: string[];
    password?: string[];
    confirmpassword?: string[],
    email?: string[],
  };
  message?: string | null;
} | null



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