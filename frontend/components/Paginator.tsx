import { Button } from "@/components/ui/button";
import { PaginationEllipsis, PaginationItem } from "@/components/ui/pagination";

const PaginationItems = (
  currentPageNum: number,
  totalPageNum: number,
  setPage: (page: number) => void,
  page: number
) => {
  const currentPage = currentPageNum;
  const totalPages = totalPageNum;
  const paginationItems = [];

  if (totalPages <= 5) {
    // If total pages are less than or equal to 5, show all pages
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <Button
            variant={i === currentPage ? "outline" : "ghost"}
            onClick={() => setPage(i)}
          >
            {i}
          </Button>
        </PaginationItem>
      );
    }
  } else {
    // Always show the first page
    paginationItems.push(
      <PaginationItem key={1}>
        <Button
          variant={1 === currentPage ? "outline" : "ghost"}
          onClick={() => setPage(1)}
        >
          1
        </Button>
      </PaginationItem>
    );

    // Show ellipsis if the current page is greater than 3
    if (currentPage > 3) {
      paginationItems.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    // Calculate start and end page numbers
    const startPage = Math.max(currentPage - 1, 2);
    const endPage = Math.min(currentPage + 1, totalPages - 1);

    // Add the middle page numbers
    for (let i = startPage; i <= endPage; i++) {
      paginationItems.push(
        <PaginationItem key={i}>
          <Button
            variant={i === currentPage ? "outline" : "ghost"}
            onClick={() => setPage(i)}
          >
            {i}
          </Button>
        </PaginationItem>
      );
    }

    // Show ellipsis if the current page is less than totalPages - 2
    if (currentPage < totalPages - 2) {
      paginationItems.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    // Always show the last page
    paginationItems.push(
      <PaginationItem key={totalPages}>
        <Button
          variant={totalPages === currentPage ? "outline" : "ghost"}
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </Button>
      </PaginationItem>
    );
  }

  return paginationItems;
};

export default PaginationItems;
