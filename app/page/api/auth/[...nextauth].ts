import { authConfig } from "@/auth.config";
import { sql } from "@vercel/postgres";
import bcrypt from 'bcrypt'
import NextAuth, { User } from "next-auth"
import { AdapterUser } from "next-auth/adapters";
import credentials from "next-auth/providers/credentials";
import { z } from "zod";


const getUser = async (username: string) => {
    try{
        const user = await sql`
            SELECT * FROM users WHERE username = ${username};
        `
        const singleUser = user.rows[0]
        singleUser.name = singleUser.username
        console.log(singleUser.id)
        return singleUser
    }catch(e){
        console.error('Failed to fetch user',e)
    }
}
const getUserId = async (username: string) => {
    try{
        const user = await sql`
            SELECT id FROM users WHERE username = ${username}
        `
        const userID =user.rows[0].id
        console.log(userID)
        return userID
    }catch(e){
        console.log(e)
    }

}
  export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers:[credentials({
        name:'Credencials',
        
        async authorize(credentials){

            const parsedCredencials = z.object({name: z.string(), password: z.string().min(5) })
            .safeParse(credentials);
            if(parsedCredencials.success){
                const { name, password } = parsedCredencials.data;
                const user = await getUser(name)
                if(!user) return null

                const passwordsMatch = await bcrypt.compare(password, user.password);
                if(passwordsMatch) return user
            }
            return null
        }
    })],
    session: { strategy: 'jwt' },
    secret : process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
    callbacks: {
      session({ session, token }) {
        const userID = token.userID as string
        const sessionCopy = {...session}
        sessionCopy.user.id = userID
        return sessionCopy
      },
    async jwt({token, user}) {
        const userID = await getUserId(token.name!)
        return {...token, userID }
    } 
    }
  })

