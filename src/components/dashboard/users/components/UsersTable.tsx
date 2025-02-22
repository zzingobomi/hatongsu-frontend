import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  OnChangeFn,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { User } from "@/model/User";
import { Pagination } from "@/components/pagination/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/ko";

interface UsersTableProps {
  data: User[];
  totalCount: number;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: OnChangeFn<{ pageIndex: number; pageSize: number }>;
  sort: string;
  setSort: (sort: string) => void;
  isLoading: boolean;
  error: { message: string } | null;
}

const columnHelper = createColumnHelper<User>();

export default function UsersTable({
  data,
  totalCount,
  pagination,
  onPaginationChange,
  sort,
  setSort,
  isLoading,
  error,
}: UsersTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("email", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            E-mail
          </p>
        ),
        cell: (info) => (
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor("nickname", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            닉네임
          </p>
        ),
        cell: (info) => (
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor("role", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            역할
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

  const handlePerPageChange = (value: string) => {
    const newPageSize = parseInt(value, 10);
    onPaginationChange({
      pageIndex: 0,
      pageSize: newPageSize,
    });
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
                      className="border-zinc-200 pl-5 pr-4 pt-2 text-start dark:border-zinc-800"
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
            <Select
              defaultValue={pagination.pageSize.toString()}
              onValueChange={handlePerPageChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="항목 개수" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5개씩 보기</SelectItem>
                <SelectItem value="10">10개씩 보기</SelectItem>
                <SelectItem value="20">20개씩 보기</SelectItem>
                <SelectItem value="50">50개씩 보기</SelectItem>
                <SelectItem value="100">100개씩 보기</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Pagination
            currentPage={pagination.pageIndex}
            totalPages={table.getPageCount()}
            onPageChange={(page) => table.setPageIndex(page)}
            canPreviousPage={table.getCanPreviousPage()}
            canNextPage={table.getCanNextPage()}
            siblingCount={2}
          />
        </div>
      </div>
    </Card>
  );
}
