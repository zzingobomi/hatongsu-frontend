"use client";

import DashboardLayout from "@/components/layout";
import { User } from "@/model/User";
import CountDateChart from "./components/CountDateChart";

interface Props {
  user: User | null | undefined;
}

export default function ChartView(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      title="Subscription Page"
      description="Manage your subscriptions"
    >
      <div className="h-full w-full">
        <div className="mb-5 flex gap-5 flex-col xl:flex-row w-full">
          <CountDateChart />
        </div>
      </div>
    </DashboardLayout>
  );
}
