"use client";

import DashboardLayout from "@/components/layout";
import { User } from "@/model/User";
import tableDataUserReports from "@/variables/tableDataUserReports";
import AlbumImageTable from "./components/AlbumImageTable";

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
}

export default function AlbumComponent(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Album Page"
      description=""
    >
      <div className="h-full w-full">
        <div className="h-full w-full rounded-lg ">
          <AlbumImageTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
