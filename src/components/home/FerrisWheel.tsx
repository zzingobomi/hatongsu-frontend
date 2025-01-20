"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Play, Pause } from "lucide-react";
import useWindowSize from "@/hooks/use-windowsize";
import { useQuery } from "@tanstack/react-query";
import {
  AlbumImagesError,
  AlbumImagesQuery,
  AlbumImagesResponse,
  getAlbumImages,
} from "@/lib/getAlbumImages";
import { AlbumImage } from "@/model/AlbumImage";
import { getAlbumImageFerrisNext } from "@/lib/getAlbumImageFerrisNext";

enum PlaybackState {
  PLAYING,
  PAUSED,
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
  const observersRef = useRef<IntersectionObserver[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>(
    PlaybackState.PAUSED
  );
  const sort = [{ orderBy: "dateTimeOriginal", order: "desc" }];

  const playbackStateRef = useRef(playbackState);
  useEffect(() => {
    playbackStateRef.current = playbackState;
  }, [playbackState]);

  // TODO: 첫번째 이벤트를 건너뛰기 위한 로직 (좀더 generic 하게 수정 필요)
  const firstEvent = useRef(true);

  const {
    data: initData,
    error,
    isLoading,
  } = useQuery<
    AlbumImagesResponse,
    AlbumImagesError,
    AlbumImagesResponse,
    [string, AlbumImagesQuery]
  >({
    queryKey: [
      "albumImages",
      {
        pageIndex: 0,
        pageSize: numArms,
        sort: JSON.stringify(sort),
      },
    ],
    queryFn: getAlbumImages,
  });

  const handleVisibilityChange =
    (index: number) => (entries: IntersectionObserverEntry[]) => {
      if (playbackStateRef.current === PlaybackState.PAUSED) return;
      if (firstEvent.current) {
        firstEvent.current = false;
        return;
      }

      entries.forEach(async (entry) => {
        if (!entry.isIntersecting) {
          const targetElement = entry.target as HTMLElement;
          const id = targetElement.dataset.id as string;

          const nextImage = await getAlbumImageFerrisNext({
            id,
            skip: numArms,
          });

          targetElement.dataset.id = nextImage.albumImage.id;
          targetElement.querySelector("img")!.src = nextImage.albumImage.path;
        }
      });
    };

  const addArms = useCallback(
    (initData: AlbumImage[]) => {
      const center = centerRef.current;
      if (!center) return;

      observersRef.current.forEach((observer) => observer.disconnect());
      observersRef.current = [];
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
          rotation: i * space,
          transformOrigin: "0 50%",
        });
        center.appendChild(arm);

        // Pivot
        const pivot = document.createElement("div");
        pivot.dataset.id = `${initData[numArms - 1 - i].id}`;
        pivot.className = "absolute rounded-full";
        pivot.style.width = `${centerSize}px`;
        pivot.style.height = `${centerSize}px`;
        pivot.style.backgroundColor = "white";
        pivot.style.left = `${ferrisSize / 2 - centerSize / 2}px`;
        gsap.set(pivot, {
          x: 0,
          y: -((centerSize - borderWidth) / 2),
          rotation: -(i * space),
          transformOrigin: `50% 50%`,
        });
        pivotsRef.current.push(pivot);
        arm.appendChild(pivot);

        // Pivoit Observer
        const observer = new IntersectionObserver(handleVisibilityChange(i), {
          threshold: 0.5,
        });
        observer.observe(pivot);
        observersRef.current.push(observer);

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
        img.src = initData[numArms - 1 - i].path;
        img.alt = "Basket";
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.borderRadius = "10px";
        img.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.2)";
        basketWindow.appendChild(img);
      }
    },
    [ferrisSize]
  );

  const handlePlay = () => {
    timelineRef.current?.play();
    setPlaybackState(PlaybackState.PLAYING);
  };
  const handlePause = () => {
    timelineRef.current?.pause();
    setPlaybackState(PlaybackState.PAUSED);
  };

  useEffect(() => {
    if (!centerRef.current || !ferrisRef.current) return;

    while (centerRef.current.firstChild) {
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
    const hasFerrisSize = ferrisSize > 0;
    const hasInitData = initData !== undefined;
    const hasAlbumImages =
      initData?.albumImages && initData.albumImages.length > 0;

    if (hasFerrisSize && hasInitData && hasAlbumImages) {
      addArms(initData.albumImages);

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
  }, [ferrisSize, addArms, initData]);

  useEffect(() => {
    return () => {
      observersRef.current.forEach((observer) => observer.disconnect());
    };
  }, []);

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
          {playbackState === PlaybackState.PLAYING ? (
            <button
              onClick={handlePause}
              className="p-4 rounded-full shadow-lg bg-gray-700 hover:bg-gray-800"
            >
              <Pause className="w-8 h-8 text-white" />
            </button>
          ) : (
            <button
              onClick={handlePlay}
              className="p-4 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 animate-pulseSlow"
            >
              <Play className="w-8 h-8 text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
