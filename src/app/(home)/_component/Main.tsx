"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import AlbumGallery from "@/components/home/AlbumGallery";
import FerrisWheel from "@/components/home/FerrisWheel";

export default function Main() {
  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white/30 shadow-sm backdrop-blur-lg dark:bg-gray-900/80 z-50">
        <nav className="flex items-center justify-between px-6 py-4">
          <div className="text-lg font-bold text-gray-800 dark:text-white">
            <Link href="/">Hatongsu</Link>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/login">로그인</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/signup">회원가입</Link>
            </Button>
            <Button variant="destructive">로그아웃</Button>
          </div>
        </nav>
      </header>

      <main className="relative">
        <div>
          <FerrisWheel />
        </div>
        {/* 
        <div className="w-full">
          <AlbumGallery />
        </div> 
        */}
      </main>
    </>
  );
}
