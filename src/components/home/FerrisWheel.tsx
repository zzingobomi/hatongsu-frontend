"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Play, Pause, Rewind } from "lucide-react";

enum PlaybackState {
  PLAYING,
  PAUSED,
  REVERSE,
}

interface FerrisWheelProps {
  ferrisSize?: number;
  basketSize?: number;
  numArms?: number;
  baseSpeed?: number;
  //maxSpeed?: number;
  ferrisWheelColor?: string;
}

const FerrisWheel = ({
  ferrisSize = 1200,
  basketSize = 360,
  numArms = 8,
  baseSpeed = 50,
  //maxSpeed = 8,
  ferrisWheelColor = "#ffffff",
}: FerrisWheelProps) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    PlaybackState.PAUSED
  );

  const ferrisRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const basketsRef = useRef<HTMLElement[]>([]);

  console.log(window.innerWidth);

  // 크기 비율 계산
  const sizeRatio = ferrisSize / 400; // 400은 기본 크기
  const armLength = 200 * sizeRatio;
  const centerSize = 20 * sizeRatio;
  const basketWidth = basketSize;
  const basketHeight = basketWidth * (7 / 8);
  const borderWidth = 4 * sizeRatio;

  const addArms = (numArms: number) => {
    const center = centerRef.current;
    if (!center) return;

    const space = 360 / numArms;
    const pivotDistance = armLength + 10 * sizeRatio;

    basketsRef.current = [];

    for (let i = 0; i < numArms; i++) {
      // Arm
      const arm = document.createElement("div");
      arm.className = "absolute";
      arm.style.width = `${armLength}px`;
      arm.style.height = `${6 * sizeRatio}px`;
      arm.style.backgroundColor = ferrisWheelColor;
      arm.style.left = `${10 * sizeRatio}px`;
      arm.style.top = `${7 * sizeRatio}px`;
      center.appendChild(arm);

      // Pivot
      const pivot = document.createElement("div");
      pivot.className = "absolute rounded-full";
      pivot.style.width = `${centerSize}px`;
      pivot.style.height = `${centerSize}px`;
      pivot.style.backgroundColor = ferrisWheelColor;
      pivot.style.top = `-${pivotDistance}px`;
      center.appendChild(pivot);

      // Basket
      const basket = document.createElement("div");
      basket.className = "absolute rounded-md";
      basket.style.width = `${basketWidth}px`;
      basket.style.height = `${basketHeight}px`;
      basket.style.backgroundImage = `url("basket.svg")`;
      basket.style.backgroundSize = "contain";
      basket.style.backgroundRepeat = "no-repeat";
      basket.style.left = `-${30 * sizeRatio}px`;
      basket.style.top = `${10 * sizeRatio}px`;
      basketsRef.current.push(basket);
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

      gsap.set(pivot, {
        rotation: i * space,
        transformOrigin: `${10 * sizeRatio}px ${210 * sizeRatio}px`,
      });
      gsap.set(arm, {
        rotation: i * space - 90,
        transformOrigin: `0px ${3 * sizeRatio}px`,
      });
      gsap.set(basket, {
        rotation: -i * space,
        transformOrigin: "50% top",
      });
    }
  };

  useEffect(() => {
    if (!centerRef.current || !ferrisRef.current) return;

    while (centerRef.current.firstChild) {
      centerRef.current.removeChild(centerRef.current.firstChild);
    }

    const centerX = ferrisSize / 2 - centerSize / 2;
    const centerY = ferrisSize / 2 - centerSize / 2;
    gsap.set(centerRef.current, { x: centerX, y: centerY });

    addArms(numArms);

    timelineRef.current = gsap.timeline({
      repeat: -1,
    });

    timelineRef.current
      .to(centerRef.current, {
        rotation: 360,
        duration: baseSpeed,
        ease: "none",
      })
      .to(
        basketsRef.current,
        {
          rotation: "-=360",
          duration: baseSpeed,
          ease: "none",
        },
        0
      );

    gsap.from(ferrisRef.current, {
      autoAlpha: 0,
      duration: 1,
    });

    handlePause();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [ferrisSize, numArms, baseSpeed, sizeRatio]);

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

  // const handleSpeedChange = (value: number[]) => {
  //   if (timelineRef.current) {
  //     timelineRef.current.timeScale(value[0]);
  //     timelineRef.current.resume();
  //   }
  // };

  return (
    <div
      className="w-full mx-auto p-4"
      style={{ maxWidth: `${ferrisSize + 32}px` }}
    >
      <div
        ref={ferrisRef}
        className="relative mx-auto rounded-full invisible"
        style={{
          width: `${ferrisSize}px`,
          height: `${ferrisSize}px`,
          borderColor: ferrisWheelColor,
          borderWidth: `${borderWidth}px`,
        }}
      >
        <div
          ref={centerRef}
          className="absolute rounded-full"
          style={{
            width: `${centerSize}px`,
            height: `${centerSize}px`,
            backgroundColor: ferrisWheelColor,
          }}
        />
      </div>

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
          {/* <div className="w-40">
          <Slider
            defaultValue={[1]}
            max={maxSpeed}
            min={0}
            step={0.02}
            onValueChange={handleSpeedChange}
          />
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default FerrisWheel;
