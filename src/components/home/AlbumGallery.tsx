"use client";

import { getAlbumImagesCursor } from "@/lib/getAlbumImagesCursor";
import { AlbumImage } from "@/model/AlbumImage";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";

export default function AlbumGallery() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["album_gallery"],
    queryFn: ({ pageParam = undefined }) =>
      getAlbumImagesCursor({
        queryKey: ["albumImages", { cursor: pageParam, pageSize: 10 }],
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

  if (status === "pending") return <div>Loading...</div>;
  if (status === "error") return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {data?.pages.map((page, i) =>
        page.albumImages.map((image: AlbumImage) => (
          <div key={image.id} className="relative">
            <Image
              src={image.path}
              alt="Album image"
              className="w-full h-full object-cover rounded-lg"
              width={300}
              height={300}
            />
          </div>
        ))
      )}

      <div ref={ref} className="col-span-3 flex justify-center p-4">
        {isFetchingNextPage ? (
          <div>Loading more...</div>
        ) : hasNextPage ? (
          <div>Scroll for more</div>
        ) : (
          <div>No more images</div>
        )}
      </div>
    </div>
  );
}
