import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { login } from "@/app/libs/actions";
import { LoginResultData } from "@/app/libs/types";

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
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log("authorize :", credentials);
        const parsedCredentials = z.object({
            user_name: z.string(),
            password: z.string().min(6),
          }).safeParse(credentials);

        if (parsedCredentials.success) {
          const { user_name, password } = parsedCredentials.data;
          const company_code = credentials["company_code"] as string  ?? null;
          const ip_address = credentials["ip_address"] as string ?? null;

          console.log(
            `Credential : (id) ${user_name} / (pwd) ${password}`
          );
          
          const loginData = {
            user_name: user_name,
            password: password,
            company_code: company_code,
            ip_address: ip_address
          };

          const loginResult: LoginResultData | null = await login(loginData);

          if(loginResult === null) return null;

          console.log("Login Result: ", loginResult);
          
          if(loginResult.ResultCode !== "0" ) {
            console.log("Error :", loginResult.ErrorMessage);
            return null;
          }
          
          return {
            id: user_name,
            name: user_name,
            email: "",
            role: "admin",
            token: (loginResult as LoginResultData)["token"]
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
      console.log("authorized called");
      // check login --------------------------------------------
      const isLoggedIn = !!auth?.user;
      const isOnIntro = nextUrl.pathname.startsWith("/intro");
      const isOnProtected = !(nextUrl.pathname.startsWith("/login")
        || (nextUrl.pathname.startsWith("/register"))
        || (nextUrl.pathname.startsWith("/intro"))
      );

      if (isOnProtected) {
        if (!isLoggedIn) {
          console.log("isOnProtected & not LoggedIn");
          return Response.redirect(new URL('/intro', nextUrl))
        };
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl));
      };

      const isAdmin = auth?.user.role === "admin";
      const isManager = auth?.user.role === "manager";
      const userMenu = nextUrl.pathname.startsWith("/user");
      const groupMenu = nextUrl.pathname.startsWith("/group");
      const editMenu = nextUrl.pathname.endsWith("/edit");

      if (userMenu) {
        if (isAdmin) return true;
        return Response.redirect(new URL("/", nextUrl));
      }
      if (groupMenu) {
        if (editMenu) {
          if (isAdmin) return true;
          return Response.redirect(new URL("/", nextUrl));
        } else {
          if (isAdmin || isManager) return true;
          return Response.redirect(new URL("/", nextUrl));
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
    },
  },
});
