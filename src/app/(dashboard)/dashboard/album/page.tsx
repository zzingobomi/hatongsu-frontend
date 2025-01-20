import AlbumView from "@/components/dashboard/album/AlbumView";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();

  return <AlbumView user={session?.user} />;
}
