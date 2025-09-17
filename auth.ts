import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
// import bcrypt from "bcrypt";
// import MyDBAdapter from '@/app/lib/adapter';

declare module "next-auth" {
  interface User {
    role?: string;
    full_name?: string;
  }

  interface Session {
    user: {
      role?: string;
      full_name?: string;
    } & DefaultSession["user"];
  }
}


export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ user_name: z.string(), user_password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { user_name, user_password } = parsedCredentials.data;

          console.log(`Credential : (id) ${user_name} / (pwd) ${user_password}`);
          // if(user_name !== 'admin') {
          // const adapter = MyDBAdapter();
          // const userAttr = await adapter.getAccount(user_name);
          // console.log('Account : ', userAttr);
          // if (!userAttr) return null;

          // const userPassword = userAttr.password;
          // const passwordsMatch = await bcrypt.compare(user_password, userPassword);

          // if (passwordsMatch)
            return {
              id: 'admin',   //userAttr.id,
              name: 'admin', // userAttr.name,
              full_name: 'admin', //userAttr.full_name,
              email: '',  //userAttr.email,
              role: 'admin',  //userAttr.role ?? "user",
              image: ""
            };
          // } else {
          //   return {
          //     id: '0001',
          //     name: 'admin',
          //     email: 'hyungsung@sindoh.com',
          //     role: "admin",
          //     image: ""
          //   };
          // }
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }) => {
      // check login --------------------------------------------
      const isLoggedIn = !!auth?.user;
      const isOnProtected = !(nextUrl.pathname.startsWith('/login'));
      if (isOnProtected) {
        if (isLoggedIn) return true;
        return Response.redirect(new URL('/login', nextUrl));
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // check admin --------------------------------------------
      const isAdmin = auth?.user.role === "admin";
      const isManager = auth?.user.role === "manager";
      const userMenu = nextUrl.pathname.startsWith('/user');
      const groupMenu = nextUrl.pathname.startsWith('/group');
      const editMenu = nextUrl.pathname.endsWith('/edit');

      if(userMenu) {
        if(isAdmin) return true;
        return Response.redirect(new URL('/', nextUrl));
      }
      if(groupMenu) {
        if(editMenu) {
          if(isAdmin) return true;
          return Response.redirect(new URL('/', nextUrl));
        } else {
          if(isAdmin || isManager) return true;
          return Response.redirect(new URL('/', nextUrl));
        }
      }
      
      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.full_name = user.full_name;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string | undefined;
        session.user.full_name = token.full_name as string | undefined;
      }
      return session;
    }
  }
});
