import React from "react";

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const maxVisible = 5;

  const getPages = () => {
    const result = [];

    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > pages) {
      end = pages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      result.push(i);
    }

    return result;
  };

  const pagesArray = getPages();

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
      
      {/* 🔥 First */}
      <button
        onClick={() => onPageChange(1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        First
      </button>

      {/* 🔥 Prev */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Prev
      </button>

      {/* 🔥 Left Dots */}
      {pagesArray[0] > 1 && <span className="px-2">...</span>}

      {/* 🔥 Page Numbers */}
      {pagesArray.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 border rounded ${
            p === page ? "bg-blue-600 text-white" : ""
          }`}
        >
          {p}
        </button>
      ))}

      {/* 🔥 Right Dots */}
      {pagesArray[pagesArray.length - 1] < pages && (
        <span className="px-2">...</span>
      )}

      {/* 🔥 Next */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Next
      </button>

      {/* 🔥 Last */}
      <button
        onClick={() => onPageChange(pages)}
        disabled={page === pages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;