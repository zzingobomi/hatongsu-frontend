"use client";

import { World } from "@/world";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ChatView from "@/components/gallery/ChatView";

export default function Main() {
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const worldRef = useRef<World>(null);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    if (!storedNickname) {
      router.push("/lobby");
    } else {
      setNickname(storedNickname);
      (async () => {
        const { World } = await import("@/world");
        worldRef.current = new World();
      })();
    }
  }, [router]);

  if (!nickname) {
    return null;
  }

  return (
    <div className="h-screen w-screen bg-gray-900 relative">
      <canvas id="world-canvas" className="w-full h-full"></canvas>
      <ChatView />
    </div>
  );
}
