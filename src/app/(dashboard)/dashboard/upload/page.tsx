import UploadView from "@/components/dashboard/upload/UploadView";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return <UploadView user={session?.user} />;
}
