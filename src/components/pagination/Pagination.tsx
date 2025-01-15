import { Button } from "@/components/ui/button";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { generatePaginationArray } from "@/utils/generate-pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  canPreviousPage,
  canNextPage,
  siblingCount = 1,
}: PaginationProps) {
  const pages = generatePaginationArray(
    currentPage + 1,
    totalPages,
    siblingCount
  );

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canPreviousPage}
        className="flex items-center justify-center rounded-lg bg-transparent p-2 text-lg text-zinc-950 transition duration-200 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent"
      >
        <MdChevronLeft />
      </Button>

      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-zinc-500">
              ...
            </span>
          );
        }

        return (
          <Button
            key={page}
            className={`font-medium items-center justify-center rounded-lg p-2 text-sm transition duration-200 ${
              page === currentPage + 1
                ? "bg-primary text-white"
                : "border border-zinc-200 bg-zinc-200 dark:border-zinc-800 dark:text-white"
            }`}
            onClick={() => onPageChange(Number(page) - 1)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canNextPage}
        className="flex min-w-[34px] items-center justify-center rounded-lg bg-transparent p-2 text-lg text-zinc-950 transition duration-200 hover:bg-transparent active:bg-transparent dark:text-white dark:hover:bg-transparent dark:active:bg-transparent"
      >
        <MdChevronRight />
      </Button>
    </div>
  );
}
