import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { AlbumImage } from "@/model/AlbumImage";
import { Pagination } from "@/components/pagination/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { TableSort } from "./TableSort";
import Image from "next/image";

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
  const [deleteIds, setDeleteIds] = useState<string[]>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("path", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            이미지
          </p>
        ),
        cell: (info) => {
          const imagePath = info.getValue();

          return (
            <div className="relative w-16 h-16">
              <Image
                loader={({ src }) => src}
                src={imagePath}
                alt="Album Image"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          );
        },
      }),
      columnHelper.accessor("filename", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            파일명
          </p>
        ),
        cell: (info) => (
          <p className="text-sm font-medium text-zinc-950 dark:text-white">
            {info.getValue()}
          </p>
        ),
      }),
      columnHelper.accessor("dateTime", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            촬영 시간
          </p>
        ),
        cell: (info) => {
          const date = info.getValue();
          if (!date) return "-";

          return (
            <p className="text-sm font-medium text-zinc-950 dark:text-white">
              {dayjs(date).locale("ko").format("YYYY-MM-DD HH:mm")}
            </p>
          );
        },
      }),
      columnHelper.accessor("dateTimeOriginal", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            원본 촬영 시간
          </p>
        ),
        cell: (info) => {
          const date = info.getValue();
          if (!date) return null;

          return (
            <p className="text-sm font-medium text-zinc-950 dark:text-white">
              {dayjs(date).locale("ko").format("YYYY-MM-DD HH:mm")}
            </p>
          );
        },
      }),
      columnHelper.accessor("dateTimeDigitized", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            디지털화 시간
          </p>
        ),
        cell: (info) => {
          const date = info.getValue();
          if (!date) return null;

          return (
            <p className="text-sm font-medium text-zinc-950 dark:text-white">
              {dayjs(date).locale("ko").format("YYYY-MM-DD HH:mm")}
            </p>
          );
        },
      }),
      columnHelper.accessor("createdAt", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            생성시간
          </p>
        ),
        cell: (info) => {
          const date = info.getValue();
          if (!date) return null;

          return (
            <p className="text-sm font-medium text-zinc-950 dark:text-white">
              {dayjs(date).locale("ko").format("YYYY-MM-DD HH:mm")}
            </p>
          );
        },
      }),
      columnHelper.accessor("updatedAt", {
        header: () => (
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            수정시간
          </p>
        ),
        cell: (info) => {
          const date = info.getValue();
          if (!date) return null;

          return (
            <p className="text-sm font-medium text-zinc-950 dark:text-white">
              {dayjs(date).locale("ko").format("YYYY-MM-DD HH:mm")}
            </p>
          );
        },
      }),
      columnHelper.accessor("checked", {
        id: "checked",
        header: () => (
          <div className="pr-4">
            <Checkbox
              checked={deleteIds.length === data.length && data.length > 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  setDeleteIds(data.map((item) => item.id));
                } else {
                  setDeleteIds([]);
                }
              }}
            />
          </div>
        ),
        cell: (info: any) => (
          <div>
            <Checkbox
              checked={deleteIds.includes(info.row.original.id)}
              onCheckedChange={() => toggleSelect(info.row.original.id)}
            />
          </div>
        ),
      }),
    ],
    [deleteIds, data]
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

  const toggleSelect = (id: string) => {
    setDeleteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (deleteIds.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }
    console.log("선택된 항목의 ID:", deleteIds);
    // TODO: 삭제 로직 추가
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card
      className={
        "h-full w-full border-zinc-200 p-0 dark:border-zinc-800 sm:overflow-auto"
      }
    >
      <div className="p-4 flex justify-between items-center">
        <TableSort sort={sort} onSortChange={setSort} />
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          삭제하기
        </button>
      </div>
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
