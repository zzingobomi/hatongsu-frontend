"use client";

import DashboardLayout from "@/components/layout";
import Upload from "@/components/upload/Upload";
import { User } from "@/model/User";

interface Props {
  user: User | null | undefined;
}

export default function UploadView(props: Props) {
  return (
    <DashboardLayout
      user={props.user}
      title="Subscription Page"
      description="Manage your subscriptions"
    >
      <div className="h-full w-full">
        <div className="mb-5 flex gap-5 flex-col xl:flex-row w-full">
          <Upload />
        </div>
      </div>
    </DashboardLayout>
  );
}
