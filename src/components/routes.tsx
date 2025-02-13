import { IRoute } from "@/@types/types";
import {
  HiOutlineHome,
  HiOutlinePhoto,
  HiOutlineUsers,
  HiOutlineCog8Tooth,
  HiOutlineChartBar,
  HiOutlineCloudArrowUp,
} from "react-icons/hi2";

export const routes: IRoute[] = [
  {
    name: "Dashboard",
    path: "/dashboard/main",
    icon: <HiOutlineHome className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />,
    collapse: false,
  },
  {
    name: "Album",
    path: "/dashboard/album",
    icon: (
      <HiOutlinePhoto className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false,
  },
  {
    name: "Chart",
    path: "/dashboard/chart",
    icon: (
      <HiOutlineChartBar className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false,
  },
  {
    name: "Users List",
    path: "/dashboard/users",
    icon: (
      <HiOutlineUsers className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false,
  },
  // {
  //   name: "Profile Settings",
  //   path: "/dashboard/settings",
  //   icon: (
  //     <HiOutlineCog8Tooth className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
  //   ),
  //   collapse: false,
  // },
  {
    name: "Image Upload",
    path: "/dashboard/upload",
    icon: (
      <HiOutlineCloudArrowUp className="-mt-[7px] h-4 w-4 stroke-2 text-inherit" />
    ),
    collapse: false,
  },
];
