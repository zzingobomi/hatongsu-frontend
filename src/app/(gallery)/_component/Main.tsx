"use client";

import { World } from "@/world";
import { useEffect, useRef } from "react";

export default function Main() {
  const worldRef = useRef<World>(null);

  useEffect(() => {
    (async () => {
      const { World } = await import("@/world");
      worldRef.current = new World();
    })();
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900">
      <canvas id="world-canvas" className="w-full h-full"></canvas>
    </div>
  );
}
