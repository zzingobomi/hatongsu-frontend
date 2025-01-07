import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Main() {
  return (
    <>
      <div>메인페이지 입니다.</div>
      <Button>
        <Link href="/login" className="button">
          로그인
        </Link>
      </Button>
      <Button>
        <Link href="/signup" className="button">
          회원가입
        </Link>
      </Button>
      <Button>로그아웃</Button>
    </>
  );
}
