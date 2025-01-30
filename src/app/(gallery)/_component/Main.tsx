"use client";

import { World } from "@/world";
import { useEffect, useRef } from "react";

export default function Main() {
  const worldRef = useRef<World>(null);

  useEffect(() => {
    worldRef.current = new World();

    return () => {
      if (worldRef.current) {
        worldRef.current.clear();
      }
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-gray-900">
      <canvas id="world-canvas" className="w-full h-full"></canvas>
    </div>
  );
}
