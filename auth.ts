// import NextAuth from "next-auth";
// import { authConfig } from "./auth.config";
// import credentials from "next-auth/providers/credentials";
// import { z } from "zod";
// import { sql } from "@vercel/postgres";
// import bcrypt from 'bcrypt'

// const getUser = async (username: string) => {
//     try{
//         const user = await sql`
//             SELECT * FROM users WHERE username = ${username};
//         `
//         const singleUser = user.rows[0]
//         singleUser.name = singleUser.username
//         console.log(singleUser.id)
//         return singleUser
//     }catch(e){
//         console.error('Failed to fetch user',e)
//     }
// }
// export const { auth, signIn, signOut } = NextAuth({
//     ...authConfig,
//     providers:[credentials({
//         name:'Credencials',
        
//         async authorize(credentials){

//             const parsedCredencials = z.object({name: z.string(), password: z.string().min(5) })
//             .safeParse(credentials);
//             if(parsedCredencials.success){
//                 const { name, password } = parsedCredencials.data;
//                 const user = await getUser(name)
//                 if(!user) return null

//                 const passwordsMatch = await bcrypt.compare(password, user.password);
//                 if(passwordsMatch) return user
//             }
//             return null
//         }
//     })],
//     session: { strategy: 'jwt' },
//     secret : process.env.AUTH_SECRET,
//     debug: process.env.NODE_ENV === 'development',
//     // callbacks:{
//     //     session({session, user}){
//     //     session.user.id = user.id;
//     //     session.user.name = user.name;
//     //     return session;
//     // }
// // }
// })