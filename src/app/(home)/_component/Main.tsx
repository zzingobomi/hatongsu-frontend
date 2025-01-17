import Link from "next/link";
import { Button } from "@/components/ui/button";
import AlbumGallery from "@/components/home/AlbumGallery";
import FerrisWheel from "@/components/home/FerrisWheel";

export default function Main() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/login">로그인</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">회원가입</Link>
        </Button>
        <Button>로그아웃</Button>
      </div>
      <div>
        <FerrisWheel
          ferrisSize={1200}
          basketSize={320}
          numArms={8}
          ferrisWheelColor={"#FFFFFF"}
        />
      </div>
      {/* <div className="w-full">
        <AlbumGallery />
      </div> */}
    </div>
  );
}
