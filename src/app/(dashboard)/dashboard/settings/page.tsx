import SettingsView from "@/components/dashboard/settings/SettingsView";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return <SettingsView user={session?.user} />;
}
