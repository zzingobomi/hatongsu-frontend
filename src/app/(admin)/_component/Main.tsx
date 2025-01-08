import Link from "next/link";
import { Button } from "@/components/ui/button";
import DashMain from "@/components/dashboard/main";

export default function Main() {
  const user = {
    id: "1",
    email: "example@com",
    nickname: "홍길동",
  };
  const userDetails = {};

  return <DashMain user={user} userDetails={userDetails} />;
}
