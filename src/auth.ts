import NextAuth, { CredentialsSignin, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "./model/User";

class LoginError extends CredentialsSignin {
  constructor(code: string) {
    super();
    this.code = code;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
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
            const errorData = await response.json();
            throw new LoginError(errorData.message);
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
          if (error instanceof LoginError) {
            throw error;
          }
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                nickname: user.name,
                profile: user.image,
                idToken: account.id_token,
              }),
            }
          );

          if (!response.ok) {
            return false;
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
            return false;
          }

          const { user: userData }: { user: User } = await userResponse.json();

          user.id = userData.id;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          user.userData = userData;

          return true;
        } catch (error) {
          console.error("Backend authentication error:", error);
          return false;
        }
      }
      return true;
    },
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
