import { AlbumImage } from "@/model/AlbumImage";

export interface AlbumImagesCursorResponse {
  albumImages: AlbumImage[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface AlbumImagesCursorError {
  message: string;
}

export interface AlbumImagesCursorQuery {
  cursor?: string;
  pageSize: number;
}

export const getAlbumImagesCursor = async ({
  queryKey,
}: {
  queryKey: [string, AlbumImagesCursorQuery];
}): Promise<AlbumImagesCursorResponse> => {
  const [_key, { cursor, pageSize }] = queryKey;

  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/album/cursor`);
  url.searchParams.append("limit", pageSize.toString());
  if (cursor) {
    url.searchParams.append("cursor", cursor);
  }

  const response = await fetch(url.toString(), { credentials: "include" });

  if (!response.ok) {
    throw new Error("Failed to fetch album images");
  }

  return response.json();
};
