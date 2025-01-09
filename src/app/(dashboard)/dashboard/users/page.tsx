import Users from "@/components/dashboard/users";

export default async function Page() {
  const user = {
    id: "1",
    email: "zzingo5@gmail.com",
    nickname: "귀여운 승연이",
  };
  const userDetails = {};

  return <Users userDetails={userDetails} user={user} />;
}
