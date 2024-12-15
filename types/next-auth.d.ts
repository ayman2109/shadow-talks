import { DefaultSession } from 'next-auth'
import { JWT } from 'next-auth/jwt'

// Augmenting next-auth types
declare module 'next-auth' {
  interface User {
    _id?: string;
    username?: string;
    password?: string;
    isVerified?: string;
    isAcceptingMessages?: boolean;
  }

  interface Session {
    user: {
      _id?: string;
      username?: string;
      password?: string;
      isVerified?: string;
      isAcceptingMessages?: boolean;
    } & DefaultSession['user'];
  }
}

// Augmenting JWT types
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    username?: string;
    password?: string;
    isVerified?: string;
    isAcceptingMessages?: boolean;
  }
}
