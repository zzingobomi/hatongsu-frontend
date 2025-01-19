"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getAlbumImagesInfinite } from "@/lib/getAlbumImagesInfinite";

export default function AlbumGallery() {
  const ITEM_SIZE = 300;
  const GAP_SIZE = 16;
  const OVERSCAN = 3;

  const SCROLL_SPEED = 0.8;
  const MOMENTUM_STRENGTH = 70;
  const MOMENTUM_DECAY = 0.85;

  const parentRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [momentum, setMomentum] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["albumGalleryInfinite"],
    queryFn: ({ pageParam = undefined }) =>
      getAlbumImagesInfinite({
        queryKey: [
          "albumGalleryInfinite",
          { nextCursor: pageParam, pageSize: 10 },
        ],
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.nextCursor ? lastPage.nextCursor : undefined,
  });

  const allItems = data?.pages.flatMap((page) => page.albumImages) ?? [];

  const virtualizer = useVirtualizer({
    horizontal: true,
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_SIZE + GAP_SIZE,
    overscan: OVERSCAN,
  });

  useEffect(() => {
    const [lastItem] = [...virtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= allItems.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [virtualizer.getVirtualItems(), hasNextPage, isFetchingNextPage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!parentRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - parentRef.current.offsetLeft);
    setScrollLeft(parentRef.current.scrollLeft);
    setLastX(e.pageX);
    setLastTime(Date.now());
    setMomentum(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !parentRef.current) return;
    e.preventDefault();

    const x = e.pageX - parentRef.current.offsetLeft;
    const walk = (x - startX) * SCROLL_SPEED;

    const currentTime = Date.now();
    const timeElapsed = currentTime - lastTime;
    if (timeElapsed > 0) {
      const distance = e.pageX - lastX;
      const velocity = distance / timeElapsed;
      setMomentum(velocity * MOMENTUM_STRENGTH);
    }

    parentRef.current.scrollLeft = scrollLeft - walk;
    setLastX(e.pageX);
    setLastTime(currentTime);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (parentRef.current && momentum !== 0) {
      const startMomentum = momentum;
      let currentMomentum = startMomentum;

      const animate = () => {
        if (!parentRef.current || Math.abs(currentMomentum) < 0.5) return;

        parentRef.current.scrollLeft -= currentMomentum;
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
      ref={parentRef}
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
      <div
        style={{
          width: `${virtualizer.getTotalSize()}px`,
          height: `${ITEM_SIZE}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = allItems[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              className="absolute top-0"
              style={{
                left: `${virtualItem.start}px`,
                width: `${ITEM_SIZE}px`,
                height: `${ITEM_SIZE}px`,
                paddingRight: `${GAP_SIZE}px`,
              }}
            >
              {item ? (
                <Image
                  src={item.path}
                  alt="Album image"
                  className="object-cover rounded-lg"
                  width={ITEM_SIZE}
                  height={ITEM_SIZE}
                  draggable={false}
                  priority
                />
              ) : (
                hasNextPage && (
                  <div className="flex items-center justify-center h-full">
                    {isFetchingNextPage ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="text-2xl opacity-50">→</div>
                    )}
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
