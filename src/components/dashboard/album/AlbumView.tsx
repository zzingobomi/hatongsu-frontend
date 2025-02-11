"use client";

import DashboardLayout from "@/components/layout";
import { User } from "@/model/User";
import AlbumImageTable from "./components/AlbumImageTable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlbumImagesError,
  AlbumImagesQuery,
  AlbumImagesResponse,
  getAlbumImages,
} from "@/lib/getAlbumImages";
import { useEffect, useState } from "react";
import { OnChangeFn } from "@tanstack/react-table";

interface Props {
  user: User | null | undefined;
}

export default function AlbumView(props: Props) {
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const initialSort = [{ orderBy: "dateTimeOriginal", order: "desc" }];
  const [sort, setSort] = useState(JSON.stringify(initialSort));

  const { data, error, isLoading } = useQuery<
    AlbumImagesResponse,
    AlbumImagesError,
    AlbumImagesResponse,
    [string, AlbumImagesQuery]
  >({
    queryKey: ["albumImages", { ...pagination, sort }],
    queryFn: getAlbumImages,
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

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["albumImages", { ...pagination, sort }],
    });

    if (data && data.albumImages.length === 1 && pagination.pageIndex > 0) {
      setPagination((prev) => ({
        ...prev,
        pageIndex: prev.pageIndex - 1,
      }));
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <DashboardLayout user={props.user} title="Album Page" description="">
      <div className="h-full w-full">
        <div className="h-full w-full rounded-lg ">
          <AlbumImageTable
            data={data?.albumImages ?? []}
            totalCount={data?.totalCount ?? 0}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            onDeleteSuccess={handleDeleteSuccess}
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
