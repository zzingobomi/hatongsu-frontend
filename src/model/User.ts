import { UserRole } from "@/lib/user.role";

export interface User {
  id: string;
  email: string;
  nickname: string;
  profile?: string;
  role: UserRole;
}
