// components/loaders/TableSkeleton.jsx
const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 mb-3">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="h-4 bg-gray-300 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;   