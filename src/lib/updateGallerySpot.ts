"use server";

import { auth } from "@/auth";
import { GallerySpotType } from "@/model/AlbumImage";

export const updateGallerySpot = async ({
  imageId,
  spotType,
}: {
  imageId: string;
  spotType: GallerySpotType;
}) => {
  const session = await auth();
  const url = new URL(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/album/gallery/spot`
  );

  const response = await fetch(url.toString(), {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({ imageId, spotType }),
  });

  if (!response.ok) {
    throw new Error("Failed to put gallery spot");
  }

  return response.json();
};
