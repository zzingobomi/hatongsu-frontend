"use client";

import { getAlbumImagesCursor } from "@/lib/getAlbumImagesCursor";
import { AlbumImage } from "@/model/AlbumImage";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

export default function AlbumGallery() {
  const SCROLL_SPEED = 0.8;
  const MOMENTUM_STRENGTH = 70;
  const MOMENTUM_DECAY = 0.85;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [momentum, setMomentum] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  const { ref, inView } = useInView({
    threshold: 0.1,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["albumGallery"],
    queryFn: ({ pageParam = undefined }) =>
      getAlbumImagesCursor({
        queryKey: ["albumGallery", { cursor: pageParam, pageSize: 10 }],
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    setLastX(e.pageX);
    setLastTime(Date.now());
    setMomentum(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();

    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * SCROLL_SPEED;

    const currentTime = Date.now();
    const timeElapsed = currentTime - lastTime;
    if (timeElapsed > 0) {
      const distance = e.pageX - lastX;
      const velocity = distance / timeElapsed;
      setMomentum(velocity * MOMENTUM_STRENGTH);
    }

    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    setLastX(e.pageX);
    setLastTime(currentTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current && momentum !== 0) {
      const startMomentum = momentum;
      let currentMomentum = startMomentum;

      const animate = () => {
        if (!scrollContainerRef.current || Math.abs(currentMomentum) < 0.5)
          return;

        scrollContainerRef.current.scrollLeft -= currentMomentum;
        currentMomentum *= MOMENTUM_DECAY;
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setMomentum(0);
  };

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error: {error.message}</div>;

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-scroll scrollbar-hide select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div className="flex gap-4 p-4 min-w-max">
        {data?.pages.map((page) =>
          page.albumImages.map((image: AlbumImage) => (
            <div
              key={image.id}
              className="relative flex-none w-[300px] h-[300px]"
            >
              <Image
                src={image.path}
                alt="Album image"
                className="object-cover rounded-lg"
                width={300}
                height={300}
                draggable={false}
                priority
              />
            </div>
          ))
        )}
        <div ref={ref} className="flex items-center justify-center w-20">
          {isFetchingNextPage ? (
            <div>Loading...</div>
          ) : hasNextPage ? (
            <div className="text-2xl opacity-50">→</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
