"use client";

import { World } from "@/world";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import ChatView from "@/components/gallery/ChatView";

export default function Main() {
  const nickname = localStorage.getItem("nickname");
  const router = useRouter();

  if (!nickname) {
    router.push("/lobby");
    return null;
  }

  const worldRef = useRef<World>(null);

  useEffect(() => {
    (async () => {
      const { World } = await import("@/world");
      worldRef.current = new World();
    })();
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900 relative">
      <canvas id="world-canvas" className="w-full h-full"></canvas>
      <ChatView />
    </div>
  );
}
