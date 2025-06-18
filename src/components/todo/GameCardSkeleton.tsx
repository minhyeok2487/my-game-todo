export const GameCardSkeleton = () => {
  return (
    <div className="bg-[#1F2937] rounded-lg border border-[#374151] flex flex-col shadow-lg min-h-[400px] animate-pulse">
      <div className="h-36 bg-gray-700 rounded-t-lg"></div>

      <div className="p-4 flex-grow">
        <div className="h-6 w-1/3 bg-gray-700 rounded-md mb-3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded-md"></div>
          <div className="h-4 w-5/6 bg-gray-700 rounded-md"></div>
        </div>

        <div className="h-6 w-1/3 bg-gray-700 rounded-md mb-3 mt-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};
