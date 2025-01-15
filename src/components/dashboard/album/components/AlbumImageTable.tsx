import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlbumImagesError,
  AlbumImagesQuery,
  AlbumImagesResponse,
  getAlbumImages,
} from "@/lib/getAlbumImages";
import { AlbumImage } from "@/model/AlbumImage";
import { useQuery } from "@tanstack/react-query";
import {
  PaginationState,
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const columnHelper = createColumnHelper<AlbumImage>();

export default function AlbumImageTable() {
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        id: "id",
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            ID
          </p>
        ),
        cell: (info) => (
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor("path", {
        id: "path",
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            PATH
          </p>
        ),
        cell: (info: any) => (
          <div className="flex w-full items-center gap-[14px]">
            <p className="text-sm font-medium text-zinc-950 dark:text-white">
              {info.getValue()}
            </p>
          </div>
        ),
      }),
    ],
    []
  );

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 3,
    pageSize: 10,
  });
  const [sort, setSort] = useState(
    '[{"orderBy":"dateTimeOriginal","order":"desc"}]'
  );

  // TODO: Pagenation 할때 왜 정상적으로 업데이트 되었다가 다시 0으로 초기화 되는가?
  // 초기값을 3으로 하면 처음에는 정상적으로 4페이지에 갔다가 다시 0으로 온다?
  console.log("pageIndex", pageIndex, "pageSize", pageSize, "sort", sort);

  const { data, error, isLoading } = useQuery<
    AlbumImagesResponse,
    AlbumImagesError,
    AlbumImagesResponse,
    [string, AlbumImagesQuery]
  >({
    queryKey: ["albumImages", { pageIndex, pageSize, sort }],
    queryFn: getAlbumImages,
  });

  const createPages = (count: number) => {
    const arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  // const pagination = useMemo(
  //   () => ({
  //     pageIndex,
  //     pageSize,
  //   }),
  //   [pageIndex, pageSize]
  // );

  const table = useReactTable({
    data: data?.albumImages ?? [],
    columns,
    // state: {
    //   pagination,
    // },
    pageCount: data ? Math.ceil(data.totalCount / pageSize) : -1,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    //getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: false,
    debugHeaders: false,
    debugColumns: false,
  });

  // const handleSortChange = (orderBy: string, order: string) => {
  //   const sortValue = JSON.stringify([{ orderBy, order }]);
  //   setSort(sortValue);
  // };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card className="h-full w-full border-zinc-200 p-0 dark:border-zinc-800 sm:overflow-auto">
      <div className="overflow-x-scroll xl:overflow-x-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {table.getHeaderGroups().map((headerGroup) =>
                headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="border-zinc-200 pl-5 pr-4 pt-2 text-start dark:border-zinc-800"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="px-6 dark:hover:bg-gray-900">
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="w-max border-b-[1px] border-zinc-200 py-5 pl-5 pr-4 dark:border-white/10"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* pagination */}
        <div className="mt-2 flex h-20 w-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              TODO: perpage 구현하기
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className={`flex items-center justify-center rounded-lg bg-transparent p-2 text-lg text-zinc-950 transition duration-200 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent`}
            >
              <MdChevronLeft />
            </Button>
            {createPages(table.getPageCount()).map((pageNumber, index) => {
              return (
                <Button
                  className={`font-mediumflex items-center justify-center rounded-lg p-2 text-sm transition duration-200 ${
                    pageNumber === pageIndex + 1
                      ? ""
                      : "border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:text-white"
                  }`}
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                  key={index}
                >
                  {pageNumber}
                </Button>
              );
            })}
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className={`flex min-w-[34px] items-center justify-center rounded-lg bg-transparent p-2 text-lg text-zinc-950 transition duration-200 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent`}
            >
              <MdChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
