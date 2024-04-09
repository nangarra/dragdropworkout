import { Skeleton } from "@mui/material";

const Loader = () => (
  <div className="flex flex-col gap-8 p-2">
    <div className="flex flex-col gap-2">
      <div className="flex w-full justify-between">
        <Skeleton variant="rectangular" className="rounded-md w-[300px]" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-[50px]" height={30} />
      </div>
      <div className="flex w-full justify-between">
        <Skeleton variant="rectangular" className="rounded-md w-[80px]" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-[120px]" height={30} />
      </div>
    </div>
    <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
    <div className="grid sm:grid-cols-3 justify-center max-w-[600px] gap-2">
      <Skeleton variant="rectangular" className="rounded-md w-[200px]" height={200} />
      <div className="flex flex-col gap-4 pl-4 w-full sm:col-span-2 items-center">
        <Skeleton variant="rectangular" className="rounded-md w-[200px]" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <div className="grid grid-cols-2 text-xs justify-center items-center h-full gap-2 w-full">
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        </div>
      </div>
    </div>
    <div className="grid sm:grid-cols-3 justify-center max-w-[600px] gap-2">
      <Skeleton variant="rectangular" className="rounded-md w-[200px]" height={200} />
      <div className="flex flex-col gap-4 pl-4 w-full sm:col-span-2 items-center">
        <Skeleton variant="rectangular" className="rounded-md w-[200px]" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <div className="grid grid-cols-2 text-xs justify-center items-center h-full gap-2 w-full">
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        </div>
      </div>
    </div>
    <div className="grid sm:grid-cols-3 justify-center max-w-[600px] gap-2">
      <Skeleton variant="rectangular" className="rounded-md w-[200px]" height={200} />
      <div className="flex flex-col gap-4 pl-4 w-full sm:col-span-2 items-center">
        <Skeleton variant="rectangular" className="rounded-md w-[200px]" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <div className="grid grid-cols-2 text-xs justify-center items-center h-full gap-2 w-full">
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        </div>
      </div>
    </div>
    <div className="grid sm:grid-cols-3 justify-center max-w-[600px] gap-2">
      <Skeleton variant="rectangular" className="rounded-md w-[200px]" height={200} />
      <div className="flex flex-col gap-4 pl-4 w-full sm:col-span-2 items-center">
        <Skeleton variant="rectangular" className="rounded-md w-[200px]" height={30} />
        <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        <div className="grid grid-cols-2 text-xs justify-center items-center h-full gap-2 w-full">
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
          <Skeleton variant="rectangular" className="rounded-md w-full" height={30} />
        </div>
      </div>
    </div>
  </div>
);

export default Loader;
