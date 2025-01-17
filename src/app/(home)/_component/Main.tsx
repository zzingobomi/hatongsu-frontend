import Link from "next/link";
import { Button } from "@/components/ui/button";
import AlbumGallery from "@/components/home/AlbumGallery";

export default function Main() {
  return (
    <>
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
      <div>
        <AlbumGallery />
      </div>
    </>
  );
}
