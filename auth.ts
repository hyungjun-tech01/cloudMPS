import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { login, getUserInfo } from "@/app/libs/actions";
import { LoginData, LoginResultData } from "@/app/libs/types";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    full_name: string;
    email: string;
    role: string;
    company_code?: number;
    token?: string;
  }

  interface Session {
    user: {
      name: string;
      email: string;
      full_name?: string;
      role?: string;
      company_code?: number;
      token: string;
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
        const parsedCredentials = z
          .object({
            user_name: z.string(),
            password: z.string().min(6),
            company_code: z.string().optional(),
            verification_code: z.string().optional(),
            is_init: z.enum(['Y', 'N']),
            ip_address: z.string().nullish(),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { 
            user_name,
            ip_address,
            company_code
          } = parsedCredentials.data;
          // console.log(`Credential : (id) ${user_name} / (pwd) ${password} / (company code) ${company_code}`);

          const loginResult: LoginResultData | null = await login(parsedCredentials.data as LoginData);
          // console.log("[Login] Result :", loginResult);

          if (loginResult === null) return null;
          if (loginResult.ResultCode !== "0") {
            console.log("[Login] Error :", loginResult.ErrorMessage);
            return null;
          }

          const userInfoResult = await getUserInfo(
            user_name,
            ip_address ?? "",
            loginResult.token
          );
          // console.log("[User Info] Result :", userInfoResult);

          if (userInfoResult.ResultCode !== "0") {
            console.log("[User Info] Error :", userInfoResult.ErrorMessage);
            return null;
          }

          return {
            id: userInfoResult.user.user_id,
            name: userInfoResult.user.user_name,
            full_name: userInfoResult.user.full_name,
            email: userInfoResult.user.email,
            role: userInfoResult.user["role"] ?? "SUBSCRIPT_USER",
            company_code: company_code, 
            token: loginResult.token,
          };
        }

        console.log("Invalid credentials" + (parsedCredentials.error ?? ""));
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
      const isOnProtected = !(
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/register") ||
        nextUrl.pathname.startsWith("/intro")
      );

      if (isOnProtected) {
        if (!isLoggedIn) {
          console.log("isOnProtected & not LoggedIn");
          return Response.redirect(new URL("/intro", nextUrl));
        }
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

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
        token.name = user.name;
        token.role = user.role;
        token.full_name = user.full_name;
        token.company_code = user.company_code;
        token.token = user.token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string | undefined;
        session.user.full_name = token.full_name as string | undefined;
        session.user.company_code = token.company_code as number | undefined;
        session.user.token = token.token as string;
      }
      return session;
    },
  },
});
