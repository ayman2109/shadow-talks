import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import dbConnect from "./lib/dbConnect"
import UserModel from "./model/User"
import bcrypt from "bcryptjs"
// Your own logic for dealing with plaintext password strings; be careful!


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        identifier: { type: "text" },
        password: { type: "password"},
      },
      authorize: async (credentials) : Promise<any>=> {


        await dbConnect()
        const user = await UserModel.findOne({$or:[ { username: credentials.identifier }, {email: credentials.identifier}]})
        
        if (!user) {
          // Return null if user is not found
          return null;
        }
        const isValidPassword = await bcrypt.compare(credentials.password?.toString() || '', user.password.toString())
        if(!isValidPassword) {
          return null
        }
        console.log("I am good")
        return user;
      },


    }),

    
  ],session : {
    strategy: "jwt",
    maxAge: 24 * 60 * 60

  }, 
  
  callbacks: {
    
    async jwt({ token, user }) {
      
      if (user) {
        token.id = user._id;
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages
      }
      return token;
    },
    async session({ session, token }) {
      // Include token data in the session
      if(token) {
        session.user._id = token.id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages
      }
      return session
    },
    
  }
})