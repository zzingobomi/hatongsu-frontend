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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { AlbumImage, GallerySpotType } from "@/model/AlbumImage";
import { Pagination } from "@/components/pagination/Pagination";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { TableSort } from "./TableSort";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { deleteAlbumImages } from "@/lib/deleteAlbumImages";
import { updateGallerySpot } from "@/lib/updateGallerySpot";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { UserRole } from "@/lib/user.role";

interface AlbumImageTableProps {
  data: AlbumImage[];
  totalCount: number;
  pagination: { pageIndex: number; pageSize: number };
  onPaginationChange: OnChangeFn<{ pageIndex: number; pageSize: number }>;
  onDeleteSuccess?: () => void;
  onSpotUpdateSuccess?: () => void;
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
  onDeleteSuccess,
  onSpotUpdateSuccess,
  sort,
  setSort,
  isLoading,
  error,
}: AlbumImageTableProps) {
  const { data: session } = useSession();
  const { toast } = useToast();

  // 앨범 이미지 삭제
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  // 갤러리 spot 업데이트
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [spotUpdateImage, setSpotUpdateImage] = useState<{
    id: string;
    currentSpot: GallerySpotType;
    newSpot: GallerySpotType;
  } | null>(null);

  const columns = useMemo(() => {
    const baseColumns = [
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
    ];

    if (session?.user?.role === UserRole.ADMIN) {
      baseColumns.push(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        columnHelper.accessor<GallerySpotType, "gallerySpotType">(
          "gallerySpotType",
          {
            header: () => (
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                갤러리내 위치
              </p>
            ),
            cell: (info) => {
              const image = info.row.original;
              const [localValue, setLocalValue] = useState(
                image.gallerySpotType
              );

              return (
                <>
                  <Select
                    value={localValue}
                    onValueChange={(newValue) => {
                      setSpotUpdateImage({
                        id: image.id,
                        currentSpot: image.gallerySpotType,
                        newSpot: newValue as GallerySpotType,
                      });
                      setIsConfirmModalOpen(true);
                    }}
                  >
                    <SelectTrigger
                      className={clsx(
                        "w-[120px] text-sm font-medium text-zinc-950 dark:text-white transition-all",
                        {
                          "border border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-900/30":
                            localValue && localValue !== GallerySpotType.None,
                          "hover:border-zinc-300 dark:hover:border-zinc-600":
                            !localValue || localValue === GallerySpotType.None,
                        }
                      )}
                    >
                      {localValue && localValue !== GallerySpotType.None ? (
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                          <SelectValue />
                        </div>
                      ) : (
                        <SelectValue placeholder="Select spot" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GallerySpotType).map((spotType) => (
                        <SelectItem
                          key={spotType}
                          value={spotType}
                          className="text-sm"
                        >
                          {spotType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              );
            },
          }
        )
      );

      baseColumns.push(
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
        })
      );
    }

    return baseColumns;
  }, [session, deleteIds, data]);

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

  const handleDelete = async () => {
    if (deleteIds.length === 0) {
      toast({
        title: "삭제할 항목을 선택해주세요",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      await deleteAlbumImages({ imageIds: deleteIds });

      setDeleteIds([]);
      onDeleteSuccess?.();
    } catch (error) {
      console.error("Error deleting album images", error);
      toast({
        title: "이미지 삭제 중 오류가 발생했습니다",
        description: (error as Error).message,
        variant: "destructive",
      });
      return;
    } finally {
      setIsDeleting(false);
    }
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
        {session?.user?.role === UserRole.ADMIN && (
          <button
            onClick={handleDelete}
            disabled={deleteIds.length === 0 || isDeleting}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isDeleting
              ? "삭제 중..."
              : deleteIds.length > 0
              ? `선택 항목 삭제 (${deleteIds.length})`
              : "삭제하기"}
          </button>
        )}
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

      {/* 확인 모달 */}
      {spotUpdateImage && (
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>갤러리 위치 변경 확인</DialogTitle>
              <DialogDescription className="text-zinc-700 dark:text-zinc-300">
                {data.find((img) => img.id === spotUpdateImage.id)?.filename}의
                위치를
                <span className="mx-2 font-medium line-through text-zinc-500 dark:text-zinc-400">
                  {spotUpdateImage.currentSpot}
                </span>
                →
                <span className="mx-2 font-semibold bg-zinc-100/50 dark:bg-zinc-800/50 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100">
                  {spotUpdateImage.newSpot}
                </span>
                로 변경하시겠습니까?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setSpotUpdateImage(null);
                }}
              >
                취소
              </Button>
              <Button
                onClick={async () => {
                  try {
                    await updateGallerySpot({
                      imageId: spotUpdateImage.id,
                      spotType: spotUpdateImage.newSpot,
                    });

                    toast({ title: "성공적으로 업데이트 되었습니다." });
                    onSpotUpdateSuccess?.();
                  } catch (error) {
                    toast({ title: "업데이트 실패", variant: "destructive" });
                  } finally {
                    setIsConfirmModalOpen(false);
                    setSpotUpdateImage(null);
                  }
                }}
              >
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
