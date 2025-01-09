import Chart from "@/components/dashboard/chart";

export default async function Page() {
  const user = {
    id: "1",
    email: "zzingo5@gmail.com",
    nickname: "귀여운 승연이",
  };
  const userDetails = {};

  return <Chart userDetails={userDetails} user={user} />;
}
