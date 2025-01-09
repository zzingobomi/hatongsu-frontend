import { DefaultSession } from "next-auth";

export interface UserData {
  id: string;
  email?: string;
  nickname?: string;
}

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    refreshToken?: string;
    user?: UserData;
  }

  interface User {
    id: string;
    accessToken: string;
    refreshToken: string;
    userData: UserData;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    userData?: UserData;
  }
}