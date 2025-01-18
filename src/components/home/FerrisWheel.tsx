"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Play, Pause, Rewind } from "lucide-react";
import useWindowSize from "@/hooks/use-windowsize";

enum PlaybackState {
  PLAYING,
  PAUSED,
  REVERSE,
}

export default function FerrisWheel() {
  const { width } = useWindowSize();
  const ferrisSize = width * 0.625;
  const centerSize = 60;
  const borderWidth = 12;
  const numArms = 8;
  const basketSize = 350;
  const baseSpeed = 50;

  const ferrisRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const pivotsRef = useRef<HTMLElement[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    PlaybackState.PAUSED
  );

  const addArms = useCallback(() => {
    const center = centerRef.current;
    if (!center) return;

    pivotsRef.current = [];

    const space = 360 / numArms;
    const centerX = centerSize / 2;
    const centerY = centerSize / 2;

    for (let i = 0; i < numArms; i++) {
      // Arm
      const arm = document.createElement("div");
      arm.className = "absolute";
      arm.style.width = `${ferrisSize / 2}px`;
      arm.style.height = `${borderWidth}px`;
      arm.style.backgroundColor = "white";
      gsap.set(arm, {
        x: centerX,
        y: centerY - borderWidth / 2,
        rotation: i * space - 90,
        transformOrigin: "0 50%",
      });
      center.appendChild(arm);

      // Pivot
      const pivot = document.createElement("div");
      pivot.className = "absolute rounded-full";
      pivot.style.width = `${centerSize}px`;
      pivot.style.height = `${centerSize}px`;
      pivot.style.backgroundColor = "white";
      pivot.style.left = `${ferrisSize / 2 - centerSize / 2}px`;
      gsap.set(pivot, {
        x: 0,
        y: -((centerSize - borderWidth) / 2),
        rotation: -(i * space - 90),
        transformOrigin: `50% 50%`,
      });
      pivotsRef.current.push(pivot);
      arm.appendChild(pivot);

      // Basket
      const basket = document.createElement("div");
      basket.className = "absolute rounded-md";
      basket.style.width = `${basketSize}px`;
      basket.style.height = `${basketSize * (7 / 8)}px`;
      basket.style.backgroundImage = `url("basket.svg")`;
      basket.style.backgroundSize = "contain";
      basket.style.backgroundRepeat = "no-repeat";
      gsap.set(basket, {
        x: -basketSize / 2 + centerSize / 2,
        y: centerSize / 2,
      });
      pivot.appendChild(basket);

      // Basket Window
      const basketWindow = document.createElement("div");
      basketWindow.style.width = "77%";
      basketWindow.style.height = "55%";
      basketWindow.style.position = "absolute";
      basketWindow.style.top = "20%";
      basketWindow.style.left = "10%";
      basket.appendChild(basketWindow);

      //Image
      const img = document.createElement("img");
      img.src = "https://picsum.photos/200/300";
      img.alt = "Basket";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.borderRadius = "10px";
      img.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
      basketWindow.appendChild(img);
    }
  }, [ferrisSize]);

  const handlePlay = () => {
    timelineRef.current?.play();
    setPlaybackState(PlaybackState.PLAYING);
  };
  const handlePause = () => {
    timelineRef.current?.pause();
    setPlaybackState(PlaybackState.PAUSED);
  };
  const handleReverse = () => {
    timelineRef.current?.reverse();
    setPlaybackState(PlaybackState.REVERSE);
  };

  const getButtonClass = (state: PlaybackState) => {
    const baseClass = "p-3 rounded-full shadow-lg transition-all duration-300";
    const isActive = playbackState === state;
    return `${baseClass} ${
      isActive
        ? "bg-white ring-2 ring-blue-400 scale-110"
        : "bg-white/80 hover:bg-white"
    }`;
  };

  useEffect(() => {
    if (!centerRef.current || !ferrisRef.current) return;

    while (centerRef.current.firstChild) {
      console.log("remove");
      centerRef.current.removeChild(centerRef.current.firstChild);
    }

    // Center, FerrisWheel 위치 설정
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.95 - centerSize / 2;
    gsap.set(centerRef.current, {
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
    });

    gsap.set(ferrisRef.current, {
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
    });
  }, [width]);

  useEffect(() => {
    if (ferrisSize > 0) {
      addArms();

      timelineRef.current = gsap.timeline({
        repeat: -1,
      });

      // FerrisWheel 회전 (Pivot은 반대 방향으로 회전)
      timelineRef.current
        .to(centerRef.current, {
          rotation: 360,
          duration: baseSpeed,
          ease: "none",
        })
        .to(
          pivotsRef.current,
          {
            rotation: "-=360",
            duration: baseSpeed,
            ease: "none",
            transformOrigin: "50% 50%",
          },
          0
        );

      handlePause();
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [ferrisSize, addArms]);

  return (
    <div className="w-full mx-auto">
      <div
        ref={ferrisRef}
        className="absolute mx-auto rounded-full border-white"
        style={{
          width: ferrisSize,
          height: ferrisSize,
          borderWidth: borderWidth,
        }}
      ></div>
      <div
        ref={centerRef}
        className="absolute rounded-full bg-white"
        style={{ width: centerSize, height: centerSize }}
      ></div>

      {/* Controls */}
      <div className="fixed bottom-[5%] left-1/2 transform -translate-x-1/2">
        <div className="bg-black/20 backdrop-blur-sm px-6 py-3 rounded-full flex gap-4">
          <button
            onClick={handleReverse}
            className={getButtonClass(PlaybackState.REVERSE)}
          >
            <Rewind
              className={`w-6 h-6 ${
                playbackState === PlaybackState.REVERSE
                  ? "text-blue-600"
                  : "text-gray-700"
              }`}
            />
          </button>
          <button
            onClick={handlePause}
            className={getButtonClass(PlaybackState.PAUSED)}
          >
            <Pause
              className={`w-6 h-6 ${
                playbackState === PlaybackState.PAUSED
                  ? "text-blue-600"
                  : "text-gray-700"
              }`}
            />
          </button>
          <button
            onClick={handlePlay}
            className={getButtonClass(PlaybackState.PLAYING)}
          >
            <Play
              className={`w-6 h-6 ${
                playbackState === PlaybackState.PLAYING
                  ? "text-blue-600"
                  : "text-gray-700"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
