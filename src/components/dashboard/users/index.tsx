/*eslint-disable*/
"use client";

import MainChart from "@/components/dashboard/main/cards/MainChart";
import MainDashboardTable from "@/components/dashboard/main/cards/MainDashboardTable";
import DashboardLayout from "@/components/layout";
import { User } from "@/model/User";
import tableDataUserReports from "@/variables/tableDataUserReports";

interface Props {
  user: User | null | undefined;
  userDetails: { [x: string]: any } | null | any;
}

export default function Settings(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      userDetails={props.userDetails}
      title="Album Page"
      description=""
    >
      <div className="h-full w-full">
        <div className="h-full w-full rounded-lg ">
          <MainDashboardTable tableData={tableDataUserReports} />
        </div>
      </div>
    </DashboardLayout>
  );
}
