"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OpenContext, UserContext } from "@/contexts/layout";
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useContext } from "react";
import { FiAlignJustify } from "react-icons/fi";
import {
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineInformationCircle,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function HeaderLinks() {
  const user = useContext(UserContext);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard/main", label: "Dashboard" },
    { href: "/dashboard/album", label: "Album" },
    { href: "/dashboard/chart", label: "Chart" },
    { href: "/dashboard/users", label: "Users List" },
    { href: "/dashboard/settings", label: "Profile Settings" },
    { href: "/dashboard/upload", label: "Image Upload" },
  ];

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="relative flex min-w-max max-w-max flex-grow items-center justify-around gap-1 rounded-lg md:px-2 md:py-2 md:pl-3 xl:gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950 dark:border-zinc-800 dark:text-white md:min-h-10 md:min-w-10 xl:hidden"
          >
            <FiAlignJustify className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="block">
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start",
                  pathname === item.href &&
                    "bg-zinc-100 dark:bg-zinc-800 font-medium"
                )}
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950 dark:border-zinc-800 dark:text-white md:min-h-10 md:min-w-10"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "light" ? (
          <HiOutlineMoon className="h-4 w-4 stroke-2" />
        ) : (
          <HiOutlineSun className="h-5 w-5 stroke-2" />
        )}
      </Button>

      <Button
        onClick={(e) => handleSignOut(e)}
        variant="outline"
        className="flex h-9 min-w-9 cursor-pointer rounded-full border-zinc-200 p-0 text-xl text-zinc-950 dark:border-zinc-800 dark:text-white md:min-h-10 md:min-w-10"
      >
        <HiOutlineArrowRightOnRectangle className="h-4 w-4 stroke-2 text-zinc-950 dark:text-white" />
      </Button>
      <a className="w-full" href="/dashboard/settings">
        <Avatar className="h-9 min-w-9 md:min-h-10 md:min-w-10">
          <AvatarImage src={user?.profile} />
          <AvatarFallback className="font-bold">
            {user?.nickname ? user.nickname.charAt(0) : ""}
          </AvatarFallback>
        </Avatar>
      </a>
    </div>
  );
}
