import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  OnChangeFn,
} from "@tanstack/react-table";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useMemo } from "react";
import { AlbumImage } from "@/model/AlbumImage";

interface AlbumImageTableProps {
  data: AlbumImage[];
  totalCount: number;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: OnChangeFn<{ pageIndex: number; pageSize: number }>;
  sort: string;
  setSort: (sort: string) => void;
  isLoading: boolean;
  error: { message: string } | null;
}

const columnHelper = createColumnHelper<AlbumImage>();

export default function AlbumImageTable({
  data,
  totalCount,
  pagination,
  onPaginationChange,
  sort,
  setSort,
  isLoading,
  error,
}: AlbumImageTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
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
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            PATH
          </p>
        ),
        cell: (info) => (
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
    ],
    []
  );

  const createPages = (count: number) => {
    const arrPageCount = [];

    for (let i = 1; i <= count; i++) {
      arrPageCount.push(i);
    }

    return arrPageCount;
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
    },
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card
      className={
        "h-full w-full border-zinc-200 p-0 dark:border-zinc-800 sm:overflow-auto"
      }
    >
      <div className="overflow-x-scroll xl:overflow-x-hidden">
        <Table className="w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableHeader
              key={headerGroup.id}
              className="border-b-[1px] border-zinc-200 p-6 dark:border-zinc-800"
            >
              <tr className="dark:border-zinc-800">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-zinc-200 pl-5 pr-4 pt-2 text-start dark:border-zinc-800"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  );
                })}
              </tr>
            </TableHeader>
          ))}
          <TableBody>
            {table
              .getRowModel()
              .rows.slice(0, pagination.pageSize)
              .map((row) => {
                return (
                  <TableRow
                    key={row.id}
                    className="px-6 dark:hover:bg-gray-900"
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className="w-max border-b-[1px] border-zinc-200 py-5 pl-5 pr-4 dark:border-white/10"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {/* pagination */}
        <div className="mt-2 flex h-20 w-full items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              TODO: per page
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
                  className={`font-mediumflex p-0 items-center justify-center rounded-lg p-2 text-sm transition duration-200 ${
                    pageNumber === pagination.pageIndex + 1
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
