"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import AlbumGallery from "@/components/home/AlbumGallery";
import FerrisWheel from "@/components/home/FerrisWheel";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Main() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white/30 shadow-sm backdrop-blur-lg dark:bg-gray-900/80 z-50">
        <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="text-lg font-bold text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <Link href="/">Hatongsu</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/20 transition-colors font-semibold"
            >
              <Link href="/gallery">전시회장 방문</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <Link href="/login">로그인</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <Link href="/signup">시작하기</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden px-6 py-3 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t dark:border-gray-800">
            <div className="flex flex-col gap-2 max-w-7xl mx-auto">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-900/20 transition-colors font-semibold"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/gallery">전시회장 방문</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/login">로그인</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href="/signup">시작하기</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="relative">
        <div className="hidden md:block">
          <FerrisWheel />
        </div>
        <div className="md:hidden w-full mt-[80px]">
          <AlbumGallery />
        </div>
      </main>
    </>
  );
}
