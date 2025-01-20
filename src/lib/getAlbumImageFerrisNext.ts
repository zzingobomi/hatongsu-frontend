import { AlbumImage } from "@/model/AlbumImage";

export interface AlbumImageFerrisNextResponse {
  albumImage: AlbumImage;
}

export interface AlbumImageFerrisNextError {
  message: string;
}

export interface AlbumImageFerrisNextQuery {
  id: string;
  skip: number;
}

export const getAlbumImageFerrisNext = async (
  queryKey: AlbumImageFerrisNextQuery
): Promise<AlbumImageFerrisNextResponse> => {
  const { id, skip } = queryKey;

  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/album/ferris-next`
  );
  url.searchParams.append("id", id);
  url.searchParams.append("skip", skip.toString());

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error("Failed to fetch album images");
  }

  return response.json();
};
