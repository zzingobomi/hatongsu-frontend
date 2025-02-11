"use server";

import { auth } from "@/auth";

export const deleteAlbumImages = async ({
  imageIds,
}: {
  imageIds: string[];
}) => {
  const session = await auth();
  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/album`);

  const response = await fetch(url.toString(), {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({ imageIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete album images");
  }

  return response.json();
};
