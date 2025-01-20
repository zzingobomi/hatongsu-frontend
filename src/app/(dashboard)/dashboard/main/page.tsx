import MainView from "@/components/dashboard/main/MainView";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return <MainView user={session?.user} />;
}
