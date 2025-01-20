/*eslint-disable*/
"use client";

import MainChart from "@/components/dashboard/main/cards/MainChart";
import MainDashboardTable from "@/components/dashboard/main/cards/MainDashboardTable";
import DashboardLayout from "@/components/layout";
import { User } from "@/model/User";
import tableDataUserReports from "@/variables/tableDataUserReports";

interface Props {
  user: User | null | undefined;
}

export default function MainView(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      title="Subscription Page"
      description="Manage your subscriptions"
    >
      <div className="h-full w-full">
        <div className="mb-5 flex gap-5 flex-col xl:flex-row w-full">
          <MainChart />
        </div>
        {/* Conversion and talbes*/}
        <div className="h-full w-full rounded-lg ">
          <MainDashboardTable tableData={tableDataUserReports} />
        </div>
      </div>
    </DashboardLayout>
  );
}
