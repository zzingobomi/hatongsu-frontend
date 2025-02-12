"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { getAlbumImagesInfinite } from "@/lib/getAlbumImagesInfinite";

export default function AlbumGallery() {
  const ITEM_SIZE = 300;
  const GAP_SIZE = 16;
  const OVERSCAN = 3;
  const SCALE_RANGE = [0.85, 1];
  const OPACITY_RANGE = [0.6, 1];

  const parentRef = useRef<HTMLDivElement>(null);

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
    horizontal: false,
    count: hasNextPage ? allItems.length + 1 : allItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_SIZE + GAP_SIZE,
    overscan: OVERSCAN,
  });

  const vItems = virtualizer.getVirtualItems();
  const parentOffset = virtualizer.scrollElement?.scrollTop || 0;
  const viewportHeight = virtualizer.scrollElement?.clientHeight || 0;

  const itemStyles = useMemo(() => {
    return vItems.map((virtualItem) => {
      const itemCenter = virtualItem.start + ITEM_SIZE / 2;
      const viewportCenter = parentOffset + viewportHeight / 2;
      const distance = Math.abs(itemCenter - viewportCenter);
      const normalizedDistance = Math.min(distance / (viewportHeight / 2), 1);

      const scale =
        SCALE_RANGE[1] - (SCALE_RANGE[1] - SCALE_RANGE[0]) * normalizedDistance;

      const opacity =
        OPACITY_RANGE[1] -
        (OPACITY_RANGE[1] - OPACITY_RANGE[0]) * normalizedDistance;

      const blur = normalizedDistance * 4;

      return {
        scale: Math.min(Math.max(scale, SCALE_RANGE[0]), SCALE_RANGE[1]),
        opacity: Math.min(
          Math.max(opacity, OPACITY_RANGE[0]),
          OPACITY_RANGE[1]
        ),
        blur,
        zIndex: Math.floor((1 - normalizedDistance) * 100),
      };
    });
  }, [vItems, parentOffset, viewportHeight]);

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

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error: {error.message}</div>;

  return (
    <div ref={parentRef} className="overflow-y-auto scrollbar-hide h-screen">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {vItems.map((virtualItem, index) => {
          const item = allItems[virtualItem.index];
          const style = itemStyles[index];

          return (
            <div
              key={virtualItem.key}
              className="absolute left-0 right-0 px-4 origin-top transition-all duration-300 ease-out"
              style={{
                top: `${virtualItem.start}px`,
                height: `${ITEM_SIZE}px`,
                paddingBottom: `${GAP_SIZE}px`,
                transform: `scale(${style.scale})`,
                opacity: style.opacity,
                filter: `blur(${style.blur}px)`,
                zIndex: style.zIndex,
              }}
            >
              {item ? (
                <Image
                  loader={({ src }) => src}
                  src={item.path}
                  alt="Album image"
                  className="object-cover rounded-xl w-full h-full shadow-lg"
                  width={ITEM_SIZE}
                  height={ITEM_SIZE}
                  priority
                />
              ) : (
                hasNextPage && (
                  <div className="flex items-center justify-center h-full">
                    {isFetchingNextPage ? (
                      <div>Loading...</div>
                    ) : (
                      <div className="text-2xl opacity-50">↓</div>
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
