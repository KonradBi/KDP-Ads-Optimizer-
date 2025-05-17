import Link from 'next/link';

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  currentSearchQuery?: string; // Optional: der aktuelle Suchbegriff
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  basePath,
  currentSearchQuery,
}) => {
  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page or less
  }

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  // Create an array of page numbers to display, e.g., [1, 2, ..., 5, 6, 7, ..., 10, 11]
  const pageNumbers = [];
  const maxPagesToShow = 7; // Adjust as needed
  const sidePages = Math.floor((maxPagesToShow - 3) / 2); // Pages on each side of current, minus first, last, and ellipses

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1); // Always show first page

    let startRange = Math.max(2, currentPage - sidePages);
    let endRange = Math.min(totalPages - 1, currentPage + sidePages);

    if (currentPage - sidePages <= 2) {
        endRange = Math.min(totalPages -1, maxPagesToShow - 2);
    }
    if (currentPage + sidePages >= totalPages - 1) {
        startRange = Math.max(2, totalPages - (maxPagesToShow - 3));
    }


    if (startRange > 2) {
      pageNumbers.push('...');
    }

    for (let i = startRange; i <= endRange; i++) {
      pageNumbers.push(i);
    }

    if (endRange < totalPages - 1) {
      pageNumbers.push('...');
    }

    pageNumbers.push(totalPages); // Always show last page
  }


  return (
    <nav aria-label="Pagination" className="flex justify-center items-center space-x-2 mt-12 mb-8">
      {hasPreviousPage && (
        <Link
          href={`${basePath}?page=${currentPage - 1}${currentSearchQuery ? `&q=${encodeURIComponent(currentSearchQuery)}` : ''}`}
          className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-600/50 rounded-md transition-colors"
        >
          Previous
        </Link>
      )}

      {pageNumbers.map((page, index) =>
        typeof page === 'number' ? (
          <Link
            key={index}
            href={`${basePath}?page=${page}${currentSearchQuery ? `&q=${encodeURIComponent(currentSearchQuery)}` : ''}`}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              currentPage === page
                ? 'bg-amber-500 text-slate-900 pointer-events-none'
                : 'text-slate-300 bg-slate-700/50 hover:bg-slate-600/50'
            }`}
          >
            {page}
          </Link>
        ) : (
          <span key={index} className="px-4 py-2 text-sm text-slate-400">
            {page}
          </span>
        )
      )}

      {hasNextPage && (
        <Link
          href={`${basePath}?page=${currentPage + 1}${currentSearchQuery ? `&q=${encodeURIComponent(currentSearchQuery)}` : ''}`}
          className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-600/50 rounded-md transition-colors"
        >
          Next
        </Link>
      )}
    </nav>
  );
};

export default PaginationControls;
