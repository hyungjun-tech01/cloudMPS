import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { login, getUserInfo } from "@/app/libs/actions";
import { LoginData, LoginResultData } from "@/app/libs/types";
import { USER_TYPE } from "@/app/libs/constants";


interface ExtendedUser {
  id: string;
  name: string;
  fullName: string;
  role: string;
  status: string;
  companyCode?: number;
  ipAddress: string;
  token: string;
}

declare module "next-auth" {
  interface User extends ExtendedUser { }

  interface Session {
    user: User & DefaultSession["user"];
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
            user_name: z.email(),
            password: z.string("Password is required")
              .min(6, "Password must be more than 6 characters")
              .max(32, "Password must be less than 32 characters"),
            company_code: z.string().optional(),
            verification_code: z.string().optional(),
            is_init: z.enum(['Y', 'N']),
            ip_address: z.string(),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const {
            user_name,
            ip_address,
            company_code
          } = parsedCredentials.data;

          const loginResult: LoginResultData | null = await login(parsedCredentials.data as LoginData);

          if (loginResult === null) return null;
          if (loginResult.ResultCode !== "0") {
            console.log("[Login] Error :", loginResult.ErrorMessage);
            return null;
          }

          const userInfoResult = await getUserInfo(
            user_name,
            ip_address,
            loginResult.token
          );

          if (userInfoResult.ResultCode !== "0") {
            console.log("[User Info] Error :", userInfoResult.ErrorMessage);
            return null;
          };

          const userStatus = userInfoResult.user.user_status === 'NEED_AUTH' ? 'NEED_AUTH' : (
            (userInfoResult.user.terms_of_service === "N"
              || userInfoResult.user.privacy_policy === "N"
              || userInfoResult.user.location_information === "N"
            ) ? "NEED_AGREEMENT" : userInfoResult.user.user_status
          );

          return {
            id: userInfoResult.user.user_id,
            name: userInfoResult.user.user_name,
            fullName: userInfoResult.user.full_name,
            email: userInfoResult.user.email,
            role: userInfoResult.user.user_role,
            status: userStatus,
            companyCode: company_code,
            ipAddress: ip_address,
            token: loginResult.token
          } as ExtendedUser;
        }

        // console.log("Invalid credentials" + (parsedCredentials.error ?? ""));
        return null;
      },
    }),
  ],
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }) => {
      const isPublicRoute = nextUrl.pathname.startsWith("/login")
        || nextUrl.pathname.startsWith("/register")
        || nextUrl.pathname.startsWith("/intro")

      //----- check login --------------------------------------------
      if (!auth) {
        if (!isPublicRoute) return Response.redirect(new URL("/login", nextUrl));
        return true;
      };

      const isLoggedIn = !!auth.user && (new Date(auth.expires) > new Date());
      if (isPublicRoute) {
        if (isLoggedIn) return Response.redirect(new URL("/", nextUrl));
        return true;
      }

      if (!isLoggedIn) return Response.redirect(new URL("/login", nextUrl));

      //----- check user status --------------------------------------------
      if (auth.user.status === 'NEED_AUTH') {
        return Response.redirect(new URL("/authorize", nextUrl));
      };

      if (auth.user.status === 'NEED_AGREEMENT') {
        return Response.redirect(new URL("/agreement", nextUrl));
      };

      if (auth.user.status === 'PASSWORD_CHANGING') {
        return Response.redirect(new URL("/changePassword", nextUrl));
      };

      const isAdmin = auth.user.role === "admin";
      const isPartner = isAdmin || auth.user.role === USER_TYPE.PARTNER;
      const isManager = isPartner || auth.user.role === USER_TYPE.SUBSCRIPTION;
      const isEngineer = isManager || [USER_TYPE.PARTNER_USER, USER_TYPE.SUBSCRIPT_USER].includes(auth.user.role);

      if (nextUrl.pathname.startsWith("/client") && !isPartner)
        return Response.redirect(new URL("/", nextUrl));

      if (nextUrl.pathname.startsWith("/device") && !isEngineer)
        return Response.redirect(new URL("/", nextUrl));

      if (nextUrl.pathname.startsWith("/user") && !isManager)
        return Response.redirect(new URL("/", nextUrl));

      return true;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          role: user.role,
          fullName: user.fullName,
          companyCode: user.companyCode,
          ipAddress: user.ipAddress,
          token: user.token,
        }
      } else if (!!token.exp && token.exp > (Date.now() / 1000)) {
        return token;
      };
      throw new TypeError("Missing token")
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          fullName: token.fullName as string,
          companyCode: token.companyCode as number | undefined,
          ipAddress: token.ipAddress as string,
          token: token.token as string,
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",  // JWT 전략 사용 (명시적)
    maxAge: 86400,    // 1일 : 24 * 60 * 60 = 86,400(s)
  },
  jwt: {
    maxAge: 86400,    // 1일
  },
});
