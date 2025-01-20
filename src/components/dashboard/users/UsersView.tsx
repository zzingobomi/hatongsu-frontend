"use client";

import DashboardLayout from "@/components/layout";
import {
  getUsers,
  UsersError,
  UsersQuery,
  UsersResponse,
} from "@/lib/getUsers";
import { User } from "@/model/User";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { OnChangeFn } from "@tanstack/react-table";
import UsersTable from "./components/UsersTable";

interface Props {
  user: User | null | undefined;
}

export default function UsersView(props: Props) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const initialSort = [{ orderBy: "createdAt", order: "desc" }];
  const [sort, setSort] = useState(JSON.stringify(initialSort));

  const { data, error, isLoading } = useQuery<
    UsersResponse,
    UsersError,
    UsersResponse,
    [string, UsersQuery]
  >({
    queryKey: ["users", { ...pagination, sort }],
    queryFn: getUsers,
  });

  const handlePaginationChange: OnChangeFn<{
    pageIndex: number;
    pageSize: number;
  }> = (updaterOrValue) => {
    setPagination((prev) =>
      typeof updaterOrValue === "function"
        ? updaterOrValue(prev)
        : updaterOrValue
    );
  };

  return (
    <DashboardLayout user={props.user} title="User Page" description="">
      <div className="h-full w-full">
        <div className="h-full w-full rounded-lg ">
          <UsersTable
            data={data?.users ?? []}
            totalCount={data?.totalCount ?? 0}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            sort={sort}
            setSort={setSort}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
