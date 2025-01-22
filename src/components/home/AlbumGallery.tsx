"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { getAlbumImagesInfinite } from "@/lib/getAlbumImagesInfinite";

export default function AlbumGallery() {
  const ITEM_SIZE = 300;
  const GAP_SIZE = 16;
  const OVERSCAN = 3;

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
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const item = allItems[virtualItem.index];

          return (
            <div
              key={virtualItem.key}
              className="absolute left-0 right-0 px-4"
              style={{
                top: `${virtualItem.start}px`,
                height: `${ITEM_SIZE}px`,
                paddingBottom: `${GAP_SIZE}px`,
              }}
            >
              {item ? (
                <Image
                  src={item.path}
                  alt="Album image"
                  className="object-cover rounded-lg w-full h-full"
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
