export const generatePaginationArray = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
) => {
  const pages = [];

  // Always show first page
  pages.push(1);

  // Calculate boundaries
  const leftSibling = Math.max(currentPage - siblingCount + 1, 2);
  const rightSibling = Math.min(currentPage + siblingCount + 1, totalPages - 1);

  // Add left ellipsis indicator
  if (leftSibling > 2) {
    pages.push("...");
  }

  // Add middle pages
  for (let i = leftSibling; i <= rightSibling; i++) {
    pages.push(i);
  }

  // Add right ellipsis indicator
  if (rightSibling < totalPages - 1) {
    pages.push("...");
  }

  // Add last page if there are multiple pages
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
};
