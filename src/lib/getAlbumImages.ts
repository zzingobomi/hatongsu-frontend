import { AlbumImage } from "@/model/AlbumImage";

export interface AlbumImagesResponse {
  albumImages: AlbumImage[];
  totalCount: number;
}

export interface AlbumImagesError {
  message: string;
}

export interface AlbumImagesQuery {
  pageIndex: number;
  pageSize: number;
  sort: string;
}

export const getAlbumImages = async ({
  queryKey,
}: {
  queryKey: [string, AlbumImagesQuery];
}): Promise<AlbumImagesResponse> => {
  const [_key, { pageIndex, pageSize, sort }] = queryKey;

  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/album`);
  url.searchParams.append("page", (pageIndex + 1).toString());
  url.searchParams.append("limit", pageSize.toString());
  if (sort) {
    url.searchParams.append("sort", sort);
  }

  const response = await fetch(url.toString(), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch album images");
  }

  return response.json();
};
