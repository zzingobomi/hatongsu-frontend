import NextAuth, { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "./model/User";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const authHeader = `Basic ${Buffer.from(
            `${credentials.username}:${credentials.password}`
          ).toString("base64")}`;

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: authHeader,
              },
            }
          );

          if (!response.ok) {
            return null;
          }

          const { accessToken, refreshToken } = await response.json();

          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/me`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!userResponse.ok) {
            return null;
          }

          const { user: userData }: { user: User } = await userResponse.json();

          return {
            id: userData.id,
            accessToken,
            refreshToken,
            userData,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          userData: user.userData,
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user = token.userData;
      return session;
    },
  },
});
