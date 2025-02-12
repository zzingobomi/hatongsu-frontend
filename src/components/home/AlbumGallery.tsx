"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useRef, useMemo, useState } from "react";
import Image from "next/image";
import { getAlbumImagesInfinite } from "@/lib/getAlbumImagesInfinite";

export default function AlbumGallery() {
  const ITEM_SIZE = 300;
  const GAP_SIZE = 8;
  const OVERSCAN = 3;
  const PERSPECTIVE = 1200;

  // 3D 효과 관련 설정
  const SCALE_RANGE = [0.8, 1.0];
  const ROTATION_RANGE = [-8, 8];
  const OPACITY_RANGE = [0.4, 1];
  const DEPTH_FACTOR = 150;

  const parentRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  useEffect(() => {
    if (vItems.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [vItems]);

  const itemStyles = useMemo(() => {
    return vItems.map((virtualItem) => {
      const itemCenter = virtualItem.start + ITEM_SIZE / 2;
      const viewportCenter = parentOffset + viewportHeight / 2;
      let distance = itemCenter - viewportCenter;

      // 초기 로딩 시 첫 번째 아이템을 중앙에 배치
      if (isInitialLoad && virtualItem.index === 0) {
        distance = 0;
      }

      const normalizedDistance = Math.min(
        Math.abs(distance) / (viewportHeight * 0.4),
        1
      );
      const direction = Math.sign(distance);

      // 3D 변환 값 계산
      const scale =
        SCALE_RANGE[1] - (SCALE_RANGE[1] - SCALE_RANGE[0]) * normalizedDistance;
      const opacity =
        OPACITY_RANGE[1] -
        (OPACITY_RANGE[1] - OPACITY_RANGE[0]) * normalizedDistance;
      const rotateX =
        ROTATION_RANGE[0] +
        (ROTATION_RANGE[1] - ROTATION_RANGE[0]) *
          normalizedDistance *
          direction;
      const translateZ = -DEPTH_FACTOR * normalizedDistance;

      return {
        transform: `perspective(${PERSPECTIVE}px)
                   scale(${scale})
                   rotateX(${rotateX}deg)
                   translateZ(${translateZ}px)`,
        opacity,
        zIndex: Math.floor((1 - normalizedDistance) * 100),
        filter: `blur(${normalizedDistance * 3}px)`,
      };
    });
  }, [vItems, parentOffset, viewportHeight, isInitialLoad]);

  // 초기 중앙 정렬 스크롤
  useEffect(() => {
    if (isInitialLoad && virtualizer.getTotalSize() > 0 && parentRef.current) {
      const initialScroll = (virtualizer.getTotalSize() - viewportHeight) / 2;
      parentRef.current.scrollTo(0, initialScroll);
    }
  }, [isInitialLoad, virtualizer.getTotalSize(), viewportHeight]);

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
          padding: `${viewportHeight / 2 - ITEM_SIZE / 2}px 0`,
        }}
      >
        {vItems.map((virtualItem, index) => {
          const item = allItems[virtualItem.index];
          const style = itemStyles[index];

          return (
            <div
              key={virtualItem.key}
              className="absolute left-0 right-0 px-4 origin-center transition-all duration-300 ease-out"
              style={{
                top: `${virtualItem.start}px`,
                height: `${ITEM_SIZE}px`,
                marginBottom: `${GAP_SIZE}px`,
                ...style,
              }}
            >
              {item ? (
                <div className="relative w-full h-full shadow-2xl rounded-2xl overflow-hidden">
                  <Image
                    loader={({ src }) => src}
                    src={item.path}
                    alt="Album image"
                    className="object-cover"
                    layout="fill"
                    priority
                  />
                </div>
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
