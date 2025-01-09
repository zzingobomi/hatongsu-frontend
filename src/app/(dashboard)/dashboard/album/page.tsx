import Album from "@/components/dashboard/album";

export default async function Page() {
  const user = {
    id: "1",
    email: "zzingo5@gmail.com",
    nickname: "귀여운 승연이",
  };
  const userDetails = {};

  return <Album user={user} userDetails={userDetails} />;
}
