"use server";

import { auth } from "@/auth";
import { User } from "@/model/User";

export interface UsersResponse {
  users: User[];
  totalCount: number;
}

export interface UsersError {
  message: string;
}

export interface UsersQuery {
  pageIndex: number;
  pageSize: number;
  sort: string;
}

export const getUsers = async ({
  queryKey,
}: {
  queryKey: [string, UsersQuery];
}): Promise<UsersResponse> => {
  const session = await auth();
  const [_key, { pageIndex, pageSize, sort }] = queryKey;

  const url = new URL(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/all`);
  url.searchParams.append("page", (pageIndex + 1).toString());
  url.searchParams.append("limit", pageSize.toString());
  if (sort) {
    url.searchParams.append("sort", sort);
  }

  const response = await fetch(url.toString(), {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};
