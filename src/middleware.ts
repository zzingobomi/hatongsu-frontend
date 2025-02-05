import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function middleware() {
  const session = await auth();
  if (!session) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/login`
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard/album",
    "/dashboard/chart",
    "/dashboard/main",
    "/dashboard/settings",
    "/dashboard/upload",
    "/dashboard/user",
  ],
};
