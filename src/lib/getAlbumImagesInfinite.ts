import { AlbumImage } from "@/model/AlbumImage";

export interface AlbumImagesInfiniteResponse {
  albumImages: AlbumImage[];
  nextCursor: string;
}

export interface AlbumImagesInfiniteError {
  message: string;
}

export interface AlbumImagesInfiniteQuery {
  nextCursor?: string;
  pageSize: number;
}

export const getAlbumImagesInfinite = async ({
  queryKey,
}: {
  queryKey: [string, AlbumImagesInfiniteQuery];
}): Promise<AlbumImagesInfiniteResponse> => {
  const [_key, { nextCursor, pageSize }] = queryKey;

  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/album/infinite`);
  url.searchParams.append("limit", pageSize.toString());
  if (nextCursor) {
    url.searchParams.append("nextCursor", nextCursor);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch album images");
  }

  return response.json();
};
