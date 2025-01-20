import UsersView from "@/components/dashboard/users/UsersView";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return <UsersView user={session?.user} />;
}
