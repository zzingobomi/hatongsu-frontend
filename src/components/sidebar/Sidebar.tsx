"use client";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  renderThumb,
  renderTrack,
  renderView,
} from "@/components/scrollbar/Scrollbar";
import Links from "@/components/sidebar/components/Links";
import SidebarCard from "@/components/sidebar/components/SidebarCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { PropsWithChildren, useContext } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { HiX } from "react-icons/hi";
import { HiBolt } from "react-icons/hi2";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

import { UserContext } from "@/contexts/layout";

import { IRoute } from "@/@types/types";

export interface SidebarProps extends PropsWithChildren {
  routes: IRoute[];
  [x: string]: any;
}

function Sidebar(props: SidebarProps) {
  const { routes } = props;

  const user = useContext(UserContext);
  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // e.preventDefault();
    // supabase.auth.signOut();
    // router.push('/dashboard/signin');
  };
  // SIDEBAR
  return (
    <div
      className={`lg:!z-99 fixed !z-[99] min-h-full w-[300px] transition-all md:!z-[99] xl:!z-0 ${
        props.variant === "auth" ? "xl:hidden" : "xl:block"
      } ${props.open ? "" : "-translate-x-[120%] xl:translate-x-[unset]"}`}
    >
      <Card
        className={`m-3 ml-3 h-[96.5vh] w-full overflow-hidden !rounded-lg border-zinc-200 pe-4 dark:border-zinc-800 sm:my-4 sm:mr-4 md:m-5 md:mr-[-50px]`}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <span
                className="absolute top-4 block cursor-pointer text-zinc-200 dark:text-white/40 xl:hidden"
                onClick={() => props.setOpen(false)}
              >
                <HiX />
              </span>
              <div className={`mt-8 flex items-center justify-center`}>
                <div className="me-2 flex h-[40px] w-[40px] items-center justify-center rounded-md bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                  <div className="relative w-10 h-10 rounded-md overflow-hidden">
                    <Image
                      src="/hatongsu.jpg"
                      alt="logo"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h5 className="me-2 text-2xl font-bold leading-5 text-zinc-950 dark:text-white">
                  Hatongsu
                </h5>
              </div>
              <div className="mb-8 mt-8 h-px bg-zinc-200 dark:bg-white/10" />
              {/* Nav item */}
              <ul>
                <Links routes={routes} />
              </ul>
            </div>
            {/* Free Horizon Card    */}
            <div className="mb-9 mt-7">
              {/* Sidebar profile info */}
              <div className="mt-5 flex w-full items-center rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
                <a href="/dashboard/dashboard/settings">
                  <Avatar className="min-h-10 min-w-10">
                    <AvatarImage src={user?.profile} />
                    <AvatarFallback className="font-bold dark:text-zinc-950">
                      {props.user?.nickname
                        ? props.user.nickname.charAt(0)
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                </a>
                <a href="/dashboard/settings">
                  <p className="ml-2 mr-3 flex items-center text-sm font-semibold leading-none text-zinc-950 dark:text-white">
                    {user?.nickname || "User"}
                  </p>
                </a>
                <Button
                  onClick={(e) => handleSignOut(e)}
                  variant="outline"
                  className="ml-auto flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-full p-0 text-center text-sm font-medium hover:dark:text-white"
                  type="submit"
                >
                  <HiOutlineArrowRightOnRectangle
                    className="h-4 w-4 stroke-2 text-zinc-950 dark:text-white"
                    width="16px"
                    height="16px"
                    color="inherit"
                  />
                </Button>
              </div>
            </div>
          </div>
        </Scrollbars>
      </Card>
    </div>
  );
}

// PROPS

export default Sidebar;
